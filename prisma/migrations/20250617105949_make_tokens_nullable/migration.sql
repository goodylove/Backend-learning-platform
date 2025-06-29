-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resetPasswordToken" DROP NOT NULL,
ALTER COLUMN "resetPasswordToken" DROP DEFAULT,
ALTER COLUMN "verificationToken" DROP NOT NULL,
ALTER COLUMN "verificationToken" DROP DEFAULT;
