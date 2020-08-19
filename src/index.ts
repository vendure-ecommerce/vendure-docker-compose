import { bootstrap } from '@vendure/core';

import { config } from './vendure-config';
import { setupServer } from './setup';

setupServer()
    .then(() => {
        return bootstrap(config);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
