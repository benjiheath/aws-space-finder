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
      },
    },
  },
};
