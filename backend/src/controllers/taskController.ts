import { Request, Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// Obtener tareas del usuario logueado
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una tarea asociada al usuario
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status, dueDate } = req.body;
  
  try {
    const task = new Task({
      user: req.user._id,
      title,
      description,
      status,
      dueDate
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una tarea
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task && task.user.toString() === req.user._id.toString()) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
      
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada o no autorizado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una tarea
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task && task.user.toString() === req.user._id.toString()) {
      await task.deleteOne();
      res.json({ message: 'Tarea eliminada' });
    } else {
      res.status(404).json({ message: 'Tarea no encontrada o no autorizado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
