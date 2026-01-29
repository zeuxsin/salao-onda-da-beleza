const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export async function getServices() {
  const res = await fetch(`${API_URL}/services`);
  if (!res.ok) throw new Error("Falha ao buscar serviços");
  return res.json();
}

export async function createAppointment(data) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Falha ao criar agendamento");
  }
  return res.json();
}
