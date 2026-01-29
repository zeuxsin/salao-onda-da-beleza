# Salão Onda da Beleza 💇‍♀️💅👗

Projeto fullstack para o **Salão Onda da Beleza** (Cariacica • Vila Independência).  
O site permite listar serviços e enviar pedidos de agendamento pelo formulário (salvo no banco). Também possui botão separado para abrir o WhatsApp com mensagem pronta (sem envio automático).

---

## ✨ Funcionalidades

### Público (site)
- Listagem de serviços (cabelo / unhas)
- Formulário de agendamento (salva no banco)
- Botão separado: **Abrir WhatsApp para agendar** (não dispara mensagens sozinho)
- Informações do salão (local e contato) *(em evolução)*

### Backend (API)
- Health check
- Endpoint para listar serviços
- Endpoint para criar pedidos de agendamento
- Validação com Zod
- Segurança básica com Helmet + Rate Limit
- Banco PostgreSQL com Prisma + migrations + seed

---

## 🧰 Tecnologias

### Frontend
- React
- Vite
- Fetch API

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM (Prisma 7 + Driver Adapter)
- Zod (validação)
- Helmet (headers de segurança)
- express-rate-limit (anti-spam)

---

## 📁 Estrutura do projeto

salao-onda-da-beleza/
  backend/
    prisma/
    src/
    .env (não versionar)
  frontend/
    src/
    .env (não versionar)
  README.md

---

## ✅ Pré-requisitos

* Node.js compatível com Prisma 7: **20.19+** (recomendado) ou **22.12+**
* PostgreSQL instalado e rodando localmente
* Git (opcional)

> Dica (Windows): usar Node via nvm-windows ajuda a trocar versões facilmente.

---

## 🔧 Configuração do ambiente

### 1) Backend .env

Crie backend/.env com:

env
PORT=3333
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:26128/onda_db?schema=public"


> Importante: se sua senha tiver caracteres especiais (ex: # ou *), use URL-encoding
> # → %23 | * → %2A

Exemplo:

env
DATABASE_URL="postgresql://onda_admin:minha%23senha%2A@localhost:26128/onda_db?schema=public"


### 2) Frontend .env

Crie frontend/.env com:

env
VITE_API_URL=http://localhost:3333


---

## ▶️ Como rodar localmente

### 1) Rodar o Backend (API)

Abra o terminal e vá para a pasta do backend:

bash
cd backend


Instale as dependências:

bash
npm install


Rode migrations:

bash
npx prisma migrate dev


Gere o Prisma Client:

bash
npx prisma generate


Rode o seed (insere serviços iniciais):

bash
npx prisma db seed


Inicie o backend:

bash
npm run dev


Testes rápidos no navegador:

* http://localhost:3333/health
* http://localhost:3333/services

---

### 2) Rodar o Frontend

Em outro terminal:

bash
cd frontend
npm install
npm run dev


Abra:

* http://localhost:5173

---

## 🔌 Rotas da API

### Health

* GET /health
  Retorna status da API.

### Services

* GET /services
  Lista serviços ativos cadastrados.

### Appointments

* POST /appointments
  Cria um pedido de agendamento (formulário do site).

Exemplo de body:

json
{
  "clientName": "Ana",
  "phone": "27999999999",
  "serviceName": "Manicure",
  "preferredDate": "Sábado 14h",
  "notes": "Se possível, atendimento rápido"
}


---

## 🧪 Como testar (Thunder Client)

1. Com o backend rodando, crie uma request no Thunder Client:
2. GET http://localhost:3333/services (deve retornar uma lista)
3. POST http://localhost:3333/appointments com JSON (exemplo acima)
4. Confirme no banco com:

sql
SELECT * FROM "Appointment" ORDER BY "createdAt" DESC;


---

## 🔐 Segurança (resumo)

* Validação de entrada com **Zod**
* Headers de segurança com **Helmet**
* Rate limit no endpoint de agendamento (anti-spam)
* .env não versionado (segredos fora do Git)

> Observação: em produção, o usuário do banco deve ter permissões mínimas (princípio do menor privilégio).

---

## 🗺️ Roadmap (próximos passos)

* [ ] Separar páginas com React Router (Home / Agendamento / Roupas / Contato)
* [ ] Catálogo de roupas (CRUD no backend + tela no frontend)
* [ ] Área Admin (login + JWT + bcrypt + CRUD)
* [ ] Upload de imagens (galeria / produtos)
* [ ] Deploy (Frontend + API + Banco gerenciado)

---

## 👤 Autor

Projeto desenvolvido por **Erik de Oliveira Freitas**.

