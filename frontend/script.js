const API_BASE_URL = 'http://localhost:3000/api';
let tasksMap = {};

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const loadingIndicator = document.getElementById('loadingIndicator');
const statusFilter = document.getElementById('statusFilter');
const sortBy = document.getElementById('sortBy');
const order = document.getElementById('order');
const refreshBtn = document.getElementById('refreshBtn');
const toast = document.getElementById('toast');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editTaskId = document.getElementById('editTaskId');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDescription = document.getElementById('editTaskDescription');
const closeModal = document.querySelector('.close');
const cancelEdit = document.getElementById('cancelEdit');

taskForm.addEventListener('submit', handleAddTask);
refreshBtn.addEventListener('click', loadTasks);
statusFilter.addEventListener('change', loadTasks);
sortBy.addEventListener('change', loadTasks);
order.addEventListener('change', loadTasks);
editForm.addEventListener('submit', handleEditTask);
closeModal.addEventListener('click', () => editModal.style.display = 'none');
cancelEdit.addEventListener('click', () => editModal.style.display = 'none');
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

async function handleAddTask(e) {
    e.preventDefault();
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (!title) {
        showToast('Por favor, preencha o título da tarefa', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, status: 'pending' })
        });

        if (!response.ok) {
            const data = await response.json();
            showToast(data.error || 'Erro ao criar tarefa', 'error');
            return;
        }

        showToast('✅ Tarefa criada com sucesso!', 'success');
        taskForm.reset();
        loadTasks();
    } catch (error) {
        console.error(error);
        showToast('Erro ao conectar com o servidor', 'error');
    }
}

async function loadTasks() {
    try {
        const url = `${API_BASE_URL}/tasks?sortBy=${sortBy.value}&order=${order.value}${statusFilter.value ? `&status=${statusFilter.value}` : ''}`;

        loadingIndicator.style.display = 'block';
        tasksList.innerHTML = '';
        emptyState.style.display = 'none';

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar tarefas');

        const tasks = await response.json();
        tasksMap = {};
        tasks.forEach(task => tasksMap[task.id] = task);
        loadingIndicator.style.display = 'none';

        if (tasks.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tasks.forEach(task => tasksList.appendChild(createTaskElement(task)));
    } catch (error) {
        console.error(error);
        loadingIndicator.style.display = 'none';
        showToast('Erro ao carregar tarefas', 'error');
    }
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
    taskDiv.id = `task-${task.id}`;

    const createdDate = new Date(task.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const createdTime = new Date(task.created_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    taskDiv.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.status === 'completed' ? 'checked' : ''}
            data-id="${task.id}"
        >
        <div class="task-content">
            <div class="task-title">${escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                <span class="task-status ${task.status}">${task.status === 'completed' ? '✓ Concluída' : '⏳ Pendente'}</span>
                <span>${createdDate} às ${createdTime}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn btn-edit" data-id="${task.id}" onclick="openEditModal('${task.id}', '${escapeHtml(task.title).replace(/'/g, "\\'")}', '${(task.description || '').replace(/'/g, "\\'")}')" title="Editar">
                ✏️ Editar
            </button>
            <button class="btn btn-danger" data-id="${task.id}" onclick="deleteTask('${task.id}')" title="Deletar">
                🗑️ Deletar
            </button>
        </div>
    `;

    const checkbox = taskDiv.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleTaskStatus(task.id, checkbox.checked));

    return taskDiv;
}

async function toggleTaskStatus(taskId, isCompleted) {
    try {
        const newStatus = isCompleted ? 'completed' : 'pending';
        const task = tasksMap[taskId];
        
        if (!task) {
            showToast('Erro: tarefa não encontrada', 'error');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: task.title, status: newStatus })
        });

        if (!response.ok) throw new Error('Erro ao atualizar tarefa');

        showToast(`✅ Tarefa marcada como ${newStatus === 'completed' ? 'concluída' : 'pendente'}`, 'success');
        loadTasks();
    } catch (error) {
        console.error(error);
        showToast('Erro ao atualizar status da tarefa', 'error');
        loadTasks();
    }
}

function openEditModal(taskId, title, description) {
    editTaskId.value = taskId;
    editTaskTitle.value = title;
    editTaskDescription.value = description;
    editModal.style.display = 'block';
}

async function handleEditTask(e) {
    e.preventDefault();
    const taskId = editTaskId.value;
    const title = editTaskTitle.value.trim();
    const description = editTaskDescription.value.trim();

    if (!title) {
        showToast('Por favor, preencha o título da tarefa', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });

        if (!response.ok) {
            const data = await response.json();
            showToast(data.error || 'Erro ao atualizar tarefa', 'error');
            return;
        }

        showToast('✅ Tarefa atualizada com sucesso!', 'success');
        editModal.style.display = 'none';
        loadTasks();
    } catch (error) {
        console.error(error);
        showToast('Erro ao atualizar tarefa', 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar tarefa');

        showToast('✅ Tarefa deletada com sucesso!', 'success');
        loadTasks();
    } catch (error) {
        console.error(error);
        showToast('Erro ao deletar tarefa', 'error');
    }
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener('DOMContentLoaded', loadTasks);
