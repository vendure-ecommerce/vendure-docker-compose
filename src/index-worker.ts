import { bootstrapWorker } from '@vendure/core';

import { config } from './vendure-config';
import { setupWorker } from './setup';

setupWorker()
    .then(() => bootstrapWorker(config))
    .then(worker => worker.startJobQueue())
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
