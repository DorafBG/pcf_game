import { prisma } from '../src/db.js';
import { items } from '../src/items.js';

// remplit directemnet la BDD avec les items du catalogue
async function seed() {
  console.log('[Boutique Seed] Debut de l\'insertion des items...');

  // on vide la table pour repartir sur une base propre
  await prisma.cosmeticItem.deleteMany();

  // on insere tous les items du catalogue (items.ts)
  await prisma.cosmeticItem.createMany({
    data: items,
  });

  console.log(`[Boutique Seed] ${items.length} items inseres avec succes dans PostgreSQL !`);
}

seed()
  .catch((error) => {
    console.error('[Boutique Seed] Erreur pendant le seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
