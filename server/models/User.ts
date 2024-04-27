import { PrismaClient, User } from '@prisma/client';
import { UserInput } from '.';

const prisma = new PrismaClient();

export async function createUser(userData:UserInput): Promise<User> {
    return prisma.user.create({data: userData});
}

export async function getUserByName(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
}
