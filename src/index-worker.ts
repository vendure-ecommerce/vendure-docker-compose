import { bootstrapWorker, mergeConfig, VendureConfig } from '@vendure/core';

import { config } from './vendure-config';
import { setupWorker } from './setup';

const workerConfig: VendureConfig = mergeConfig(
    config,
    {
        workerOptions: {
            options: {
                host: process.env.WORKER_REMOTE ? '0.0.0.0' : 'localhost',
                port: Number(process.env.WORKER_PORT) || 3020,
            },
        },
    }
);

setupWorker()
    .then(() => bootstrapWorker(workerConfig))
    .catch((err) => {
    console.log(err);
    process.exit(1);
});
