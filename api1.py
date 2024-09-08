import os
import torch
from transformers import AutoModelForCausalLM, AutoModelForSequenceClassification, AutoTokenizer
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

# Load Qwen model and tokenizer for cover letter generation
tokenizer_qwen = AutoTokenizer.from_pretrained("Qwen/Qwen-VL-Chat", trust_remote_code=True) 
llm_model_qwen = AutoModelForCausalLM.from_pretrained("sanjay-29-29/GreenAI", trust_remote_code=True, device_map='auto') 

# Load BERT model and tokenizer for text analysis
tokenizer_bert = AutoTokenizer.from_pretrained("bert-base-uncased")
bert_model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2) 

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
    
    # Analyze the resume content using BERT
    inputs = tokenizer_bert(text, return_tensors="pt", truncation=True, padding=True)
    outputs = bert_model(**inputs)
    sentiment = torch.argmax(outputs.logits, dim=-1).item()

    # Refine the query to ensure short, crisp, and necessary content
    if sentiment == 1:
        query = (
            "Generate a short, crisp, and professional cover letter. "
            "Highlight key skills, experience, and suitability for the role, "
            "based on the resume content: " + text
        )
    else:
        query = (
            "Generate a short and formal cover letter. "
            "Focus on essential qualifications and experience, "
            "while ensuring it is crisp and to the point. "
            "Use the resume content: " + text
        )

    # Generate the cover letter using Qwen
    response, history = llm_model_qwen.chat(tokenizer_qwen, query=query, history=None)
    
    return response


if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print(f"Public URL: {public_url}")

    uvicorn.run(app, host="0.0.0.0", port=5000)
