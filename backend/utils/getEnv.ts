export const getEnv = (envVar: string): string => {
  const envValue = process.env[envVar];
  if (!envValue) {
    throw new Error(`Environment variable ${envVar} is not defined`);
  }
  return envValue;
};
