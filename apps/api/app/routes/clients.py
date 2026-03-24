from fastapi import APIRouter
from app.db.supabase_client import supabase

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.get("/")
def get_clients():
    return supabase.table("clients").select("*").execute().data


@router.post("/")
def create_client(client: dict):
    return supabase.table("clients").insert(client).execute().data


@router.patch("/{client_id}")
def update_client(client_id: str, updates: dict):
    return (
        supabase
        .table("clients")
        .update(updates)
        .eq("id", client_id)
        .execute()
        .data
    )


@router.delete("/{client_id}")
def delete_client(client_id: str):
    return (
        supabase
        .table("clients")
        .delete()
        .eq("id", client_id)
        .execute()
        .data
    )
