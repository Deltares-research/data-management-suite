/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CatalogToGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_personId_fkey";

-- DropForeignKey
ALTER TABLE "_CatalogToGroup" DROP CONSTRAINT "_CatalogToGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_CatalogToGroup" DROP CONSTRAINT "_CatalogToGroup_B_fkey";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "_CatalogToGroup";

-- CreateTable
CREATE TABLE "Permission" (
    "groupId" TEXT NOT NULL,
    "catalogId" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("catalogId","groupId")
);

-- CreateTable
CREATE TABLE "_GroupToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToPerson_AB_unique" ON "_GroupToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToPerson_B_index" ON "_GroupToPerson"("B");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "Catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToPerson" ADD CONSTRAINT "_GroupToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToPerson" ADD CONSTRAINT "_GroupToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
