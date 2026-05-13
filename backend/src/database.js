import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/tasks.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

db.run('PRAGMA foreign_keys = ON');

export const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        status TEXT NOT NULL CHECK(status IN ('pending', 'completed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at)`);
  });
};

initializeDatabase();
