// require dotenv
import { config as env } from 'dotenv';

env();

export const getEnv = (envVar: string): string => {
  const envValue = process.env[envVar];
  if (!envValue) {
    throw new Error(`Environment variable ${envVar} is not defined`);
  }
  return envValue;
};

export interface Table {
  tableName: string;
  primaryKey: string;
  secondaryIndexes: string[];
}

interface DatabaseConfig {
  tables: Record<string, Table>;
}

interface CognitoConfig {
  pool: { id: string };
  appClient: { id: string };
  region: string;
}

export interface Config {
  db: DatabaseConfig;
  cognito: CognitoConfig;
}

export const config: Config = {
  db: {
    tables: {
      spaces: {
        tableName: getEnv('TABLE_NAME'),
        primaryKey: getEnv('PRIMARY_KEY'),
        //!NTS -- can only perform one creation/deletion a row at a time
        // e.g can't replace a sec index with another in one go - need to remove
        // the old one -> deploy -> add new one -> deploy
        secondaryIndexes: ['location', 'whereuat'],
      },
    },
  },
  cognito: {
    pool: {
      id: getEnv('USER_POOL_ID'),
    },
    appClient: {
      id: getEnv('APP_CLIENT_ID'),
    },
    region: getEnv('REGION'),
  },
};
