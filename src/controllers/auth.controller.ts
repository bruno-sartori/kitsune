import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '@config/auth';
import ApiError from "@errors/ApiError";
import User from '@models/user';

class AuthController {
  public async register(req: Request, res: Response) {
    const { name, login, password } = req.body;

    if (!login || !password) {
      const error = new ApiError('Username and password is required!', 'API_ERROR');
      return res.status(error.statusCode).send({ error: error.toJSON() })
    }

    const existingUser = await User.findOne({ where: { login } });

    if (existingUser) {
      const error = new ApiError('User is already registered!', 'API_ERROR');
      return res.status(error.statusCode).send({ error: error.toJSON() })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({ name, login, password: hashedPassword });

    res.status(200).json({ data: { user: createdUser }, message: 'User created successfully' });
  }

  public async login(req: Request, res: Response) {
    const { login, password } = req.body;

    if (!login || !password) {
      const error = new ApiError('Username and password is required!', 'API_ERROR');
      return res.status(error.statusCode).send({ error: error.toJSON() })
    }

    const existingUser = await User.findOne({ where: { login } });
    if (!existingUser) {
      const error = new ApiError('User is not registered!', 'API_ERROR');
      return res.status(error.statusCode).send({ error: error.toJSON() });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      const error = new ApiError('Password is invalid!', 'API_ERROR');
      return res.status(error.statusCode).send({ error: error.toJSON() });
    }

    const token = jwt.sign({ login: existingUser.login, id: existingUser.id }, authConfig.secret, { expiresIn: authConfig.expiresIn });

    res.send({ token });
  }

  public async oauth2(req: Request, res: Response) {
    
  }
}

export default AuthController;
