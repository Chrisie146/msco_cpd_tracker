# SAICA CPD Tracker - Installation Guide for Colleagues

## Prerequisites
- **Node.js 16 or higher** (Download from https://nodejs.org/)
- **Internet connection** (required for AI features)
- **Modern web browser** (Chrome, Firefox, Edge, Safari)

## Installation Steps

### Step 1: Download the Application
- Receive the project folder from your colleague
- Extract/unzip it to a folder on your computer (e.g., `C:\SAICA_CPD` or `~/Documents/SAICA_CPD`)

### Step 2: Open Command Prompt/Terminal
**Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Navigate to the project folder: `cd C:\Path\To\SAICA_CPD`

**macOS:**
- Open Terminal app
- Navigate to the project folder: `cd /Path/To/SAICA_CPD`

### Step 3: Install Dependencies
```bash
npm install
```
*This may take 2-3 minutes to download all required packages*

### Step 4: Start the Application
```bash
npm run dev:all
```
*This starts both the frontend (React app) and backend (AI server)*

### Step 5: Open in Browser
- Open your web browser
- Go to: `http://localhost:5173`
- The SAICA CPD Tracker should now be running!

## Optional: Enable AI Features (Recommended)

### Get Claude API Key
1. Visit https://console.anthropic.com/
2. Sign up for an account (includes $5 free credits)
3. Create an API key
4. Copy the API key

### Configure API Key
1. In the project folder, create a file named `.env.local`
2. Add this line to the file:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
   ```
3. Save the file
4. Restart the application (Ctrl+C to stop, then `npm run dev:all` again)

## Troubleshooting

### "npm command not found"
- Install Node.js from https://nodejs.org/
- Restart your command prompt/terminal

### "Port 5173 already in use"
- Close other applications using port 5173
- Or use: `npm run dev:all -- --port 5174`

### AI features not working
- Check your `.env.local` file exists and has the correct API key
- Make sure you're connected to the internet
- Check the browser console (F12) for error messages

### Application won't start
- Try: `npm install` again
- Check if all files were properly extracted
- Ensure you're in the correct folder (should contain `package.json`)

## Data Storage
- All your CPD data is stored locally in your browser
- Data persists between sessions
- Each user maintains their own separate data
- Export your data regularly using the "Export PDF" button

## Getting Help
- Contact your IT department or the colleague who shared the application
- Check the browser console (F12 → Console tab) for error messages

---
**Note:** This application runs entirely on your local machine. No data is sent to external servers except for AI processing (when enabled).</content>
<parameter name="filePath">c:\Users\christopherm\msco_cpd\COLLEAGUE_INSTALLATION_GUIDE.md