# Environment Setup Guide - Claude AI Integration

## Getting Started with AI Features

The AI Assistant feature requires a Claude API key from Anthropic. This guide walks you through setup.

### Step 1: Create Anthropic Account

1. Visit: https://console.anthropic.com/
2. Click "Sign Up"
3. Create account with email
4. Verify email address
5. Login to dashboard

### Step 2: Generate API Key

1. In Claude console, go to **API Keys** section
2. Click **"Create Key"**
3. Give it a name: `CPD_Tracker_Key` or similar
4. Copy the key (starts with `sk-ant-`)
5. **Save in secure location** (password manager recommended)

### Step 3: Configure Your Project

#### **Option A: Using .env.local (Recommended for Development)**

1. Open your CPD Tracker project folder
2. Create new file: `.env.local`
3. Add line:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-your-actual-key-here
   ```
4. Replace with your actual API key from Step 2
5. Save file
6. Restart development server: `npm run dev`

**Important**: `.env.local` is in `.gitignore` - never commits your key!

#### **Option B: Environment Variable (Windows)**

1. Open PowerShell as Administrator
2. Run:
   ```powershell
   [Environment]::SetEnvironmentVariable("VITE_CLAUDE_API_KEY", "sk-ant-your-key", "User")
   ```
3. Restart your terminal
4. Restart VS Code

#### **Option C: For Production Deployment**

**Deploy to Vercel** (Recommended):
1. Push project to GitHub
2. Connect Vercel to GitHub repository
3. In Vercel dashboard → Settings → Environment Variables
4. Add: `VITE_CLAUDE_API_KEY` = `sk-ant-your-key`
5. Redeploy

**Deploy to Netlify**:
1. Push project to GitHub
2. Connect Netlify to GitHub
3. In Netlify dashboard → Site settings → Build & deploy → Environment
4. Add: `VITE_CLAUDE_API_KEY` = `sk-ant-your-key`
5. Trigger redeploy

### Step 4: Verify Setup

1. Open application in browser
2. Go to **Reflection Phase** (Phase 3)
3. Look for **"AI Assistant"** button (✨)
4. If visible, AI is configured
5. If missing, API key not found - check .env.local

### Step 5: Test AI Features

1. Click **"AI Assistant"** button
2. Upload test document (certificate, PDF, image)
3. Click **"Analyze with AI"**
4. Should see extracted activity data in seconds
5. If error, check API key and console (F12 → Console tab)

---

## API Key Security

### ✅ DO's
- ✅ Store key in `.env.local` (development)
- ✅ Use environment variables (production)
- ✅ Rotate key monthly
- ✅ Create separate keys for different apps
- ✅ Monitor usage in Anthropic dashboard

### ❌ DON'Ts
- ❌ Commit `.env.local` to Git
- ❌ Share key with others
- ❌ Post key on public forums
- ❌ Store in comments or documentation
- ❌ Use in public repositories

### If Key is Compromised
1. Go to Anthropic console
2. Find the key
3. Click "Delete"
4. Generate new key
5. Update in all environments
6. Monitor usage for unauthorized activity

---

## Usage & Billing

### Free Trial
- **$5 free credits** on account creation
- Sufficient for ~200-500 documents
- Valid for 3 months

### Pricing (After Trial)
- **Input**: $0.80 per 1M tokens (~3,000 pages)
- **Output**: $2.40 per 1M tokens
- **Typical cost per analysis**: $0.01 - $0.05

### Monitor Usage
1. Anthropic console → Usage
2. See current month spending
3. Set spending limits if desired
4. View API key usage history

### Cost Optimization Tips
- Use for complex documents (certificates, multi-page)
- Manual entry for simple activities
- Batch analyze similar documents
- Check invoice monthly

---

## Troubleshooting

### "API key not configured"
**Problem**: Button missing or error on AI use
**Solution**:
- Check `.env.local` exists in project root
- Verify key format (starts with `sk-ant-`)
- Restart `npm run dev`
- Check browser console (F12 → Console) for errors

### "Invalid API key"
**Problem**: Error when analyzing document
**Solution**:
- Copy key again from Anthropic console
- Verify no extra spaces in .env.local
- Regenerate new key if stuck
- Check key expiration

### "Rate limit exceeded"
**Problem**: Too many requests too fast
**Solution**:
- Wait a few seconds, retry
- Analyze fewer documents simultaneously
- Spread analysis over time

### "Invalid file format"
**Problem**: Upload rejected
**Solution**:
- Use: PDF, JPG, PNG, GIF, WebP only
- Check file size (<20MB)
- Ensure document is readable/clear

### "No text detected in image"
**Problem**: AI can't read document
**Solution**:
- Ensure image is clear and legible
- Try higher quality scan
- Check image brightness/contrast
- Rotate if sideways

---

## Document Types & Success Rate

### Excellent (High Success)
- ✅ Training certificates (printed/PDF)
- ✅ Webinar confirmation emails
- ✅ Course completion letters
- ✅ Conference attendance proof
- ✅ Clear scanned documents

### Good (Moderate Success)
- ⚠️ Faded photocopy
- ⚠️ Handwritten notes with typed content
- ⚠️ Mixed language documents
- ⚠️ Low-quality phone photos

### Poor (Low Success)
- ❌ Blurry images
- ❌ Purely handwritten documents
- ❌ Images rotated 45+ degrees
- ❌ Very small text (<8pt)

**Tip**: Higher quality scans = better AI extraction

---

## Using AI Assistance Effectively

### Best Practices

1. **Document Quality**
   - Use clean scans (300+ DPI)
   - Ensure all text is readable
   - Crop to relevant content only

2. **Review Results**
   - Don't blindly accept AI output
   - Verify hours and dates
   - Add missing details manually
   - Check competency areas

3. **Time Efficiency**
   - Batch upload 5-10 documents
   - Process similar documents together
   - Keep template activities for consistency

4. **Accuracy**
   - Cross-reference with source documents
   - Adjust AI estimates if needed
   - Add personal reflection/outcomes
   - Verify provider names

### Workflow Example

```
1. Collect 5 training certificates
   ↓
2. Open AI Assistant
   ↓
3. Upload first certificate
   ↓
4. Review AI extraction (takes 5-10 seconds)
   ↓
5. Adjust if needed (hours, provider, description)
   ↓
6. Click "Use This Activity"
   ↓
7. Form pre-fills, you add reflection/outcome
   ↓
8. Repeat for remaining certificates
   ↓
9. Batch time: ~15 minutes for 5 activities
```

---

## Advanced Configuration

### Custom Prompt for Specific Industries

If you need specialized analysis, you can modify AIService.js prompt:

```javascript
// Location: src/services/AIService.js
// Find: const prompt = `You are a SAICA...`
// Edit the prompt string for your needs
```

### Using Different Claude Models

```javascript
// In AIService.js, change:
model: 'claude-3-5-sonnet-20241022'
// To other available models:
model: 'claude-opus'        // Most capable but slower
model: 'claude-haiku'       // Faster, cheaper, less capable
```

### Limiting API Calls

Add rate limiting in AIService.js:
```javascript
static async analyzeDocument(fileContent, fileType) {
  // Add delays to prevent rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));
  // ... rest of function
}
```

---

## Multi-Device Sync (Optional)

For accessing data across devices with AI analysis:

### Option 1: Local Backup/Import
- Export backup on Device A
- Email/upload to Device B
- Import backup
- API keys need to be configured on both

### Option 2: Cloud Sync (Future Enhancement)
- Firebase/Supabase integration
- Automatic sync between devices
- Centralized API key management
- (Not yet implemented, but architecture supports it)

---

## Support Resources

### Documentation
- Anthropic Docs: https://docs.anthropic.com/
- Claude Pricing: https://www.anthropic.com/pricing/claude
- API Console: https://console.anthropic.com/

### Community
- Stack Overflow: Tag `claude-api`
- Anthropic Discord: https://discord.gg/anthropic
- GitHub Discussions: anthropic/anthropic-sdk-python

### Monitoring
- Check API status: https://status.anthropic.com/
- Review usage dashboard monthly
- Set spending alerts

---

## Environment Variables Summary

```bash
# .env.local (Development)
VITE_CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxx

# Vercel (Production)
VITE_CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxx

# Netlify (Production)
VITE_CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxx
```

---

**Last Updated**: November 2025
**Version**: 1.0
**Status**: Ready for Production ✅

For questions, refer to FEATURES_GUIDE.md or troubleshooting section above.
