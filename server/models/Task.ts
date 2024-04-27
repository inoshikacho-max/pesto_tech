// src/models/Task.ts
import { PrismaClient, Task } from '@prisma/client';
import { TaskInput } from '.';

const prisma = new PrismaClient(); 

export async function createTask(taskData:TaskInput): Promise<Task> {
  return prisma.task.create({ data: taskData });
}

export async function getAllTasks(): Promise<Task[]> {
  return prisma.task.findMany();
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  return prisma.task.findUnique({ where: { id: taskId } });
}

export async function updateTask(taskId: string, taskData:TaskInput): Promise<Task | null> {
  return prisma.task.update({ where: { id: taskId }, data: taskData });
}

export async function deleteTask(taskId: string): Promise<Task> {
  return prisma.task.delete({ where: { id: taskId } });
}