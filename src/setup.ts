/* eslint-disable @typescript-eslint/no-var-requires */
import { bootstrap, defaultConfig, mergeConfig, VendureConfig, JobQueueService } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import { clearAllTables, populateCustomers } from '@vendure/testing';
import path from 'path';
import fs from 'fs-extra';

import { config } from './vendure-config';

// tslint:disable:no-console

const rootDir = path.join(__dirname, '..');
const emailTemplateDir = path.join(rootDir, 'static', 'email', 'templates');

export async function setupWorker() {
    if (!fs.pathExistsSync(emailTemplateDir)) {
        await copyEmailTemplates();
    }
}

export async function setupServer() {
    console.log('isInitialRun:', isInitialRun());
    if (isInitialRun()) {
        console.log('Initial run - populating test data...');
        const populateConfig = mergeConfig(
            defaultConfig,
            mergeConfig(config, {
                authOptions: {
                    tokenMethod: 'bearer',
                    requireVerification: false,
                },
                importExportOptions: {
                    importAssetsDir: path.join(require.resolve('@vendure/create'), '../assets/images'),
                },
                customFields: {},
            }),
        );

        const initialData = require(path.join(require.resolve('@vendure/create'), '../assets/initial-data.json'));
        await createDirectoryStructure();
        await copyEmailTemplates();
        await clearAllTablesWithPolling(populateConfig);
        const app = await populate(
            () => bootstrap(populateConfig).then(async _app => {
                await _app.get(JobQueueService).start();
                return _app;
            }),
            initialData,
            path.join(require.resolve('@vendure/create'), '../assets/products.csv'),
        );
        try {
            console.log('populating customers...');
            await populateCustomers(10, populateConfig, true);
            config.authOptions.requireVerification = true;
            return app.close();
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    }
}

function isInitialRun(): boolean {
    return !fs.pathExistsSync(emailTemplateDir);
}

/**
 * Generate the default directory structure for a new Vendure project
 */
async function createDirectoryStructure() {
    await fs.ensureDir(path.join(rootDir, 'static', 'email', 'test-emails'));
    await fs.ensureDir(path.join(rootDir, 'static', 'assets'));
}

/**
 * Copy the email templates into the app
 */
async function copyEmailTemplates() {
    const templateDir = path.join(require.resolve('@vendure/email-plugin'), '../../templates');
    try {
        await fs.copy(templateDir, emailTemplateDir);
        console.log('Copied email templates to', templateDir);
    } catch (err) {
        console.error(`Failed to copy email templates.`, err);
    }
}

async function clearAllTablesWithPolling(populateConfig: VendureConfig) {
    let attempts = 0;
    let maxAttempts = 5;
    const pollIntervalMs = 2000;
    while (attempts < maxAttempts) {
        attempts++;
        try {
            console.log(`Attempting to clear all tables (attempt ${attempts})...`);
            await clearAllTables(populateConfig, true);
            return;
        } catch (e) {
            console.log(`Could not clear tables: ${e.message}`);
        }
    }
}
