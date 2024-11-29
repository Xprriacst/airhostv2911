interface EnvConfig {
  openai: {
    apiKey: string;
  };
  airtable: {
    apiKey: string;
    baseId: string;
  };
  make: {
    webhookUrl: string;
    webhookSecret: string;
  };
}

export const env: EnvConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  },
  airtable: {
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || '',
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
  },
  make: {
    webhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL || '',
    webhookSecret: import.meta.env.MAKE_WEBHOOK_SECRET || '',
  },
};

// Validation des variables d'environnement requises
const requiredEnvVars = [
  'VITE_OPENAI_API_KEY',
  'VITE_AIRTABLE_API_KEY',
  'VITE_AIRTABLE_BASE_ID',
  'VITE_MAKE_WEBHOOK_URL',
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}