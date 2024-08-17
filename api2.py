import os
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import PyPDF2
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import ngrok

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Load BART model and tokenizer for cover letter generation
tokenizer_bart = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
bart_model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")

ngrok.set_auth_token("2a1iGE4Q5SDAF4mhdAVXeNptwJd_2GBcW2ACMaj2JoAJy8Gtt")
listener = ngrok.forward("127.0.0.1:5000", authtoken_from_env=True, domain="apparent-wolf-obviously.ngrok-free.app")


@app.post("/generate_cover_letter")
async def generate_cover_letter(file: UploadFile = File(...)):
    if file.filename == '':
        raise HTTPException(status_code=400, detail="No selected file")
    
    text = ""
    if file.content_type == 'application/pdf':
        reader = PyPDF2.PdfReader(file.file)
        number_of_pages = len(reader.pages)
        for i in range(number_of_pages):
            page = reader.pages[i]
            text += page.extract_text()
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    # Prepare the input for BART model
    inputs = tokenizer_bart(text, return_tensors="pt", max_length=1024, truncation=True)
    
    # Generate the cover letter
    summary_ids = bart_model.generate(inputs["input_ids"], max_length=200, num_beams=4, early_stopping=True)
    cover_letter = tokenizer_bart.decode(summary_ids[0], skip_special_tokens=True)
    
    return {"cover_letter": cover_letter}


if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print(f"Public URL: {public_url}")

    uvicorn.run(app, host="0.0.0.0", port=5000)
