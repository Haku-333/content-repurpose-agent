from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_content(content: str, platform: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
    You are an expert content repurposing assistant.

    Convert the following content into:

    1. LinkedIn post
    2. X thread
    3. Instagram caption
    4. TikTok/Reel script
    5. Newsletter

    The user's primary target platform is: {platform}. Prioritize tone and format for that platform.

    Return ONLY valid JSON in this exact format:

    {{
      "linkedin": "...",
      "x": "...",
      "instagram": "...",
      "tiktok": "...",
      "newsletter": "..."
    }}

    Content:
    {content}
    """
    )

    return response.text