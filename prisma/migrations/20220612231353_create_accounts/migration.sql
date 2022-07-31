/*
  Warnings:

  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT,
    "destination" INTEGER,
    "amount" INTEGER
);
INSERT INTO "new_Event" ("id") SELECT "id" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Balance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "accountId" INTEGER,
    CONSTRAINT "Balance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Balance" ("amount", "id") SELECT "amount", "id" FROM "Balance";
DROP TABLE "Balance";
ALTER TABLE "new_Balance" RENAME TO "Balance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
