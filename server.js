import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const cjsBundlePath = path.join(__dirname, 'dist', 'server.cjs');
const jsBundlePath = path.join(__dirname, 'dist', 'server.js');

if (fs.existsSync(cjsBundlePath)) {
  require(cjsBundlePath);
} else if (fs.existsSync(jsBundlePath)) {
  require(jsBundlePath);
} else {
  console.error("Erro: O arquivo de servidor compilado não foi encontrado em 'dist/server.cjs'. Execute 'npm run build' primeiro.");
  process.exit(1);
}
