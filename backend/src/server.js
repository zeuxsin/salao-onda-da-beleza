require("dotenv/config");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");

const { prisma, pool } = require("./prisma");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "200kb" }));
app.use(cors()); // depois a gente restringe pro domínio do front

app.get("/health", (req, res) => res.json({ ok: true }));

// Rate limit no formulário (anti-spam)
const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/appointments", appointmentLimiter);

// Listar serviços (público)
app.get("/services", async (req, res) => {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  res.json(services);
});

// Listar roupas/produtos (público) com filtros simples
app.get("/products", async (req, res) => {
  const { q, category } = req.query;

  const products = await prisma.product.findMany({
    where: {
      active: true,
      AND: [
        q
          ? {
              OR: [
                { name: { contains: String(q), mode: "insensitive" } },
                { description: { contains: String(q), mode: "insensitive" } },
              ],
            }
          : {},
        category ? { category: String(category) } : {},
      ],
    },
    orderBy: [{ createdAt: "desc" }],
  });

  res.json(products);
});

// Criar agendamento (form do site)
const appointmentSchema = z.object({
  clientName: z.string().min(2).max(80),
  phone: z.string().regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos (com DDD)"),
  serviceName: z.string().max(80).optional(),
  preferredDate: z.string().max(60).optional(),
  notes: z.string().max(500).optional(),
});

app.post("/appointments", async (req, res) => {
  const parsed = appointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: parsed.error.flatten(),
    });
  }

  const appointment = await prisma.appointment.create({ data: parsed.data });
  res.status(201).json({ ok: true, appointmentId: appointment.id });
});

// Fechamento limpo do pool (opcional, mas bonito)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
