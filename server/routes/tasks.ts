import express, { Request, Response } from 'express';
import * as TaskModel from '../models/Task';
import { authenticateToken } from './auth';
import { TaskInput } from '../models';

const router = express.Router();
router.use(express.json()); // Parse incoming requests data with JSON payloads


//  Get all tasks for a user (GET /tasks)

router.get('/', authenticateToken ,async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//   Create new task for a user (POST /tasks)

router.post('/', authenticateToken ,async (req: Request, res: Response) => {
  const { title, status, description, file, userID} = req.body;
  if (!title || !status) {
    return res.status(400).json({ error: 'Title and status are required' });
  }

  let taskData:TaskInput = { title, description, file, status, userID}  

  try {
    const createdTask = await TaskModel.createTask(taskData);
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//     Get an existing task by id (GET /tasks/:id)

router.get('/:id', authenticateToken ,async (req: Request, res: Response) => {
  const taskId = req.params.id;
  if (taskId) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const task = await TaskModel.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//    Update task of the authenticated user (PUT /tasks)

router.put('/:id', authenticateToken ,async (req: Request, res: Response) => {
  const taskId = req.params.id;
  if (taskId) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const { title, status, description, file, userID } = req.body;
  if (!title || !status) {
    return res.status(400).json({ error: 'Title and status are required' });
  }

  const taskData:TaskInput = { title, description, file, status, userID }
  try {
    const updatedTask = await TaskModel.updateTask(taskId, taskData);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken ,async (req: Request, res: Response) => {
  const taskId = req.params.id;
  if (taskId) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const deletedTask = await TaskModel.deleteTask(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(deletedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;