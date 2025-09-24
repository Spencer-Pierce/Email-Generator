from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import openai

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found")
print("✅ OpenAI API Key loaded successfully")

client = openai.OpenAI(api_key=openai_api_key)  # new client

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_email(data: Prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system", 
                    "content": """You are an AI assistant that only helps write professional emails.
                    If the user's prompt is not about writing emails, respond with:
                    "I'm sorry, I can't help with that, but can I assist you with generating an email?"
                    Otherwise, generate the email based on the prompt."""
                },
                {"role": "user", "content": data.prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        email_text = response.choices[0].message.content
        return {"email": email_text}
    except Exception as e:
        print("Error calling OpenAI:", e)
        return {"error": str(e)}
