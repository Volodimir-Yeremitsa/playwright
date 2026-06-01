import dotenv from 'dotenv';

dotenv.config();

function getEnv(name: string, defaultValue?: string): string {
  const value = process.env[name]?.trim();

  if (value) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Environment variable ${name} is required`);
}

function getBooleanEnv(name: string, defaultValue: boolean): boolean {
  return getEnv(name, String(defaultValue)).toLowerCase() === 'true';
}

function getNumberEnv(name: string, defaultValue: number): number {
  const value = Number(getEnv(name, String(defaultValue)));

  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }

  return value;
}

export const ENV = {
  BASE_URL: getEnv('BASE_URL', 'https://www.greencity.cx.ua/#/greenCity'),
  HEADLESS: getBooleanEnv('HEADLESS', true),
  RETRIES: getNumberEnv('RETRIES', 0),
  TIMEOUT: getNumberEnv('TIMEOUT', 30000),
  LOGIN_EMAIL: getEnv('LOGIN_EMAIL', ''),
  LOGIN_PASSWORD: getEnv('LOGIN_PASSWORD', ''),
};
