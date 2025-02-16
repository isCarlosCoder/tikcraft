import { Router } from 'express';
import {
  type Request,
  type Response
} from 'express';
import crypto from 'crypto';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  purchasedTime: Date;
  isActive: boolean;
  isVipUser: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const router = Router();
const users: User[] = [];

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password: crypto.createHash('sha256').update(password).digest('hex'),
      createdAt: new Date(),
      updatedAt: new Date(),
      purchasedTime: new Date(),
      isActive: true,
      isVipUser: false
    };

    users.push(user);

    const token = crypto.randomBytes(32).toString('hex');

    const response: AuthResponse = {
      user: {
        ...user,
        password: undefined as any // Removendo senha da resposta
      },
      token
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const user = users.find(user =>
      user.email === email &&
      user.password === hashedPassword
    );

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Usuário inativo' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    const response: AuthResponse = {
      user: {
        ...user,
        password: undefined as any // Removendo senha da resposta
      },
      token
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
