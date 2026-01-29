require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function toCents(brl) {
  if (typeof brl === "number") return Math.round(brl * 100);
  const normalized = String(brl).replace(".", "").replace(",", ".");
  return Math.round(Number(normalized) * 100);
}

async function main() {
  const services = [
    { category: "cabelo", name: "Corte feminino", priceCents: toCents("45,00"), durationMinutes: 45, description: "Corte + finalização simples" },
    { category: "cabelo", name: "Corte masculino", priceCents: toCents("35,00"), durationMinutes: 30 },
    { category: "cabelo", name: "Escova", priceCents: toCents("60,00"), durationMinutes: 60 },
    { category: "cabelo", name: "Hidratação", priceCents: toCents("70,00"), durationMinutes: 60 },
    { category: "unhas", name: "Manicure", priceCents: toCents("25,00"), durationMinutes: 40 },
    { category: "unhas", name: "Pedicure", priceCents: toCents("30,00"), durationMinutes: 50 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { name: s.name },
      update: { ...s, active: true },
      create: s,
    });
  }

  console.log("✅ Seed concluído: serviços inseridos/atualizados.");
}

main()
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
