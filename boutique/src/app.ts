import express from 'express';
import { prisma } from './db.js';

// Ici sont definies toutes les routes API
export function buildApp() {
  const app = express();

  app.use(express.json());

  // permet d'utiliser les images stockees
  app.use('/api/v1/boutique/images', express.static('public/images'));

  // Permet de verifier que le service est bien en ligne
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'boutique',
      uptime: process.uptime()
    });
  });

  // Route catalogue qui liste les items depuis la BDD PostgreSQL avec filtrage optionnel :
  // - sans parametre : /api/v1/boutique -> renvoie tout le catalogue depuis la BDD
  // - avec parametre : /api/v1/boutique?category=ROCK -> filtre par categorie dans la BDD
  app.get(['/api/v1/boutique', '/api/v1/boutique/'], async (req, res) => {
    const { category } = req.query;

    try {
      // Si une categorie est demandee, on filtre dessus, sinon on prend tout
      const where = typeof category === 'string' && category.trim().length > 0
        ? { category: category.trim().toUpperCase() }
        : undefined;

      const items = await prisma.cosmeticItem.findMany({
        where,
        orderBy: { id: 'asc' }
      });

      res.json(items);
    } catch (err) {
      console.error('[Boutique] Erreur lecture catalogue BDD :', err);
      res.status(500).json({ error: 'Erreur serveur BDD' });
    }
  });

  // Route pour un item specifique depuis la BDD (ex: /api/v1/boutique/1)
  app.get('/api/v1/boutique/:id', async (req, res) => {
    try {
      const item = await prisma.cosmeticItem.findUnique({
        where: { id: req.params.id }
      });

      if (!item) {
        res.status(404).json({
          error: 'Item non trouvé',
          id: req.params.id
        });
        return;
      }

      res.json(item);
    } catch (err) {
      console.error('[Boutique] Erreur lecture item BDD :', err);
      res.status(500).json({ error: 'Erreur serveur BDD' });
    }
  });

  return app;
}
