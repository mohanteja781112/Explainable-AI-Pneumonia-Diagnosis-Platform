from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import cv2
import base64
import os
import tempfile
from dotenv import load_dotenv
from fpdf import FPDF
import google.generativeai as genai

load_dotenv()

# Initialize the Web Server
app = FastAPI(title="Pneumonia Detection AI")

# Allow the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load AI Model
print("Loading Medical AI Model...")
MODEL = tf.keras.models.load_model('pneumonia_model.keras')
print("Model Loaded Successfully!")

# Initialize Gemini Chatbot if key exists
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY and GEMINI_KEY != "your_api_key_here":
    genai.configure(api_key=GEMINI_KEY)
    llm_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    llm_model = None


def preprocess_image(image_bytes):
    img = tf.io.decode_image(image_bytes, channels=3, expand_animations=False)
    img = tf.image.resize(img, [224, 224])
    img_array = tf.expand_dims(img, axis=0)
    return img_array


def generate_gradcam(img_array, prediction):
    try:
        with tf.GradientTape() as tape:
            x = img_array
            conv_outputs = None
            loss = None
            for layer in MODEL.layers:
                if isinstance(layer, tf.keras.layers.InputLayer):
                    continue

                # Bypass sigmoid in the final Dense layer to avoid vanishing
                # gradients
                if layer.name == 'dense' or isinstance(
                        layer, tf.keras.layers.Dense):
                    x = tf.matmul(x, layer.kernel)
                    if layer.use_bias:
                        x = x + layer.bias
                    loss = x[:, 0]
                    break

                x = layer(x)
                if layer.name == 'densenet121':
                    conv_outputs = x
                    tape.watch(conv_outputs)

        if loss is None or conv_outputs is None:
            raise ValueError("Could not find required layers in the model.")

        grads = tape.gradient(loss, conv_outputs)

        # If predicting Pneumonia (class 0), we want the features that pushed
        # the score towards 0.
        if prediction < 0.5:
            grads = -grads

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0)

        max_val = tf.math.reduce_max(heatmap)
        if max_val > 0:
            heatmap = heatmap / max_val

        return heatmap.numpy()
    except Exception as e:
        print("Grad-CAM error:", e)
        return np.zeros((7, 7))


def overlay_heatmap(image_bytes, heatmap):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img)

    heatmap_resized = cv2.resize(heatmap, (224, 224))
    heatmap_resized = np.uint8(255 * heatmap_resized)
    heatmap_colormapped = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
    heatmap_colormapped = cv2.cvtColor(
        heatmap_colormapped,
        cv2.COLOR_BGR2RGB)  # Convert BGR to RGB

    superimposed_img = heatmap_colormapped * 0.4 + img_array * 0.6
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)

    _, buffer = cv2.imencode(
        '.jpg', cv2.cvtColor(
            superimposed_img, cv2.COLOR_RGB2BGR))
    return base64.b64encode(buffer).decode('utf-8')


@app.post("/predict")
async def predict_pneumonia(file: UploadFile = File(...)):
    image_bytes = await file.read()
    processed_image = preprocess_image(image_bytes)

    prediction = MODEL.predict(processed_image)[0][0]
    confidence = float(prediction)

    if confidence > 0.5:
        diagnosis = "Normal"
        confidence_percent = round(confidence * 100, 2)
    else:
        diagnosis = "Pneumonia"
        confidence_percent = round((1 - confidence) * 100, 2)

    # Generate Explainable AI Heatmap
    heatmap = generate_gradcam(processed_image, prediction)
    heatmap_base64 = overlay_heatmap(image_bytes, heatmap)
    original_base64 = base64.b64encode(image_bytes).decode('utf-8')

    return {
        "diagnosis": diagnosis,
        "confidence": f"{confidence_percent}%",
        "message": "AI diagnosis complete. Please consult a human doctor for final verification.",
        "heatmap": f"data:image/jpeg;base64,{heatmap_base64}",
        "original": f"data:image/jpeg;base64,{original_base64}"}


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def medical_chat(req: ChatRequest):
    if not llm_model:
        return {
            "reply": "[Mock Mode] Chatbot is working, but LLM API key is not configured in the .env file! Add your Gemini key to use real AI."}

    try:
        prompt = f"You are a helpful Medical AI assistant specializing in Chest X-Rays and Pneumonia. Keep responses brief, informative, and professional. The user asks: {
            req.message}"
        response = llm_model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Error communicating with LLM: {str(e)}"}


class ReportRequest(BaseModel):
    patientName: str
    patientId: str
    diagnosis: str
    confidence: str
    originalImageBase64: str
    heatmapImageBase64: str


@app.post("/generate-report")
async def generate_report(req: ReportRequest):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("helvetica", size=16, style='B')
    pdf.cell(200, 10, text="Clinical Decision Support System Report", new_x="LMARGIN", new_y="NEXT", align="C")
    
    pdf.set_font("helvetica", size=12)
    pdf.ln(10)
    pdf.cell(200, 10, text=f"Patient Name: {req.patientName}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(200, 10, text=f"Patient ID: {req.patientId}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(200, 10, text=f"AI Diagnosis: {req.diagnosis}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(200, 10, text=f"Confidence Score: {req.confidence}", new_x="LMARGIN", new_y="NEXT")

    # Process images for PDF
    orig_path = None
    heat_path = None
    try:
        orig_data = base64.b64decode(req.originalImageBase64.split(",")[1])
        heat_data = base64.b64decode(req.heatmapImageBase64.split(",")[1])

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as orig_file:
            orig_file.write(orig_data)
            orig_path = orig_file.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as heat_file:
            heat_file.write(heat_data)
            heat_path = heat_file.name

        pdf.ln(10)
        pdf.cell(200, 10, text="Original X-Ray vs. AI Heatmap", new_x="LMARGIN", new_y="NEXT")
        # Add images: (image path, x position, y position, width)
        pdf.image(orig_path, x=10, y=90, w=80)
        pdf.image(heat_path, x=100, y=90, w=80)
    except Exception as e:
        print("Image processing error for PDF:", e)
    finally:
        if orig_path and os.path.exists(orig_path):
            os.remove(orig_path)
        if heat_path and os.path.exists(heat_path):
            os.remove(heat_path)

    pdf.set_y(190)
    pdf.set_font("helvetica", size=10, style='I')
    pdf.cell(200, 10, text="Disclaimer: This is an AI-generated report. Final diagnosis must be made by a certified medical professional.", new_x="LMARGIN", new_y="NEXT")

    # Generate PDF in memory and return as response to avoid file lock issues
    pdf_bytes = pdf.output()
    from fastapi import Response
    return Response(
        content=bytes(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="Report_{req.patientName}.pdf"'}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
