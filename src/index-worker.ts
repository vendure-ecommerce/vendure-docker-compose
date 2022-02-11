import { bootstrapWorker } from '@vendure/core';
import { setupServer } from './setup';
import { config } from './vendure-config';

setupServer(false)
    .then(() => bootstrapWorker(config))
    .then((worker) => worker.startJobQueue())
    .catch((err) => {
        // tslint:disable-next-line:no-console
        console.log(err);
    });
