import express from 'express';
import { getTasks, createTask, deleteTask, updateTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Todas las rutas de tareas ahora requieren estar logueado
router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
