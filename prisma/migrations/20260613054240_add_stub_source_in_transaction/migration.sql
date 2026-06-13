-- CreateEnum
CREATE TYPE "StubSource" AS ENUM ('WEEKLY', 'REWARD');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "sourceType" "StubSource";
