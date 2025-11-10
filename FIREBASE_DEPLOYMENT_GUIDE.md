# Firebase Deployment Guide

## Prerequisites

1. **Google Account** - Required to create Firebase project
2. **Firebase CLI** - Already installed (`firebase-tools`)
3. **Claude API Key** - Get from https://console.anthropic.com/

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Project name: `msco-cpd-tracker`
4. Accept terms and create
5. Once created, you'll see your project dashboard

## Step 2: Authenticate Firebase CLI

```bash
firebase login
```

This will open a browser window to authenticate your Google account.

## Step 3: Configure Firebase Project ID

The `.firebaserc` file already references the project. If the project ID differs, update it:

```bash
firebase use --add
```

Select your project from the list.

## Step 4: Set Up Environment Variables

Add your Claude API key to Firebase:

```bash
# For functions (backend)
firebase functions:config:set claude.key="sk-ant-your-actual-key-here"
```

Or update `functions/.env` with your actual key and then deploy.

## Step 5: Deploy to Firebase

### Option A: Deploy Everything (Recommended)

```bash
firebase deploy
```

This deploys:
- Frontend (React app) to Firebase Hosting
- Backend (Cloud Functions) for AI analysis

### Option B: Deploy Only Frontend

```bash
firebase deploy --only hosting
```

### Option C: Deploy Only Functions

```bash
firebase deploy --only functions
```

## Step 6: Get Your App URL

After deployment completes, you'll see:

```
Hosting URL: https://msco-cpd-tracker.web.app
Functions URL: https://us-central1-msco-cpd-tracker.cloudfunctions.net/analyzeDocument
```

Share the **Hosting URL** with colleagues!

## Post-Deployment

### Enable AI Features in Cloud Functions

1. Go to Firebase Console → Functions
2. Select `analyzeDocument` function
3. Click "Runtime settings"
4. Add environment variable: `VITE_CLAUDE_API_KEY` = your API key
5. Save

### Monitor Logs

```bash
firebase functions:log
```

## Troubleshooting

### "Permission denied" during deploy
- Run `firebase login` again
- Make sure you have Editor access to the Firebase project

### "Could not create Cloud Function"
- Check that you have Cloud Functions API enabled
- Go to Firebase Console → Settings → Project Settings
- Enable necessary APIs

### AI features not working
- Verify API key is set in Cloud Function environment variables
- Check function logs: `firebase functions:log`
- Ensure `.env` in `functions/` folder has the key

## Local Development

To test everything locally:

```bash
npm run dev:all
```

This runs:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## GitHub Pages Alternative

If you don't want to use Firebase:
- Frontend works on GitHub Pages (no AI features)
- AI features disabled for security

## Summary

Your colleagues can now:
1. Visit `https://msco-cpd-tracker.web.app`
2. Track CPD activities
3. Use AI document analysis (if configured)
4. Export PDFs
5. All data stays on their device

Perfect for firm-wide sharing!
