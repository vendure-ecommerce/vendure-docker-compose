import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import path from "path";

export const config: VendureConfig = {
  apiOptions: {
    hostname: "0.0.0.0",
    port: 3000,
    adminApiPath: "admin-api",
    adminApiPlayground: {
      settings: {
        "request.credentials": "include",
      } as any,
    }, // turn this off for production
    adminApiDebug: true, // turn this off for production
    shopApiPath: "shop-api",
    shopApiPlayground: {
      settings: {
        "request.credentials": "include",
      } as any,
    }, // turn this off for production
    shopApiDebug: true, // turn this off for production
  },
  authOptions: {
    superadminCredentials: {
      identifier: "superadmin",
      password: "superadmin",
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || "cookie-secret",
    },
  },
  dbConnectionOptions: {
    type: "postgres",
    synchronize: true, // turn this off for production
    logging: false,
    database: "vendure",
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    migrations: [path.join(__dirname, "../migrations/*.ts")],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      assetUrlPrefix: "http://localhost:3000/assets/",
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: "http://localhost:8080/verify",
        passwordResetUrl: "http://localhost:8080/password-reset",
        changeEmailAddressUrl:
          "http://localhost:8080/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3002,
    }),
  ],
};
