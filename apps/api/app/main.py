from fastapi import APIRouter, FastAPI
from app.db.supabase_client import supabase
from app.routes.health import router as health_router
from app.routes.clients import router as clients_router

router = APIRouter()
app = FastAPI()

app.include_router(router)
app.include_router(clients_router)
app.include_router(health_router)

@router.get("/db-test")
def db_test():
    response = supabase.table("clients").select("*").limit(1).execute()
    return response.data
