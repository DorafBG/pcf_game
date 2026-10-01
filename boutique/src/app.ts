import express from 'express';
import { items } from './items.js';

// Ici sont definies toutes les routes API
export function buildApp() {
  const app = express();

  app.use(express.json());

  // permet d'utiliser les images stockees
  app.use('/api/v1/boutique/images', express.static('public/images'));

  // PErmet de verifie que le service est bien en ligne
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'boutique',
      uptime: process.uptime()
    });
  });

  // Route catalogue qui liste tous les items de la boutique (ex: /api/v1/boutique)
  app.get(['/api/v1/boutique', '/api/v1/boutique/'], (_req, res) => {
    res.json(items);
  });

  // Route pour un item specifique (ex: /api/v1/boutique/1)
  app.get('/api/v1/boutique/:id', (req, res) => {
    const item = items.find((i) => i.id === req.params.id);
    if (!item) {
      res.status(404).json({
        error: 'Item non trouvé',
        id: req.params.id
      });
      return;
    }
    res.json(item);
  });

  return app;
}
