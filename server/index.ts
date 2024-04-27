// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/auth';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

app.use('/tasks', taskRoutes);
app.use('/auth', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
