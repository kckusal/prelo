/*
  Warnings:

  - You are about to drop the column `tags` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedByUserId` on the `Document` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_updatedByUserId_fkey";

-- DropIndex
DROP INDEX "Document_type_author_tags_idx";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "tags",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedByUserId";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnDocuments" (
    "documentId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "TagsOnDocuments_pkey" PRIMARY KEY ("documentId","tagId")
);

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Document_type_author_idx" ON "Document"("type", "author");

-- AddForeignKey
ALTER TABLE "TagsOnDocuments" ADD CONSTRAINT "TagsOnDocuments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnDocuments" ADD CONSTRAINT "TagsOnDocuments_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
