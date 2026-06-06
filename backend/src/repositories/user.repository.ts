import { User } from "@prisma/client";
import { prisma } from "../prisma/client";

export type CreateUserData = {
  email: string;
  passwordHash: string;
  name?: string;
};

export type SafeUser = Pick<User, "id" | "email" | "name" | "createdAt" | "updatedAt">;

const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserRepository {
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  }

  async create(data: CreateUserData): Promise<SafeUser> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
      },
      select: safeUserSelect,
    });
  }
}

export const userRepository = new UserRepository();
