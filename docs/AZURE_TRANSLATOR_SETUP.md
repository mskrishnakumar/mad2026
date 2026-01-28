# Azure Translator Service Setup

This application uses Azure Translator Service to provide multilingual support for Telugu, Hindi, Tamil, Marathi, and English on the home page.

## Features

- **Language Selector**: A globe icon button in the top-right corner allows users to switch between languages
- **Supported Languages**:
  - English (Default)
  - Telugu (తెలుగు)
  - Hindi (हिन्दी)
  - Tamil (தமிழ்)
  - Marathi (मराठी)
- **Smart Caching**: Translations are cached in memory to reduce API calls
- **Persistent Preference**: Language selection is saved to localStorage

## Setup Instructions

### 1. Create Azure Translator Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Translator" and select it
4. Click "Create"
5. Fill in the required information:
   - Subscription: Select your Azure subscription
   - Resource group: Create new or use existing
   - Region: Choose a region (e.g., West US, East US)
   - Name: Give your resource a unique name
   - Pricing tier: Select F0 (Free) or S1 (Paid)
6. Click "Review + create" then "Create"

### 2. Get Your Credentials

1. Once the resource is created, navigate to it
2. Go to "Keys and Endpoint" in the left menu
3. Copy the following values:
   - **Key 1** or **Key 2** (either works)
   - **Endpoint** (usually `https://api.cognitive.microsofttranslator.com`)
   - **Region** (e.g., `westus`, `eastus`)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Azure Translator credentials:
   ```env
   AZURE_TRANSLATOR_KEY=your_actual_key_here
   AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
   AZURE_TRANSLATOR_REGION=your_region_here
   ```

3. Restart your development server if it's running:
   ```bash
   npm run dev
   ```

## Usage

### For Users

1. Visit the home page
2. Click the globe icon in the top-right corner
3. Select your preferred language from the dropdown
4. All text on the page will be translated automatically
5. Your language preference is saved and will persist across sessions

### For Developers

#### Translation Hook

The application uses a custom `useTranslation` hook:

```typescript
import { useTranslation } from '@/lib/hooks/useTranslation';

function MyComponent() {
  const { currentLanguage, changeLanguage, translateText, isTranslating } = useTranslation();

  // Change language programmatically
  changeLanguage('te'); // Telugu

  // Translate text
  const translated = await translateText('Hello', 'hi'); // To Hindi
}
```

#### API Endpoint

The translation API is available at `/api/translate`:

```typescript
// POST /api/translate
{
  "text": "Hello, World!",
  "targetLanguage": "te"  // Language code
}

// Response
{
  "translatedText": "హలో, వరల్డ్!",
  "originalText": "Hello, World!"
}
```

## Architecture

- **Translation API**: [src/app/api/translate/route.ts](../src/app/api/translate/route.ts)
- **Translation Hook**: [src/lib/hooks/useTranslation.ts](../src/lib/hooks/useTranslation.ts)
- **Language Selector**: [src/components/translation/LanguageSelector.tsx](../src/components/translation/LanguageSelector.tsx)
- **Home Page Integration**: [src/app/page.tsx](../src/app/page.tsx)

## Pricing

Azure Translator offers:
- **Free Tier (F0)**: 2 million characters per month
- **Standard Tier (S1)**: Pay-as-you-go, $10 per million characters

For this application, the free tier should be sufficient for development and moderate usage.

## Troubleshooting

### Translation not working

1. Check that environment variables are set correctly in `.env.local`
2. Verify your Azure Translator key is valid and not expired
3. Check browser console for error messages
4. Ensure you have network connectivity to Azure services

### Language not displaying correctly

1. Ensure your browser supports the font for the language
2. Check that the language code is correct (en, te, hi, ta)
3. Verify the translation API is returning data

## References

- [Azure Translator Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/)
- [Azure Translator Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator/)
- [Supported Languages](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/language-support)
