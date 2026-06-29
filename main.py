from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import io
import tensorflow as tf

# Initialize the Web Server
app = FastAPI(title="Pneumonia Detection AI")

# Allow the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your custom AI model when the server starts!
print("Loading Medical AI Model...")
MODEL = tf.keras.models.load_model('pneumonia_model.keras')
print("Model Loaded Successfully!")

def preprocess_image(image_bytes):
    """Formats the image exactly how DenseNet expects it"""
    # Open the image and resize it to 224x224 (what our AI expects)
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    
    # Convert image to numbers and shape it correctly
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
    
    # Very important: Apply DenseNet's specific color standardization
    img_array = tf.keras.applications.densenet.preprocess_input(img_array)
    
    return img_array

@app.post("/predict")
async def predict_pneumonia(file: UploadFile = File(...)):
    """The endpoint that receives the X-Ray and returns the diagnosis"""
    
    # Read the image sent by the frontend
    image_bytes = await file.read()
    
    # Preprocess it
    processed_image = preprocess_image(image_bytes)
    
    # Let the AI make a prediction!
    prediction = MODEL.predict(processed_image)[0][0]
    
    # Convert probability to diagnosis
    confidence = float(prediction)
    if confidence > 0.5:
        diagnosis = "Pneumonia"
        confidence_percent = round(confidence * 100, 2)
    else:
        diagnosis = "Normal"
        confidence_percent = round((1 - confidence) * 100, 2)
        
    return {
        "diagnosis": diagnosis,
        "confidence": f"{confidence_percent}%",
        "message": "AI diagnosis complete. Please consult a human doctor for final verification."
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
