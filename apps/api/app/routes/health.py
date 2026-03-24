from fastapi import APIRouter
from app.db.supabase_client import supabase

router = APIRouter()

@router.get("/db-test")
def db_test():
    response = supabase.table("clients").select("*").limit(1).execute()
    return response.data
