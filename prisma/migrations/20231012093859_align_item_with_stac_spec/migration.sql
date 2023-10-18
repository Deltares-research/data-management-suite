/*
  Warnings:

  - You are about to drop the column `assets` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `license` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `projectNumber` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `_ItemToKeyword` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemToKeyword" DROP CONSTRAINT "_ItemToKeyword_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToKeyword" DROP CONSTRAINT "_ItemToKeyword_B_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "assets",
DROP COLUMN "description",
DROP COLUMN "license",
DROP COLUMN "location",
DROP COLUMN "projectNumber",
DROP COLUMN "title";

-- DropTable
DROP TABLE "_ItemToKeyword";

-- CreateTable
CREATE TABLE "Link" (
    "href" TEXT NOT NULL,
    "rel" TEXT NOT NULL,
    "type" TEXT,
    "title" TEXT,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("itemId","href")
);

-- CreateTable
CREATE TABLE "Asset" (
    "href" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "type" TEXT,
    "roles" TEXT[],
    "itemId" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("itemId","href")
);

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
