export interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  status: "lead" | "active" | "completed"
  notes?: string
}
