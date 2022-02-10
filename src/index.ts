import { bootstrap } from '@vendure/core';
import { setupServer } from './setup';
import { config } from './vendure-config';

setupServer()
    .then(() => bootstrap(config))
    .catch((err) => {
        // tslint:disable-next-line:no-console
        console.log(err);
    });
