-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "dropoffStartedAt" TIMESTAMP(3),
ADD COLUMN     "pickupStartedAt" TIMESTAMP(3);
