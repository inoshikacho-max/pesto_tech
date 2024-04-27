import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as UserModel from '../models/User';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const router = express.Router();
router.use(express.json()); // Parse incoming requests data with JSON payloads

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_TOKEN";

interface JwtPayload {
    userId: number;
}

// Middleware to handle JWT authentication

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
        if (err) return res.status(403).send({ message: 'Forbidden' });
        req.body.userId = (payload as JwtPayload).userId;
        next();
    });
};

// Route to register a new user

router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = { email, password: hashedPassword };
        const user = await UserModel.createUser(userData);
        res.status(201).send({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route to login and generate JWT token

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    try {
        const user = await UserModel.getUserByName(email);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY);
        res.status(200).send({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


export default router;