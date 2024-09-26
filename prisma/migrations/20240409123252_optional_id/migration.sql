/*
  Warnings:

  - You are about to drop the `_CollectionToGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CollectionToGroup" DROP CONSTRAINT "_CollectionToGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToGroup" DROP CONSTRAINT "_CollectionToGroup_B_fkey";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "collectionId" TEXT,
ADD COLUMN     "id" TEXT;

-- DropTable
DROP TABLE "_CollectionToGroup";

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add uuid to every row in the Permission table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
UPDATE "Permission" SET "id" = uuid_generate_v4();