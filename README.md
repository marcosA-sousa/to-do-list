# 📝 Lista de Tarefas

Gerenciador de tarefas simples, rápido e responsivo.

---

## 🎯 Funcionalidades

- ✅ Criar, editar e deletar tarefas
- 📊 Filtrar tarefas por status (pendente ou concluída)
- 🔄 Ordenar por data, título ou status
- 📱 Totalmente responsivo (mobile, tablet e desktop)
- 💾 Banco de dados local SQLite (sem dependências externas)
- ⚡ Rápido e leve
- 🔒 Validação de entrada no frontend e backend

---

## 🛠️ Stack Tecnológico

### Frontend
<div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://img.shields.io/badge/HTML5-E34C26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</div>

### Backend
<div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</div>

---

## 📂 Estrutura do Projeto

```
to-do-list/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── server.js          # Configuração do Express
│   │   ├── routes.js          # Rotas da API (CRUD)
│   │   └── database.js        # Conexão e inicialização SQLite
│   ├── 📁 data/
│   │   └── tasks.db           # Arquivo do banco de dados SQLite
│   ├── package.json           # Dependências e scripts
│   └── .env                   # Variáveis de ambiente
│
├── 📁 frontend/
│   ├── index.html             # HTML principal
│   ├── style.css              # Estilos
│   └── script.js              # Lógica do cliente
│
└── README.md                  # Este arquivo
```

---

## 🚀 Como Rodar

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (vem com Node.js)

### Instalação e Setup

#### 1️⃣ Navegue até o projeto
```bash
cd to-do-list
```

#### 2️⃣ Instale as dependências do backend
```bash
cd backend
npm install
```

#### 3️⃣ Inicie o servidor backend
```bash
npm start
```

Você deve ver:
```
🚀 Servidor rodando em http://localhost:3000
📝 Health check: http://localhost:3000/health
🔗 API base: http://localhost:3000/api
```

#### 4️⃣ Abra o frontend em outro terminal
```bash
# Da pasta raiz do projeto
cd frontend

# Inicie um servidor HTTP simples
npx http-server . -p 8000
```

#### 5️⃣ Abra no navegador
```
http://localhost:8000
```

✅ **Pronto!** Sua Lista de Tarefas está funcionando.

---

## 📺 Vídeo de Demonstração

[![Asista a Demonstração](https://img.shields.io/badge/▶️%20Asista%20a%20Demonstração-Vídeo-FF0000?style=for-the-badge)](./assets/demo.mp4)

Você também pode [baixar o vídeo diretamente](./assets/demo.mp4) 

---

## 🔌 Endpoints da API

### Obter todas as tarefas
```bash
GET /api/tasks
```

### Obter tarefa por ID
```bash
GET /api/tasks/:id
```

### Criar tarefa
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Comprar mantimentos",
  "description": "Leite, ovos, pão",
  "status": "pending"
}
```

### Atualizar tarefa
```bash
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Comprar mantimentos",
  "status": "completed"
}
```

### Deletar tarefa
```bash
DELETE /api/tasks/:id
```

### Parâmetros de Query
- `status` - Filtrar por status: `pending` ou `completed`
- `sortBy` - Campo para ordenar: `created_at`, `title` ou `status` (padrão: `created_at`)
- `order` - Ordem: `asc` ou `desc` (padrão: `desc`)

**Exemplo:**
```bash
GET /api/tasks?status=pending&sortBy=title&order=asc
```

---

## 🐛 Solução de Problemas

| Problema | Solução |
|----------|---------|
| **Porta 3000 já em uso** | Mude `PORT` em `backend/.env` ou encerre o processo usando a porta |
| **"npm: comando não encontrado"** | Instale Node.js de https://nodejs.org/ |
| **Frontend não conecta ao backend** | Verifique se o backend está rodando em `localhost:3000` |
| **Erros de banco de dados** | Delete `backend/data/tasks.db` e reinicie (será recriado) |
| **Erros de CORS** | Verifique se o backend está rodando e se os endpoints correspondem |

---

## 📝 Detalhes do Projeto

### Schema do Banco de Dados
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL CHECK(status IN ('pending', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Regras de Validação
- **Título:** Obrigatório, máximo 255 caracteres
- **Descrição:** Opcional, máximo 1000 caracteres
- **Status:** Apenas `pending` ou `completed`

---


## 👨‍💻 Autor

**Marcos Aurélio Ribeiro de Sousa**

Desenvolvido como projeto de estágio na IN100tiva.

---

**Última atualização:** Maio de 2026

