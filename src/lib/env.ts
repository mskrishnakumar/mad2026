/**
 * Environment variable validation
 * Import this file early in your app to validate required env vars at startup
 */

type EnvConfig = {
  required: string[];
  optional: string[];
};

const config: EnvConfig = {
  required: [
    // Add required env vars here when you need them
    // 'AZURE_OPENAI_API_KEY',
    // 'AZURE_OPENAI_ENDPOINT',
  ],
  optional: [
    'AZURE_OPENAI_API_KEY',
    'AZURE_OPENAI_ENDPOINT',
    'AZURE_OPENAI_DEPLOYMENT',
    'AZURE_OPENAI_EMBEDDING_DEPLOYMENT',
    'AZURE_OPENAI_API_VERSION',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GA_ID',
  ],
};

function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of config.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check optional variables and warn if AI features won't work
  const aiVars = ['AZURE_OPENAI_API_KEY', 'AZURE_OPENAI_ENDPOINT'];
  const hasAiConfig = aiVars.some((key) => process.env[key]);
  const missingAiVars = aiVars.filter((key) => !process.env[key]);

  if (hasAiConfig && missingAiVars.length > 0) {
    warnings.push(`Partial AI config detected. Missing: ${missingAiVars.join(', ')}`);
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

// Run validation on import (server-side only)
if (typeof window === 'undefined') {
  const { valid, missing, warnings } = validateEnv();

  if (!valid) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    // Uncomment to fail hard on missing required vars:
    // throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Environment warnings:');
    warnings.forEach((w) => console.warn(`   - ${w}`));
  }
}

// Export for manual validation if needed
export { validateEnv, config as envConfig };
