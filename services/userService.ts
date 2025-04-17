import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

const userService = {
  getAll() {
    return prisma.users.findMany();
  },
  getById(id: string) {
    return prisma.users.findUnique({
      where: { id: +id },
    });
  },
  create(email: string, name: string, hashedPassword: string) {
    return prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  },
};

export default userService;
