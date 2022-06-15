-- CreateEnum
CREATE TYPE "CombatOutcomeEnum" AS ENUM ('WIN', 'LOSS', 'DRAW', 'ERROR');

-- CreateEnum
CREATE TYPE "DragonColorEnum" AS ENUM ('RED', 'GREEN', 'BLUE', 'YELLOW', 'WHITE', 'BLACK');

-- CreateTable
CREATE TABLE "PveLog" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "numberOfRounds" INTEGER NOT NULL DEFAULT 0,
    "outcome" "CombatOutcomeEnum" NOT NULL DEFAULT E'DRAW',
    "dragonId" UUID NOT NULL,
    "heroId" UUID NOT NULL,

    CONSTRAINT "PveLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PvpLog" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "numberOfRounds" INTEGER NOT NULL DEFAULT 0,
    "outcome" "CombatOutcomeEnum" NOT NULL DEFAULT E'DRAW',
    "attackerId" UUID NOT NULL,
    "defenderId" UUID NOT NULL,

    CONSTRAINT "PvpLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dragon" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 1,
    "color" "DragonColorEnum" NOT NULL DEFAULT E'RED',
    "currentHp" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Dragon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "name" VARCHAR NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "currentHp" INTEGER NOT NULL DEFAULT 1,
    "equippedItem" VARCHAR,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "name" VARCHAR NOT NULL,
    "ownerId" UUID,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PveLog" ADD CONSTRAINT "PveLog_dragonId_fkey" FOREIGN KEY ("dragonId") REFERENCES "Dragon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PveLog" ADD CONSTRAINT "PveLog_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PvpLog" ADD CONSTRAINT "PvpLog_attackerId_fkey" FOREIGN KEY ("attackerId") REFERENCES "Hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PvpLog" ADD CONSTRAINT "PvpLog_defenderId_fkey" FOREIGN KEY ("defenderId") REFERENCES "Hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
