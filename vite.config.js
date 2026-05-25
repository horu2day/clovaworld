import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/**
 * Vite 플러그인: /data/* 경로로 프로젝트 루트 data/ 폴더를 정적 서빙
 * FloorPlanParser가 라벨 JSON 파일을 fetch()로 접근 가능하게 함
 */
function serveDataFolderPlugin() {
  const dataDir = path.resolve(__dirname, 'data');
  return {
    name: 'serve-data-folder',
    configureServer(server) {
      server.middlewares.use('/data', (req, res, next) => {
        try {
          // URL 디코딩 후 파일 경로 구성
          const filePath = path.join(dataDir, decodeURIComponent(req.url));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentTypes = {
              '.json': 'application/json; charset=utf-8',
              '.png':  'image/png',
              '.jpg':  'image/jpeg',
              '.jpeg': 'image/jpeg',
            };
            res.setHeader('Content-Type', contentTypes[ext] ?? 'application/octet-stream');
            res.setHeader('Cache-Control', 'no-cache');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        } catch (e) {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [serveDataFolderPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@data': path.resolve(__dirname, 'data')
    }
  }
});
