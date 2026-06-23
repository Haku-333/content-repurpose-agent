import os
from app.services.gemini_service import generate_content

try:
    print(generate_content("test", "linkedin"))
except Exception as e:
    import traceback
    traceback.print_exc()
