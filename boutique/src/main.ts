import { buildApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
const host = '0.0.0.0';

const app = buildApp();

app.listen(port, host, () => {
  console.log(`[Boutique] Le microservice boutique écoute sur http://${host}:${port}`);
  console.log(`[Boutique] Route catalogue disponible sur http://localhost:${port}/api/v1/boutique`);
});
