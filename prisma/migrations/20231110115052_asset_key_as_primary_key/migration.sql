/*
  Warnings:

  - The primary key for the `Asset` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_pkey",
ADD CONSTRAINT "Asset_pkey" PRIMARY KEY ("itemId", "key");
