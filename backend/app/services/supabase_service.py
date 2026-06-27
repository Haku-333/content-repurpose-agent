import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# We use the Service Role key on the backend to bypass RLS and have full admin access
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    raise ValueError("Missing Supabase URL or Service Role Key in environment variables.")

supabase_admin: Client = create_client(url, key)
