import express from 'express';
import { db } from './database.js';

const router = express.Router();

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
    
    const errors = validateTask({ title, description, status });
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validação falhou',
        details: errors 
      });
    }
    
    db.run('INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
      [title.trim(), description.trim(), status],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao criar tarefa' });
        }
        
        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao criar tarefa' });
          }
          res.status(201).json(task);
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

router.get('/tasks', (req, res) => {
  try {
    const { status, sortBy = 'created_at', order = 'desc' } = req.query;
    
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];
    
    if (status && ['pending', 'completed'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    const validSortFields = ['created_at', 'title', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortField} ${sortOrder}`;
    
    db.all(query, params, (err, tasks) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao listar tarefas' });
      }
      res.json(tasks || []);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
});

router.get('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      res.json(task);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const errors = validateTask(updates);
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validação falhou',
        details: errors 
      });
    }
    
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
    
    db.run(query, params, function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
        }
        res.json(task);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

router.delete('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao deletar tarefa' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      res.json({ message: 'Tarefa deletada com sucesso', id });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

export default router;
