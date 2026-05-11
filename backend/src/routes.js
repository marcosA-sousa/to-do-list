import express from 'express';
import { supabase } from './database.js';

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

/**
 * POST /tasks
 * Criar uma nova tarefa
 * Body: { title: string, description?: string, status?: 'pending' | 'completed' }
 * Response: { id, title, description, status, created_at }
 */
router.post('/tasks', async (req, res) => {
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
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: title.trim(),
        description: description.trim(),
        status,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Erro ao criar tarefa:', error);
      return res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Erro no POST /tasks:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /tasks
 * Listar todas as tarefas com filtros opcionais
 * Query params: status=pending|completed, sortBy=created_at|title, order=asc|desc
 * Response: Array de tarefas
 */
router.get('/tasks', async (req, res) => {
  try {
    const { status, sortBy = 'created_at', order = 'desc' } = req.query;
    
    let query = supabase.from('tasks').select('*');
    
    // Filtro de status
    if (status && ['pending', 'completed'].includes(status)) {
      query = query.eq('status', status);
    }
    
    // Ordenação
    const validSortFields = ['created_at', 'title', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const isAsc = order === 'asc';
    
    query = query.order(sortField, { ascending: isAsc });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao listar tarefas:', error);
      return res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erro no GET /tasks:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /tasks/:id
 * Buscar uma tarefa específica por ID
 * Response: Tarefa encontrada ou erro 404
 */
router.get('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erro no GET /tasks/:id:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * PUT /tasks/:id
 * Atualizar uma tarefa
 * Body: { title?: string, description?: string, status?: 'pending' | 'completed' }
 * Response: Tarefa atualizada
 */
router.put('/tasks/:id', async (req, res) => {
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
    const dataToUpdate = {};
    if (updates.title !== undefined) dataToUpdate.title = updates.title.trim();
    if (updates.description !== undefined) dataToUpdate.description = updates.description.trim();
    if (updates.status !== undefined) dataToUpdate.status = updates.status;
    dataToUpdate.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('tasks')
      .update(dataToUpdate)
      .eq('id', id)
      .select();
    
    if (error || !data || data.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Erro no PUT /tasks/:id:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * DELETE /tasks/:id
 * Deletar uma tarefa
 * Response: Confirmação de deleção
 */
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error, data } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .select();
    
    if (error || !data || data.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json({ message: 'Tarefa deletada com sucesso', id });
  } catch (error) {
    console.error('Erro no DELETE /tasks/:id:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
