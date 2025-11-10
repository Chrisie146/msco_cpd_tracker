import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const client = new Anthropic({
  apiKey: process.env.VITE_CLAUDE_API_KEY,
});

// Health check endpoint
app.get('/health', (req, res) => {
  const hasApiKey = !!process.env.VITE_CLAUDE_API_KEY;
  res.json({ 
    status: 'ok', 
    apiKeyConfigured: hasApiKey,
    port: port 
  });
});

app.post('/api/analyze-document', async (req, res) => {
  try {
    const { fileContent, fileName, mimeType } = req.body;

    if (!fileContent || !fileName) {
      return res.status(400).json({ error: 'Missing fileContent or fileName' });
    }

    // Check if fileContent is valid base64
    if (typeof fileContent !== 'string' || fileContent.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty fileContent' });
    }

    // fileContent is already base64 without the data: prefix
    const base64Data = fileContent;

    // Validate mime type - Claude only accepts specific image formats
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const finalMimeType = validMimeTypes.includes(mimeType) ? mimeType : 'image/jpeg';

    console.log(`Processing file: ${fileName}, mime type: ${finalMimeType}, base64 length: ${base64Data.length}`);

    const message = await client.messages.create({
      model: 'claude-opus-4-1', // Updated model name
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: finalMimeType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Analyze this CPD (Continuing Professional Development) document for SAICA compliance. Extract:
1. Activity type (Formal, Informal, Compulsory, Webinar, Conference, Reading, Other)
2. CPD hours earned
3. Provider/Organization name
4. Competency areas addressed
5. Brief description of the activity
6. Learning outcome

Return as JSON with fields: activityType, cpdHours, provider, competencyAreas (array), description, outcome`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Try to extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { rawResponse: responseText };

    res.json({ success: true, data: analysisResult });
  } catch (error) {
    console.error('API Error:', error.message);
    const errorMessage = error.message || 'Unknown error';
    res.status(500).json({ error: errorMessage, details: error });
  }
});

app.post('/api/generate-summary', async (req, res) => {
  try {
    const { activities } = req.body;

    const message = await client.messages.create({
      model: 'claude-opus-4-1', // Updated model name
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Summarize these CPD activities for a SAICA compliance report:\n\n${JSON.stringify(activities, null, 2)}\n\nProvide a concise summary of competency development and compliance status.`,
        },
      ],
    });

    const summary = message.content[0].type === 'text' ? message.content[0].text : '';
    res.json({ success: true, summary });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/validate-compliance', async (req, res) => {
  try {
    const { activities, targetHours = 40 } = req.body;

    const message = await client.messages.create({
      model: 'claude-opus-4-1', // Updated model name
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Validate these CPD activities against SAICA requirements (minimum ${targetHours} hours):\n\n${JSON.stringify(activities, null, 2)}\n\nReturn JSON with: isCompliant (boolean), totalHours (number), gaps (array), recommendations (array)`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const validationResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { rawResponse: responseText };

    res.json({ success: true, data: validationResult });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// General chat endpoint for AI assistance
app.post('/api/chat', async (req, res) => {
  try {
    const { message: userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const response = message.content[0].type === 'text' ? message.content[0].text : '';
    res.json({ success: true, response });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ CPD API proxy running at http://localhost:${port}`);
});
