# VetOS

Sistema de gestão veterinária com módulos de recepção, atendimento clínico, estoque, relatórios e dashboard.

---

# 🚀 Setup do Projeto

## Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Aplicar migrações
python manage.py migrate

# Criar usuário administrador
python manage.py createsuperuser

# Iniciar servidor (porta 8000)
python manage.py runserver
```

Backend disponível em:

```text
http://localhost:8000
```

---

## Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar ambiente de desenvolvimento (porta 5173)
npm run dev
```

O frontend já está configurado para consumir a API em:

```text
http://localhost:8000/api
```

---

# 🔌 Endpoints da API

| Módulo | Base URL | Recursos |
|---------|----------|-----------|
| Recepção | `/api/reception/` | `tutors/`, `animals/`, `appointments/`, `employees/`, `veterinarians/`, `specialties/` |
| Clínico | `/api/clinic/` | `consultations/`, `exams/`, `prescriptions/`, `medical-records/` |
| Estoque | `/api/inventory/` | `products/`, `movements/` |
| Relatórios | `/api/reports/` | — |
| Dashboard | `/api/dashboard/` | — |
| Autenticação | `/api/accounts/` | — |

Todos os endpoints seguem o padrão REST:

```http
GET    /recurso/       # Listar
POST   /recurso/       # Criar

GET    /recurso/{id}/  # Detalhar
PUT    /recurso/{id}/  # Atualizar
PATCH  /recurso/{id}/  # Atualização parcial
DELETE /recurso/{id}/  # Remover
```

---

# 🏗️ Arquitetura do Frontend

O frontend segue o padrão:

```text
Service → Hook → Componente
```

### Estrutura

```text
services/api.ts
│
├── Client HTTP base (fetch + JWT)

services/tutor.service.ts
│
├── Chamadas CRUD da entidade

hooks/useTutor.ts
│
├── Estado React + integração com services

pages/recepcao/Tutores.tsx
│
└── Interface utilizando o hook
```

### Criando um novo módulo

1. Criar `services/xxx.service.ts`
2. Criar `hooks/useXxx.ts`
3. Refatorar ou criar a página utilizando o hook

---

# 👥 Divisão de Tarefas

## ✅ Duarda — Frontend (Base e Recepção)

- Setup React + Vite
- Estrutura de login e autenticação
- Layout principal (sidebar, rotas e responsividade)
- Módulo Tutores
- Módulo Animais
- Agenda de Consultas
- Configuração do backend (settings, urls e CORS)

---

## ✅ Geyslaine - Frontend (Clínico)

- Refatorar `Atendimentos.tsx` (criar `useConsultations`)
- Refatorar `Exames.tsx` (utilizar `useExams`)
- Refatorar `Prescricoes.tsx` (utilizar `usePrescriptions`)
- Refatorar `Prontuarios.tsx` (integrar com `/api/clinic/medical-records/`)

---

## ✅ Geyslaine - (Administrativo)

- Refatorar `Estoque.tsx` (utilizar `useProducts`)
- Refatorar `Funcionarios.tsx` (utilizar `useEmployees`)
- Implementar `Relatorios.tsx`

---

## ✅ Lucas - Backend

- Corrigir encoding do `requirements.txt`
- Implementar autenticação completa (`login`, `register`, `refresh token`)
- Popular banco com dados iniciais (`fixtures/seed`)
- Criar testes para views e serializers

---

# 🔐 Autenticação

O backend utiliza:

- `djangorestframework-simplejwt`
- JWT (JSON Web Token)

### Fluxo atual

- O token é armazenado no `localStorage`
- Chave utilizada:

```text
access_token
```

- O arquivo `services/api.ts` adiciona automaticamente:

```http
Authorization: Bearer <token>
```

em todas as requisições autenticadas.

### Status

Os arquivos `Login.tsx` e `useAuth.ts` já estão preparados para integração completa assim que o backend de autenticação for finalizado.

---

# 🛠️ Tecnologias

| Camada | Stack |
|----------|--------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 4, React Router 7 |
| Backend | Python, Django 5.2, Django REST Framework, SimpleJWT |
| Banco de Dados | SQLite (Desenvolvimento) / PostgreSQL (Produção) |
| UI | Radix UI, Lucide Icons, Recharts |

---

# 📋 Estratégia de Branches

## Branches Principais

```text
main → produção
dev  → desenvolvimento e integração
```

## Branches de Trabalho

Criar novas branches a partir da `dev` utilizando os prefixos:

```text
feat/
fix/
refactor/
```

### Exemplos

```text
feat/authentication
fix/login-bug
refactor/use-consultations
```

---

# 📞 Contato

Em caso de dúvidas sobre a arquitetura ou estrutura do projeto, entre em contato com a Duarda.
