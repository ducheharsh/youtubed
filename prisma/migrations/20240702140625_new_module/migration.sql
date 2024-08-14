/*
  Warnings:

  - The primary key for the `Playlists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `url` on the `Videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pid]` on the table `Playlists` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Playlists` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_playlistId_fkey";

-- AlterTable
ALTER TABLE "Playlists" DROP CONSTRAINT "Playlists_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Playlists_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "url";

-- CreateIndex
CREATE UNIQUE INDEX "Playlists_pid_key" ON "Playlists"("pid");

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
