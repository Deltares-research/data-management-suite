/*
  Warnings:

  - You are about to drop the `_GroupAdmins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "_GroupAdmins" DROP CONSTRAINT "_GroupAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupAdmins" DROP CONSTRAINT "_GroupAdmins_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMembers" DROP CONSTRAINT "_GroupMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMembers" DROP CONSTRAINT "_GroupMembers_B_fkey";

-- DropTable
DROP TABLE "_GroupAdmins";

-- DropTable
DROP TABLE "_GroupMembers";

-- CreateTable
CREATE TABLE "Member" (
    "personId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("personId","groupId")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
