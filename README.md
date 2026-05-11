# 📝 To-Do List - Sistema de Gerenciamento de Tarefas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

Uma aplicação full stack moderna e completa para gerenciamento de tarefas. Construída com Node.js + Express no backend, HTML/CSS/JavaScript no frontend e Supabase como banco de dados. Segue boas práticas de desenvolvimento, padrões profissionais e documentação abrangente.

---

## 📖 Índice

- [Features](#-features)
- [Stack Tecnológico](#-stack-tecnológico)
- [Pré-requisitos](#-pré-requisitos)
- [Quick Start](#-quick-start)
- [Instalação Detalhada](#-instalação-detalhada)
- [Setup Supabase](#-setup-supabase)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API REST](#-api-rest)
- [Validação de Dados](#-validação-de-dados)
- [Troubleshooting](#-troubleshooting)
- [Desenvolvimento](#-desenvolvimento)
- [Licença](#-licença)

---

## ✨ Features

### Funcionalidades Principais
- ✅ CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ Listar tarefas com filtros por status
- ✅ Ordenação customizável (data, título, status)
- ✅ Marcar/desmarcar tarefas como concluídas
- ✅ Editar tarefas via modal
- ✅ Interface responsiva (mobile, tablet, desktop)

### Diferenciais
- ✔️ Validação robusta em 3 camadas (frontend, backend, BD)
- ✔️ Proteção contra XSS e sanitização de entrada
- ✔️ API REST bem documentada com exemplos cURL
- ✔️ Performance otimizada com índices SQL
- ✔️ Código limpo, comentado e padronizado

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | HTML5, CSS3, JavaScript Vanilla | Moderno |
| **Backend** | Node.js, Express.js | 18+ / 4.18 |
| **Database** | Supabase (PostgreSQL) | Cloud |
| **DevOps** | Git, npm | Standard |

---

## 📋 Pré-requisitos

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Git** ([download](https://git-scm.com/))
- **Supabase** - Conta gratuita em [supabase.com](https://supabase.com/)

---

## 🚀 Quick Start (5 minutos)

### 1️⃣ Instalar Dependências
```bash
cd backend
npm install
```

### 2️⃣ Configurar Ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais Supabase
```

### 3️⃣ Iniciar Backend
```bash
npm run dev
# Servidor rodando em: http://localhost:3000
```

### 4️⃣ Abrir Frontend (novo terminal)
```bash
# Opção A: Servidor local
python -m http.server 8000 --directory frontend

# Opção B: Direto no navegador
# Windows: start frontend/index.html
# macOS:   open frontend/index.html
# Linux:   xdg-open frontend/index.html
```

Acesse: `http://localhost:8000` (ou `frontend/index.html`)

✅ **Pronto! Sua aplicação está rodando!**

---

## 📋 Instalação Detalhada

### Backend

```bash
cd backend
npm install
```

**Scripts disponíveis:**
```bash
npm run dev    # Development com auto-reload
npm start      # Produção
```

### Configurar Supabase

Crie arquivo `.env` na pasta `backend`:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica
PORT=3000
NODE_ENV=development
```

### Criar Tabela no Supabase

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS para acesso público (development)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON tasks
FOR ALL USING (true) WITH CHECK (true);
```

### Frontend

Simplesmente abra `frontend/index.html` em um navegador.

Para servidor local (recomendado):
```bash
# Python 3
python -m http.server 8000 --directory frontend

# Node.js
npx http-server frontend -p 8000
```

---

## � API REST

Base URL: `http://localhost:3000/api`

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/tasks` | Criar tarefa |
| **GET** | `/tasks` | Listar tarefas (com filtros) |
| **GET** | `/tasks/:id` | Buscar tarefa por ID |
| **PUT** | `/tasks/:id` | Atualizar tarefa |
| **DELETE** | `/tasks/:id` | Deletar tarefa |
| **GET** | `/health` | Verificar status do servidor |

### Exemplos cURL

**Criar Tarefa:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minha Tarefa",
    "description": "Descrição opcional",
    "status": "pending"
  }'
```

**Listar Tarefas (com filtros):**
```bash
# Todas
curl http://localhost:3000/api/tasks

# Apenas pendentes
curl "http://localhost:3000/api/tasks?status=pending"

# Ordenadas por título (crescente)
curl "http://localhost:3000/api/tasks?sortBy=title&order=asc"

# Filtrar + ordenar
curl "http://localhost:3000/api/tasks?status=completed&sortBy=created_at&order=desc"
```

**Buscar por ID:**
```bash
curl http://localhost:3000/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**Atualizar Tarefa:**
```bash
curl -X PUT http://localhost:3000/api/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Deletar Tarefa:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

### Query Parameters

Para `GET /tasks`:
- `status` - Filtrar por `pending` ou `completed`
- `sortBy` - Ordenar por `created_at`, `title` ou `status` (padrão: `created_at`)
- `order` - `asc` ou `desc` (padrão: `desc`)

### Request Body

```json
{
  "title": "string (obrigatório, 1-255 caracteres)",
  "description": "string (opcional, 0-1000 caracteres)",
  "status": "string ('pending' | 'completed', padrão: 'pending')"
}
```

---

## � Estrutura do Projeto

```
to-do-list/
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── server.js          # Express app & middlewares
│   │   ├── routes.js          # API endpoints (CRUD)
│   │   └── database.js        # Supabase configuration
│   ├── package.json
│   ├── .env.example           # Template
│   └── .env                   # Credenciais (não commitar)
│
├── frontend/                   # HTML + CSS + JavaScript
│   ├── index.html             # Estrutura
│   ├── style.css              # Estilos responsivos
│   └── script.js              # Lógica (Fetch API)
│
├── .vscode/                    # Configuração VS Code
├── .gitignore                  # Arquivos ignorados
├── .editorconfig              # Padronização
├── LICENSE                     # MIT License
└── README.md                   # Este arquivo
```

---

## ✅ Validação de Dados

| Campo | Validação |
|-------|-----------|
| **title** | Obrigatório, 1-255 caracteres |
| **description** | Opcional, máx 1000 caracteres |
| **status** | `pending` ou `completed` |

**Segurança:** Sanitização contra XSS em frontend e backend

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| "SUPABASE_URL/KEY não definidas" | Configure arquivo `.env` |
| "Table 'tasks' not found" | Execute SQL de setup (acima) |
| "CORS blocked" | Backend em `localhost:3000`, frontend em `localhost:8000` |
| "Cannot GET /api/tasks" | Certifique-se que backend está rodando (`npm run dev`) |
| "Permissão negada (Linux)" | Use `sudo npm install` ou configure npm globalmente |

---

## 💻 Desenvolvimento

### Padrões de Código
- Validação em 3 camadas (frontend, backend, BD)
- Tratamento de erros apropriado
- Logs de requisições
- Segurança contra XSS
- Design responsivo
- Código limpo e comentado

### Git Workflow
```bash
# Criar branch
git checkout -b feature/minha-feature

# Fazer mudanças e commits
git add .
git commit -m "feat: descrição da feature"

# Fazer push
git push origin feature/minha-feature

# Abrir Pull Request
```

### Commit Conventions
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `refactor:` - Refatoração
- `test:` - Testes

---

## 📝 Estatísticas do Projeto

```
📄 Backend:       ~300 linhas
📄 Frontend:      ~1100 linhas
📚 Documentação:  Consolidada neste README
🔧 Endpoints:     6 (CRUD + Health)
```

---

## 🚀 Roadmap Futuro

- [ ] Autenticação com JWT
- [ ] Paginação de tarefas
- [ ] Busca por texto
- [ ] Categorias/Tags
- [ ] Prioridades e datas de vencimento
- [ ] Testes automatizados
- [ ] Deploy em produção
- [ ] PWA (Progressive Web App)

---

## 📄 Licença

MIT License © 2024 - Veja [LICENSE](LICENSE) para detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit as mudanças (`git commit -m 'feat: descrição'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📞 Suporte

- Abra uma issue no repositório
- Verifique o console do navegador para erros
- Verifique logs do backend: `npm run dev`

---

Desenvolvido com ❤️ como projeto de estágio na **IN100tiva**. 🚀
