/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveredAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffStartedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickupStartedAt` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "acceptedAt",
DROP COLUMN "deliveredAt",
DROP COLUMN "dropoffStartedAt",
DROP COLUMN "pickupStartedAt";
