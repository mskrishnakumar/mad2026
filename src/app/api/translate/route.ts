import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const subscriptionKey = process.env.AZURE_TRANSLATOR_KEY;
    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
    const region = process.env.AZURE_TRANSLATOR_REGION || 'global';

    if (!subscriptionKey) {
      return NextResponse.json(
        { error: 'Azure Translator configuration missing' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${endpoint}/translate?api-version=3.0&to=${targetLanguage}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text }]),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Translation failed', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translatedText = data[0]?.translations[0]?.text || text;

    return NextResponse.json({ translatedText, originalText: text });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
