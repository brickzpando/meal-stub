"use server";

import { prisma } from "@/lib/prisma";

export async function getPins() {
  const users = await prisma.user.findMany();

  return {
    hr: users.find((u) => u.role === "HR")?.pin ?? "",
    pantry: users.find((u) => u.role === "PANTRY")?.pin ?? "",
    admin: users.find((u) => u.role === "ADMIN")?.pin ?? "",
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
      where: { role: "HR" },
      update: { pin: hr },
      create: {
        role: "HR",
        pin: hr,
      },
    }),

    prisma.user.upsert({
      where: { role: "PANTRY" },
      update: { pin: pantry },
      create: {
        role: "PANTRY",
        pin: pantry,
      },
    }),

    prisma.user.upsert({
      where: { role: "ADMIN" },
      update: { pin: admin },
      create: {
        role: "ADMIN",
        pin: admin,
      },
    }),
  ]);

  return {
    success: true,
  };
}
