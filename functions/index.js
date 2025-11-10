const functions = require('firebase-functions');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const corsHandler = cors({ origin: true });

const client = new Anthropic({
  apiKey: functions.config().claude ? functions.config().claude.key : process.env.VITE_CLAUDE_API_KEY,
});

// Health check endpoint
exports.health = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    const hasApiKey = !!process.env.VITE_CLAUDE_API_KEY;
    res.json({ 
      status: 'ok', 
      apiKeyConfigured: hasApiKey,
      environment: 'Firebase Cloud Functions'
    });
  });
});

// Main document analysis endpoint
exports.analyzeDocument = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { fileContent, fileName, mimeType } = req.body;

      if (!fileContent || !fileName) {
        return res.status(400).json({ error: 'Missing fileContent or fileName' });
      }

      if (typeof fileContent !== 'string' || fileContent.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty fileContent' });
      }

      const base64Data = fileContent;
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const finalMimeType = validMimeTypes.includes(mimeType) ? mimeType : 'image/jpeg';

      console.log(`Processing file: ${fileName}, mime type: ${finalMimeType}, base64 length: ${base64Data.length}`);

      const message = await client.messages.create({
        model: 'claude-3-sonnet-20240229',
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
                text: `Analyze this CPD/professional development document or certificate. Extract and provide:
1. Provider/Organization name
2. Activity type (e.g., Workshop, Conference, Online Course, Webinar, Self-Study, etc.)
3. Brief description of what was learned
4. Estimated CPD hours (be realistic - typically 1-8 hours for most activities)
5. Competency areas covered (e.g., Technical, Ethical, Communications, etc.)
6. Date if visible

Format as JSON:
{
  "provider": "name",
  "activityType": "type",
  "description": "what was learned",
  "cpdHours": number,
  "competencyAreas": ["area1", "area2"],
  "date": "date if visible or null"
}`
              }
            ],
          }
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      
      // Parse JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        provider: 'Unknown',
        activityType: 'Learning Activity',
        description: responseText,
        cpdHours: 2,
        competencyAreas: ['Professional Development'],
        date: null
      };

      res.json({
        success: true,
        data: data
      });

    } catch (error) {
      console.error('Error analyzing document:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to analyze document'
      });
    }
  });
});

// Reflection generation endpoint
exports.generateReflection = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { activityData } = req.body;

      if (!activityData) {
        return res.status(400).json({ error: 'Missing activityData' });
      }

      const prompt = `Based on this CPD activity, generate a thoughtful reflection:
Activity: ${activityData.activity}
Type: ${activityData.activityType}
Provider: ${activityData.provider}
Description: ${activityData.description}

Please provide:
1. Key learnings (2-3 bullet points)
2. How this applies to my work (2-3 bullet points)
3. Future learning needs identified (2-3 bullet points)

Format the response with clear sections.`;

      const message = await client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });

      const reflection = message.content[0].type === 'text' ? message.content[0].text : '';

      res.json({
        success: true,
        reflection: reflection
      });

    } catch (error) {
      console.error('Error generating reflection:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate reflection'
      });
    }
  });
});
