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

    # Sample cover letter as a structure guide
    sample_cover_letter = """
Dear Hiring Manager,

I am excited to apply for [Position] at [Company], and I am confident that my skills and experience make me a strong fit for this role. With a strong foundation in Artificial Intelligence and Data Science, I am passionate about developing innovative solutions that drive impact.

As a proficient programmer with expertise in languages such as C, Java, and Python, I have honed my skills in technologies like React, MongoDB, and SQL. My experience in full-stack development and web designing enables me to bring a unique perspective to solving complex problems.

Through my internships at Centillion and Intel, I gained hands-on experience in security incident response, implementing security measures, and developing AI solutions. I successfully led a project on GenAI and Simple LLM Inference on CPU, demonstrating my ability to work independently and collaborate with teams.

My personal projects showcase my creativity and ability to develop user-friendly interfaces, manage complex systems, and implement machine learning models. My proficiency in HTML, CSS, JS, and other technologies enables me to bring innovative solutions to the table.

I am excited about the opportunity to bring my skills and experience to [Company] and contribute to the team's success. Thank you for considering my application. I look forward to discussing my qualifications further.

Sincerely,
Sathiyaseelan Selvam
"""
    
    # Generate prompt by incorporating resume content into the structure
    if sentiment == 1:
        query = (
            "Using the resume content provided, generate a cover letter that is short, crisp, and professional. "
            "The cover letter should follow the structure and tone of the following sample, but be customized to reflect the resume's details:\n"
            f"{sample_cover_letter}\n\nResume Content:\n{text}"
        )
    else:
        query = (
            "Create a short, formal cover letter using the resume content provided. "
            "Focus on essential qualifications and experience. The tone should be similar to the following sample, but use the actual resume content:\n"
            f"{sample_cover_letter}\n\nResume Content:\n{text}"
        )

    # Generate the cover letter using Qwen
    inputs = tokenizer_qwen(query, return_tensors="pt")
    response = llm_model_qwen.generate(**inputs, max_length=512)
    generated_cover_letter = tokenizer_qwen.decode(response[0], skip_special_tokens=True)
    
    return {"cover_letter": generated_cover_letter}


if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print(f"Public URL: {public_url}")

    uvicorn.run(app, host="0.0.0.0", port=5000)
