'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nexus-backend-2w6j.onrender.com';

export default function Home() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTasks();
    }
  }, [user, loading]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/tasks`, 
        { title, description },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error creando tarea:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error eliminando tarea:', error);
    }
  };

  if (loading || !user) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Cargando Nexus...</div>;

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NEXUS
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Bienvenido de nuevo, {user.name}</p>
        </div>
        <button onClick={logout} className="btn-primary" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
          Cerrar Sesión
        </button>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        <div className="glass-card">
          <h2 style={{ marginBottom: '20px' }}>Nueva Tarea</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Título de la tarea..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea 
              placeholder="Descripción..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'white', padding: '12px', borderRadius: '8px', minHeight: '100px', outline: 'none' }}
            />
            <button type="submit" className="btn-primary">Añadir a Nexus</button>
          </form>
        </div>

        <div className="glass-card">
          <h2 style={{ marginBottom: '20px' }}>Mis Tareas ({tasks.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hay tareas todavía.</p>
            ) : (
              tasks.map((task) => (
                <div key={task._id} style={{ padding: '20px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'var(--primary)' }}>{task.title}</h4>
                    <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>{task.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
