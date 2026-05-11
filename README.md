# To-Do List

Uma aplicação para gerenciar tarefas. Pronto para testar.

**Fazer em 5 minutos:** Vá para a seção [Como testar](#como-testar)

## O que faz

- Criar, editar e deletar tarefas
- Filtrar por status (pendente ou concluída)
- Ordenar por data, título ou status
- Funciona em mobile, tablet e desktop
- Dados sincronizados em tempo real

## Stack

- Frontend: HTML, CSS e JavaScript puro
- Backend: Node.js com Express
- Banco: PostgreSQL (Supabase)

## Como testar

### Setup (2 minutos)

**Você precisa de:**
- Node.js 18+
- Uma conta gratuita no [Supabase](https://supabase.com/)

### 1. Ir pro backend

```bash
cd backend
npm install
```

### 2. Criar tabela no Supabase

Acesse [supabase.com](https://supabase.com/), crie um projeto e vá no **SQL Editor**.

Cole isso e execute:

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

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

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON tasks
FOR ALL USING (true) WITH CHECK (true);
```

### 3. Copiar credenciais

No Supabase, vá em **Project Settings** → **API**. Copie:
- **Project URL**
- **anon public** (essa é a chave)

### 4. Configurar .env

Na pasta `backend`, crie um arquivo chamado `.env`:

```
SUPABASE_URL=cole-a-url-aqui
SUPABASE_KEY=cole-a-chave-aqui
PORT=3000
NODE_ENV=development
```

### 5. Rodar o backend

```bash
npm run dev
```

Deve aparecer: `Server running on http://localhost:3000`

### 6. Rodar o frontend

Abra **outro terminal** e vá pra pasta frontend:

```bash
cd frontend
python -m http.server 8000
```

(Se não tiver Python, use: `npx http-server . -p 8000`)

### 7. Abrir no navegador

```
http://localhost:8000
```

Pronto! Crie uma tarefa e vê funcionando 😊

## Testando a API

Se quiser testar sem a interface web:

```bash
# Criar
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Minha tarefa"}'

# Listar
curl http://localhost:3000/api/tasks

# Filtrar
curl "http://localhost:3000/api/tasks?status=pending"

# Atualizar
curl -X PUT http://localhost:3000/api/tasks/ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Deletar
curl -X DELETE http://localhost:3000/api/tasks/ID_AQUI
```

## Deu erro?

**"SUPABASE_URL/KEY não definidas"**
- Verifique se tá tudo certo no `.env`

**"Table not found"**
- Rodou o SQL no Supabase? Verifique se tá no banco correto

**CORS blocked**
- Backend precisa estar em `localhost:3000`
- Frontend em `localhost:8000`

**npm install não funciona**
- Linux/Mac: tente `sudo npm install`
- Ou reinstale Node.js

**"Cannot GET /api/tasks"**
- Backend tá rodando? Digite `npm run dev` de novo

## Arquivos principais

```
backend/
├── src/
│   ├── server.js     - Express
│   ├── routes.js     - API
│   └── database.js   - Supabase
└── package.json

frontend/
├── index.html        - UI
├── style.css         - Estilos
└── script.js         - Lógica
```

## Como funciona

Frontend envia dados pro backend via HTTP. Backend valida e salva no Supabase. Pronto.

Tudo é validado dos dois lados - você não consegue enviar dados ruins.

## Código

Sem frameworks desnecessários. Apenas o essencial.

- Frontend: JavaScript vanilla
- Backend: Express
- Banco: PostgreSQL puro

~300 linhas de backend, ~1100 de frontend.

## Licença

MIT

---

Desenvolvido como projeto de estágio na IN100tiva.
