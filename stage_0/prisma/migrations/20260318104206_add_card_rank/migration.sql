/*
  Warnings:

  - A unique constraint covering the columns `[columnId,rank]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rank` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "rank" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Card_columnId_rank_key" ON "Card"("columnId", "rank");
