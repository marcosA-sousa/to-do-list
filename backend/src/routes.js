import express from 'express';
import { db } from './database.js';

const router = express.Router();

// Validação de dados
const validateTask = (data) => {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Título é obrigatório e deve ser uma string');
  }
  
  if (data.title && data.title.length > 255) {
    errors.push('Título não pode exceder 255 caracteres');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Descrição deve ser uma string');
  }
  
  if (data.description && data.description.length > 1000) {
    errors.push('Descrição não pode exceder 1000 caracteres');
  }
  
  if (data.status && !['pending', 'completed'].includes(data.status)) {
    errors.push('Status deve ser "pending" ou "completed"');
  }
  
  return errors;
};


router.post('/tasks', (req, res) => {
  try {
    const { title, description = '', status = 'pending' } = req.body;
    
    // Validação
    const errors = validateTask({ title, description, status });
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validação falhou',
        details: errors 
      });
    }
    
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, status)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(title.trim(), description.trim(), status);
    
    // Retrieve the newly created task
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Erro no POST /tasks:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});


router.get('/tasks', (req, res) => {
  try {
    const { status, sortBy = 'created_at', order = 'desc' } = req.query;
    
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];
    
    // Filtro de status
    if (status && ['pending', 'completed'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    // Ordenação
    const validSortFields = ['created_at', 'title', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortField} ${sortOrder}`;
    
    const stmt = db.prepare(query);
    const tasks = stmt.all(...params);
    
    res.json(tasks);
  } catch (error) {
    console.error('Erro no GET /tasks:', error);
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
});

/**
 * GET /tasks/:id
 * Buscar uma tarefa específica por ID
 * Response: Tarefa encontrada ou erro 404
 */
router.get('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    const task = stmt.get(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Erro no GET /tasks/:id:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validação
    const errors = validateTask(updates);
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validação falhou',
        details: errors 
      });
    }
    
    // Preparar dados para atualização
    let query = 'UPDATE tasks SET ';
    const params = [];
    const updateFields = [];
    
    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      params.push(updates.title.trim());
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      params.push(updates.description.trim());
    }
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      params.push(updates.status);
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    query += updateFields.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    const stmt = db.prepare(query);
    const result = stmt.run(...params);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(task);
  } catch (error) {
    console.error('Erro no PUT /tasks/:id:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

router.delete('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json({ message: 'Tarefa deletada com sucesso', id });
  } catch (error) {
    console.error('Erro no DELETE /tasks/:id:', error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

export default router;
