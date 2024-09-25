from transformers import BartForConditionalGeneration, BartTokenizer, GPT2LMHeadModel, GPT2Tokenizer
import PyPDF2
import sys

def extract_resume_text(pdf_path):
    # Read the resume PDF
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        resume_text = ""
        for page in reader.pages:
            resume_text += page.extract_text()
    return resume_text

def summarize_text(text, max_length=200):
    model_name = "facebook/bart-large-cnn"
    model = BartForConditionalGeneration.from_pretrained(model_name)
    tokenizer = BartTokenizer.from_pretrained(model_name)

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=1024)
    summary_ids = model.generate(inputs.input_ids, max_length=max_length, min_length=50, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

def generate_cover_letter(prompt):
    # Load pre-trained model and tokenizer
    model_name = 'gpt2'
    model = GPT2LMHeadModel.from_pretrained(model_name)
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)

    # Set pad_token to eos_token
    tokenizer.pad_token = tokenizer.eos_token

    # Encode input prompt
    inputs = tokenizer(prompt, return_tensors='pt', padding=True, truncation=True, max_length=500)

    # Generate attention mask
    attention_mask = inputs.attention_mask

    # Generate text
    outputs = model.generate(
        inputs.input_ids,
        attention_mask=attention_mask,
        max_new_tokens=200,  # Adjust max_new_tokens
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        pad_token_id=tokenizer.eos_token_id,
        temperature=0.7,  # Adjust temperature
        top_k=50,  # Use top_k sampling
        top_p=0.95,  # Use top_p sampling
        do_sample=True  # Enable sampling
    )

    # Decode the generated text
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text

if __name__ == "__main__":
    if len(sys.argv) > 4:
        resume_path = sys.argv[1]
        job_title = sys.argv[2]
        company_name = sys.argv[3]
        your_name = sys.argv[4]

        resume_text = extract_resume_text(resume_path)
        resume_summary = summarize_text(resume_text)

        refined_prompt = (
            f"Dear Hiring Manager,\n\n"
            f"I am writing to express my interest in the {job_title} position at {company_name}. "
            f"With my background in software development, I am confident in my ability to contribute to your team.\n\n"
            f"{resume_summary}\n\n"
            f"In my previous role at [Previous Company], I [describe your achievements and responsibilities]. "
            f"I am particularly skilled in [mention any relevant skills or experiences].\n\n"
            f"I am excited about the opportunity to bring my unique skills to {company_name} and help achieve your goals. "
            f"Thank you for considering my application. I look forward to the possibility of discussing this exciting opportunity with you.\n\n"
            f"Sincerely,\n"
            f"{your_name}"
        )
        
        print(generate_cover_letter(refined_prompt))
    else:
        print("Please provide the resume path, job title, company name, and your name as command-line arguments.")
