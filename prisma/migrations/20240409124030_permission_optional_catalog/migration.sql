-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_catalogId_fkey";

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "catalogId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "Catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
