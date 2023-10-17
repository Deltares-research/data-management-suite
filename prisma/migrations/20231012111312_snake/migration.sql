/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "dateTime",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "datetime" TIMESTAMP(3),
ADD COLUMN     "end_datetime" TIMESTAMP(3),
ADD COLUMN     "start_datetime" TIMESTAMP(3);
