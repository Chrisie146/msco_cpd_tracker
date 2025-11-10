# SAICA CPD Tracker - Version 2.0

**Professional Continuing Professional Development tracking application** for SAICA members with AI-assisted document analysis, compliance tracking, and tax reporting.

![Version](https://img.shields.io/badge/version-2.0-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## 🎯 Key Features

### Phase 1: Planning
- Career path development
- Learning needs identification
- Competency assessment
- Goal setting (short/long-term)

### Phase 2: Action
- Activity planning
- Status tracking
- Learning needs linkage
- Progress management

### Phase 3: Reflection (NEW!)
- CPD activity recording
- Evidence/file uploads
- Learning outcome documentation
- **AI-assisted activity creation** ✨

### Phase 4: Analytics
- Compliance dashboard
- Activity type breakdown
- CPD hours tracking
- SAICA requirement status (40 hours/year)

### Additional Features ✨ V2.0
- **Extended member information** (name, SAICA #, contact, firm)
- **File download capability** for SARS audits
- **Comprehensive data export** (JSON, CSV, SARS format)
- **AI document analysis** (certificates, webinars, etc.)
- **Settings dashboard** with backup/restore
- **Professional PDF reports** with compliance metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Browser with localStorage support

### Installation

```bash
# Clone repository
git clone <repo-url>
cd msco_cpd

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Optional: Enable AI Features
```bash
# Create .env.local in project root
echo VITE_CLAUDE_API_KEY=sk-ant-your-key-here > .env.local

# Get API key from https://console.anthropic.com/
# Includes $5 free trial credits
```

---

## 📊 Data Management

### Storage
- **Type**: Browser localStorage (device-specific)
- **Persistence**: Automatic across sessions
- **Privacy**: All data stays on your device
- **Capacity**: ~5-10 MB per browser

### Export Options
| Format | Purpose | Use Case |
|--------|---------|----------|
| JSON Backup | Complete data dump | Device backup, restore |
| CSV | Spreadsheet format | Analysis, sharing |
| Evidence Manifest | File listing | Audit preparation |
| SARS JSON | Tax compliance | SARS submission |

### Backup Strategy
```bash
# Download backup
Settings → Download Backup

# Export to spreadsheet
Settings → Export to CSV

# Export for tax return
Settings → Prepare SARS Submission

# Restore from backup
Settings → Restore Backup
```

---

## 🤖 AI Assistant (Optional)

### Setup
```bash
# 1. Get Claude API key
Visit: https://console.anthropic.com/
Generate API key (free $5 credits)

# 2. Configure
Create .env.local with:
VITE_CLAUDE_API_KEY=sk-ant-your-key

# 3. Use
Go to Reflection Phase (Phase 3)
Click "AI Assistant" button
Upload certificate or webinar confirmation
AI extracts: activity type, hours, provider, competencies
Review and adjust
Click "Use This Activity" to auto-fill
```

### Supported Documents
- Training certificates
- Webinar confirmations
- Course completion letters
- Conference programs
- Event attendance proof

### Cost
- **Free trial**: $5 credits (~200-500 documents)
- **Pay-as-you-go**: $0.01-0.05 per document after trial
- **No setup fee**, cancel anytime

---

## 📱 Member Information

### Where to Enter
Click **"Member Info"** button in top navigation

### Required Fields
- First Name & Surname
- SAICA Membership Number
- Email & Phone (for contact)
- Firm/Organization Name (optional)
- Registration Number (if applicable)

### Uses
- PDF report generation
- SARS submission
- Audit documentation
- Professional correspondence

---

## 📥 File Downloads

### Download Individual Evidence
1. Go to **Reflection Phase**
2. Find completed activity
3. Click **Download** (⬇️) next to file
4. File saved to Downloads folder

### Download All Evidence
```bash
Settings → Export Evidence Manifest
(Lists all uploaded files for audit prep)
```

### SARS Compliance
```bash
Settings → Prepare SARS Submission
(Creates tax-formatted file for auditors)
```

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.2.1
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF**: jsPDF
- **Charts**: Chart.js
- **Storage**: Browser localStorage
- **AI**: Claude API (optional)

### File Structure
```
src/
├── components/
│   ├── PlanningPhase.jsx
│   ├── ActionPhase.jsx
│   ├── ReflectionPhase.jsx
│   ├── CPDAnalytics.jsx
│   ├── PhaseNavigation.jsx
│   ├── UserInfoModal.jsx
│   ├── AIAssistant.jsx
│   ├── SettingsDashboard.jsx
│   └── ErrorDisplay.jsx
├── services/
│   ├── ValidationService.js
│   ├── PDFService.js
│   ├── FileService.js
│   └── AIService.js
├── App.jsx
└── main.jsx
```

---

## 🔒 Security & Privacy

### Your Data
- ✅ Stored locally on your device
- ✅ Never sent to servers (except optional Claude API)
- ✅ No tracking or analytics
- ✅ No account required
- ✅ Complete privacy

### Claude AI (When Enabled)
- Document sent for analysis only
- No permanent storage by Claude
- Subject to Anthropic privacy policy
- API key kept confidential
- Optional feature, can be skipped

### Backups
- Export to password-protected archive
- Store offline in secure location
- Keep API key confidential
- Don't share device/browser

---

## 📊 Compliance Features

### SAICA Requirements
- Tracks 40 CPD hours/year minimum
- Monitors activity type distribution
- Stores evidence for 3-year retention
- Generates compliance reports

### Export for Audits
```bash
# Prepare for SARS audit
1. Settings → Export Evidence Manifest
2. Download all individual files
3. Settings → Prepare SARS Submission
4. Provide SARS JSON with tax return
```

### SARS Submission
```bash
Settings → Prepare SARS Submission
Creates JSON with:
- Member information
- Total activities and hours
- Compliance status (40-hour requirement)
- Activity details
- Evidence counts
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Enter member information
- [ ] Add learning needs in Planning
- [ ] Create planned activities in Action
- [ ] Record completed activities in Reflection
- [ ] Upload evidence files
- [ ] Download individual files
- [ ] View analytics dashboard
- [ ] Export PDF report
- [ ] Export to CSV
- [ ] Test backup/restore
- [ ] Try AI analysis (if configured)

### Browser Compatibility
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 📈 Future Enhancements

### Phase 3.0 (Planned)
- Cloud synchronization (Firebase/Supabase)
- Multi-device access
- Advanced AI features
- Email reminders
- Professional firm tracking

### Community Features (Roadmap)
- Mentor/reviewer approvals
- Activity templates
- Professional networks
- SAICA API integration

---

## 🐛 Troubleshooting

### Common Issues

**Q: Where is my data stored?**
A: Browser localStorage on this device only. No cloud by default.

**Q: Can I use on another device?**
A: Yes. Export backup → email/upload → import on new device.

**Q: How do I delete my data?**
A: Settings → Danger Zone → Clear All Data (irreversible).

**Q: What if I lose my device?**
A: Download regular backups to external storage.

**Q: AI Assistant not appearing?**
A: Must be in Reflection Phase (Phase 3) to see button.

**Q: File download not working?**
A: Check browser download settings, may need pop-up permission.

**Q: Storage full error?**
A: Export backup → clear data → import if needed.

### Debug Mode
```javascript
// Open browser DevTools (F12)
// Go to Application → Local Storage
// See all stored CPD data
```

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **FEATURES_GUIDE.md** | Complete user guide for all features |
| **AI_SETUP_GUIDE.md** | Technical guide for AI configuration |
| **IMPROVEMENTS_SUMMARY.md** | Overview of v2.0 changes |
| **IMPLEMENTATION_NOTES.md** | Technical implementation details |
| **README.md** | This file |

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# Add environment variable:
VITE_CLAUDE_API_KEY=sk-ant-your-key

# Deploy automatically on push
```

### Netlify
```bash
# Connect GitHub repository
# Build command: npm run build
# Publish directory: dist

# Add environment variable:
VITE_CLAUDE_API_KEY=sk-ant-your-key
```

### Local/Self-Hosted
```bash
# Build for production
npm run build

# Serve dist/ directory
npx serve dist
```

---

## 📝 License

MIT License - Feel free to use, modify, and distribute.

---

## 🤝 Support

### Resources
- **SAICA Official**: https://www.saica.co.za/CPD
- **Claude Documentation**: https://docs.anthropic.com/
- **Vite Guide**: https://vitejs.dev/
- **React Documentation**: https://react.dev/

### Issues & Feedback
- Check troubleshooting section
- Review documentation files
- Examine browser console (F12 → Console)
- Verify environment setup

---

## 📊 Version History

| Version | Date | Changes |
|---------|------|---------|
| **2.0** | Nov 2025 | AI assistant, extended member info, file downloads, data export |
| **1.0** | Oct 2025 | Four-phase SAICA CPD tracker, PDF export, file uploads |

---

## ✨ Credits

Built with:
- React for UI framework
- Vite for build tooling
- Claude AI for document analysis
- SAICA for CPD requirements guidance

---

**Status**: ✅ Production Ready
**Last Updated**: November 7, 2025
**Maintained By**: Development Team

For the complete feature list, see **FEATURES_GUIDE.md**
