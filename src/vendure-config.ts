import {
    examplePaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { EmailPlugin, defaultEmailHandlers } from '@vendure/email-plugin';
import path from 'path';

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        }, // turn this off for production
        adminApiDebug: true, // turn this off for production
        shopApiPath: 'shop-api',
        shopApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        }, // turn this off for production
        shopApiDebug: true, // turn this off for production
    },
    authOptions: {
        superadminCredentials: {
            identifier: 'superadmin',
            password: 'superadmin',
        },
        requireVerification: true,
        /*cookieOptions: {
            domain: 'localhost:4000',
            sameSite: 'strict',
        },*/
    },
    workerOptions: {
        options: {
            host: process.env.WORKER_HOST || 'localhost',
            port: Number(process.env.WORKER_PORT) || 3020,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: false, // turn this off for production
        logging: false,
        database: 'vendure',
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT) || 5432,
        username: 'postgres',
        password: 'password',
        migrations: [path.join(__dirname, '../migrations/*.ts')],
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            port: 3001,
            assetUrlPrefix: 'http://localhost:3000/assets/',
        }),
        DefaultJobQueuePlugin,
        DefaultSearchPlugin,
        AdminUiPlugin.init({
            port: 3002,
        }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            mailboxPort: 3003,
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../static/email/templates'),
            globalTemplateVars: {
                // The following variables will change depending on your storefront implementation
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:8080/verify',
                passwordResetUrl: 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
            },
        }),
    ],
};

