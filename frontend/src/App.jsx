import { useEffect, useState } from "react";
import { getServices, createAppointment } from "./services/api";

function formatPhoneBR(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11); // até 11 dígitos (DD + 9 dígitos)
  const ddd = digits.slice(0, 2);
  const part1 = digits.slice(2, 7);
  const part2 = digits.slice(7, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${ddd}) ${digits.slice(2)}`;
  return `(${ddd}) ${part1}-${part2}`;
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}


const WHATSAPP_NUMBER = "5527999090913";

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // estados do formulário
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const canOpenWhatsApp = clientName.trim().length >= 2 && onlyDigits(phone).length >= 10;
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const data = await getServices();
        setServices(data);
        // opcional: selecionar o primeiro serviço por padrão
        if (data.length > 0) setServiceName(data[0].name);
      } catch (e) {
        setError(e.message || "Erro ao carregar serviços");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e) {
  e.preventDefault();
  setSuccessMsg("");

  try {
    setSending(true);
    const cleanName = clientName.trim();
    const cleanPhoneDigits = onlyDigits(phone); // só números

    if (cleanName.length < 2) {
      alert("Informe um nome válido.");
      return;
    }

    if (cleanPhoneDigits.length < 10) {
      alert("Informe um telefone válido com DDD.");
      return;
    }

    const payload = {
      clientName: cleanName,
      phone: cleanPhoneDigits, // só números no banco
      serviceName: serviceName?.trim() || undefined,
      preferredDate: preferredDate?.trim() || undefined,
      notes: notes?.trim() || undefined,
    };

    const result = await createAppointment(payload);

    setSuccessMsg(`Pedido enviado! Protocolo: ${result.appointmentId}. Vamos entrar em contato em breve ✅`);

    // limpa formulário
    setClientName("");
    setPhone("");
    setPreferredDate("");
    setNotes("");
  } catch (err) {
    alert(err.message || "Falha ao enviar agendamento");
  } finally {
    setSending(false);
  }
}


  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Salão Onda da Beleza</h1>
      <p>Cariacica • Vila Independência</p>

      <hr />

      <h2>Serviços</h2>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && services.length === 0 && <p>Nenhum serviço cadastrado.</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {services.map((s) => {
          const price = (s.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
          const msg = `Olá! Vim pelo site do Salão Onda da Beleza 😊\nQuero agendar: ${s.name}\nMeu nome:`;
          return (
            <li key={s.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong>{s.name}</strong>
                  <div style={{ opacity: 0.8 }}>{s.category}</div>
                  <div>{price}</div>
                </div>

                <a
                  href={waLink(msg)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    alignSelf: "center",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #333",
                    textDecoration: "none",
                    color: "#111",
                  }}
                >
                  Agendar no WhatsApp
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <hr style={{ margin: "24px 0" }} />

      <h2>Agendamento</h2>
      <p>Preencha e envie que a gente confirma pelo WhatsApp 😊</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <input
          placeholder="Seu nome"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />

        <input
          placeholder="Telefone/WhatsApp (ex: (27) 99999-9999)"
          value={phone}
          onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
          required
        />

        <select value={serviceName} onChange={(e) => setServiceName(e.target.value)}>
          <option value="">Selecione um serviço (opcional)</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Dia/horário preferido (ex: Sábado 14h)"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
        />

        <textarea
          placeholder="Observações"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar agendamento"}
        </button>

        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      
        <button
          type="button"
          disabled={!canOpenWhatsApp}
          onClick={() => {
            const cleanName = clientName.trim();
            const cleanPhoneDigits = onlyDigits(phone);

            if (!cleanName || cleanPhoneDigits.length < 10) {
              alert("Preencha seu nome e telefone (com DDD) para abrir o WhatsApp.");
              return;
            }

            const msg =
              `Olá! Vim pelo site do Salão Onda da Beleza 😊\n` +
              `Nome: ${cleanName}\n` +
              `Telefone: ${phone}\n` + // aqui pode ir formatado mesmo
              `Serviço: ${serviceName || "-"}\n` +
              `Preferência: ${preferredDate || "-"}\n` +
              `Obs: ${notes || "-"}`;

            window.open(waLink(msg), "_blank", "noreferrer");
          }}
          style={{ border: "1px solid #333", opacity: canOpenWhatsApp ? 1 : 0.6 }}
        >
          Abrir WhatsApp para agendar
        </button>
      </form>
    </div>
  );
}
