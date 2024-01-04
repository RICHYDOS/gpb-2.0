let connection, client, SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD;

if (process.env.ENVIRONMENT == "development") {
    connection = {
        connectionString: process.env.DATABASE_URL,
        host: process.env.DEVELOPMENT_DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DEVELOPMENT_DATABASE_PORT) || 5432,
        database: process.env.DEVELOPMENT_DATABASE_NAME || 'strapi',
        user: process.env.DEVELOPMENT_DATABASE_USERNAME || 'strapi',
        password: process.env.DEVELOPMENT_DATABASE_PASSWORD || 'strapi',
        ssl: (process.env.DEVELOPMENT_DATABASE_SSL || false) && {
          key: process.env.DEVELOPMENT_DATABASE_SSL_KEY || undefined,
          cert: process.env.DEVELOPMENT_DATABASE_SSL_CERT || undefined,
          ca: process.env.DEVELOPMENT_DATABASE_SSL_CA || undefined,
          capath:  process.env.DEVELOPMENT_DATABASE_SSL_CAPATH || undefined,
          cipher: process.env.DEVELOPMENT_DATABASE_SSL_CIPHER || undefined,
          rejectUnauthorized: process.env.DEVELOPMENT_DATABASE_SSL_REJECT_UNAUTHORIZED || true,
        },
        schema: process.env.DATABASE_SCHEMA || 'public'
    };
    client = process.env.DEVELOPMENT_DATABASE_CLIENT || 'sqlite';
    SMTP_HOST = process.env.DEVELOPMENT_SMTP_HOST;
    SMTP_PORT = process.env.DEVELOPMENT_SMTP_PORT;
    SMTP_USERNAME = process.env.DEVELOPMENT_SMTP_USERNAME;
    SMTP_PASSWORD = process.env.DEVELOPMENT_SMTP_PASSWORD;

} else if (process.env.ENVIRONMENT == "production") {
    connection = {
        connectionString: process.env.DATABASE_URL,
        host: process.env.PRODUCTION_DATABASE_HOST || 'localhost',
        port: parseInt(process.env.PRODUCTION_DATABASE_PORT) || 5432,
        database: process.env.PRODUCTION_DATABASE_NAME || 'strapi',
        user: process.env.PRODUCTION_DATABASE_USERNAME || 'strapi',
        password: process.env.PRODUCTION_DATABASE_PASSWORD || 'strapi',
        ssl: (process.env.PRODUCTION_DATABASE_SSL || false) && {
          key: process.env.PRODUCTION_DATABASE_SSL_KEY || undefined,
          cert: process.env.PRODUCTION_DATABASE_SSL_CERT || undefined,
          ca: process.env.PRODUCTION_DATABASE_SSL_CA || undefined,
          capath:  process.env.PRODUCTION_DATABASE_SSL_CAPATH || undefined,
          cipher: process.env.PRODUCTION_DATABASE_SSL_CIPHER || undefined,
          rejectUnauthorized: process.env.PRODUCTION_DATABASE_SSL_REJECT_UNAUTHORIZED || true,
        },
        schema: process.env.DATABASE_SCHEMA || 'public'
    };
    client = process.env.PRODUCTION_DATABASE_CLIENT || 'sqlite';
    SMTP_HOST = process.env.PRODUCTION_SMTP_HOST;
    SMTP_PORT = process.env.PRODUCTION_SMTP_PORT;
    SMTP_USERNAME = process.env.PRODUCTION_SMTP_USERNAME;
    SMTP_PASSWORD = process.env.PRODUCTION_SMTP_PASSWORD;
}

export {connection, client, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME};
