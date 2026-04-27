import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
};

// Registrar Usuario
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    console.log('Intentando registrar usuario:', email);
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('El usuario ya existe');
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({ name, email, password });
    console.log('Usuario creado con éxito:', user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id as string)
    });
  } catch (error: any) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login de Usuario
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id as string)
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
