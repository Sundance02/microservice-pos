-- AlterEnum
ALTER TYPE "Type" ADD VALUE 'Reserve';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "unitprice" INTEGER NOT NULL DEFAULT 25;
