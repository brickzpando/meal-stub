"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
export async function getPins() {
  const users = await prisma.user.findMany();

  return {
    hr: users.find((u) => u.role === UserRole.HR)?.pin ?? "",
    pantry: users.find((u) => u.role === UserRole.PANTRY)?.pin ?? "",
    admin: users.find((u) => u.role === UserRole.ADMIN)?.pin ?? "",
  };
}

export async function savePins(data: {
  hr: string;
  pantry: string;
  admin: string;
}) {
  const { hr, pantry, admin } = data;

  await Promise.all([
    prisma.user.upsert({
      where: { role: UserRole.HR },
      update: { pin: hr },
      create: {
        role: UserRole.HR,
        pin: hr,
      },
    }),

    prisma.user.upsert({
      where: { role: UserRole.PANTRY },
      update: { pin: pantry },
      create: {
        role: UserRole.PANTRY,
        pin: pantry,
      },
    }),

    prisma.user.upsert({
      where: { role: UserRole.ADMIN },
      update: { pin: admin },
      create: {
        role: UserRole.ADMIN,
        pin: admin,
      },
    }),
  ]);

  return {
    success: true,
  };
}
