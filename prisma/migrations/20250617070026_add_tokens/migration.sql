-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "verificationToken" TEXT NOT NULL DEFAULT '';
