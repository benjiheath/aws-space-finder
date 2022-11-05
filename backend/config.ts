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

interface Database {
  tables: Record<string, Table>;
}

export interface Config {
  db: Database;
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
};
