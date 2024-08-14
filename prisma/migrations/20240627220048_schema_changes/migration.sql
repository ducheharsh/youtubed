/*
  Warnings:

  - The primary key for the `Playlists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Playlists` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Playlists` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Videos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Videos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Playlists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_playlistId_fkey";

-- DropIndex
DROP INDEX "Videos_title_key";

-- AlterTable
ALTER TABLE "Playlists" DROP CONSTRAINT "Playlists_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL,
ADD CONSTRAINT "Playlists_pkey" PRIMARY KEY ("pid");

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "description",
DROP COLUMN "title";

-- CreateIndex
CREATE UNIQUE INDEX "Videos_id_key" ON "Videos"("id");

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlists"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;
