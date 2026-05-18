import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the app/ directory (where it currently lives)
_env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_env_path)

SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY", "")

# Try to import supabase, but provide a stub if it fails
try:
    from supabase import create_client, Client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
except ImportError:
    print("Warning: Supabase not available. Database operations will be stubbed.")
    supabase = None
