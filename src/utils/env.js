import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) {
    console.warn(`Warning: Using default value for process.env['${name}'].`);
    return defaultValue;
  }

  throw new Error(`Missing: process.env['${name}'].`);
}
