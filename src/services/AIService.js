// AI Service for Claude API Integration
// Analyzes CPD documents and certificates for compliance and relevance

class AIService {
  static async analyzeDocument(fileContent, fileType) {
    try {
      // Check if file is actually an image format Claude can process
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!validImageTypes.includes(fileType)) {
        throw new Error(`Unsupported file format: ${fileType}. Please upload an image file (JPG, PNG, GIF, or WebP). PDFs are not supported by Claude's vision API.`);
      }

      const base64Content = await this.fileToBase64(fileContent);
      const fileName = fileContent.name || 'document';
      const mimeType = this.getMimeType(fileType);

      console.log(`Uploading file: ${fileName}, type: ${fileType}, mime: ${mimeType}, base64 length: ${base64Content.length}`);

      const response = await fetch('http://localhost:3001/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileContent: base64Content,
          fileName: fileName,
          mimeType: mimeType
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Backend error response:', errorData);
        throw new Error(`Backend API error: ${errorData.error?.message || errorData.error || response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze document');
      }

      return result.data;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  static async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static getMimeType(fileType) {
    // Only return valid Claude vision API image types
    const mimeTypes = {
      'image/png': 'image/png',
      'image/jpeg': 'image/jpeg',
      'image/jpg': 'image/jpeg',
      'image/webp': 'image/webp',
      'image/gif': 'image/gif'
    };
    return mimeTypes[fileType] || fileType;
  }

  static async generateActivitySummary(activityData) {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }

    const prompt = `You are a SAICA CPD compliance expert. Generate a professional, concise learning outcome summary for this CPD activity:

Activity: ${activityData.activity}
Type: ${activityData.activityType}
Provider: ${activityData.provider}
Hours: ${activityData.cpdHours}
Description: ${activityData.description}

Provide:
1. A clear learning outcome statement (2-3 sentences) explaining what was learned and how it applies to professional practice
2. Key competencies developed
3. Suggested reflection points for SAICA compliance

Format as a professional summary suitable for regulatory review.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 512,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Claude API Error');
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('AI Summary Generation Error:', error);
      throw error;
    }
  }

  static async validateCPDCompliance(activities) {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }

    const activitiesJson = JSON.stringify(activities, null, 2);
    const prompt = `You are a SAICA CPD compliance auditor. Analyze these CPD activities for SAICA compliance:

${activitiesJson}

Provide:
1. Total CPD hours and compliance status (SAICA requires 40 hours annually)
2. Activity type breakdown assessment
3. Risk areas or non-compliant activities
4. Recommendations for improvement
5. Readiness for SAICA audit

Format as a compliance audit report.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Claude API Error');
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('AI Compliance Check Error:', error);
      throw error;
    }
  }
}

export default AIService;
