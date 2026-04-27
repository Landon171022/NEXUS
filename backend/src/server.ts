import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('API de Nexus funcionando correctamente 🚀');
});

// Conexión a MongoDB
import connectDB from './config/db';

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});

