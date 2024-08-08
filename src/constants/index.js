import path from 'node:path';

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_MONTH = 24 * 60 * 60 * 1000*30;
export const ONE_DAY = 24 * 60 * 60 * 1000;

export const SMTP = {
    HOST: process.env.SMTP_HOST,
    PORT: Number(process.env.SMTP_PORT),
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASSWORD,
    FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
  };

  export const TEMPLATE_DIR = path.resolve('src', 'templates');
