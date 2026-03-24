export function ClientCard({ client }: { client: { name: string; status: string } }) {
  return (
    <div>
      <h2>{client.name}</h2>
      <p>{client.status}</p>
    </div>
  )
}
