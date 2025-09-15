import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmMongoConfig } from '../src/config/typeorm.config';
import { AppConfigEntity } from '../src/app-config/entities/app-config.entity';

async function run() {
  const opts = await typeOrmMongoConfig();
  const ds = new DataSource(opts);
  await ds.initialize();

  try {
    const repository = ds.getMongoRepository(AppConfigEntity);

    await repository.createCollectionIndex({ active: 1 }, {
      unique: true,
      partialFilterExpression: { active: true },
    } as any);

    const existing = await repository.findOne({ where: { active: true } });
    if (existing) {
      console.log('[seed] Active config already exists:', existing._id?.toString());
      return;
    }

    const entity = repository.create({
      active: true,
      os_allow: ['windows', 'linux', 'android'],
      country_allow: [],
      manifest: {
        name: 'Black Landing',
        short_name: 'Black',
        start_url: '/',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    });

    const saved = await repository.save(entity);
    console.log('[seed] Active config created:', saved._id?.toString());
  } finally {
    await ds.destroy();
  }
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
