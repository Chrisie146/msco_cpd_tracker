# SAICA CPD Tracker - Feature Enhancements Guide

## Overview
Your CPD Tracker has been significantly enhanced with advanced features for data management, AI-assisted activity creation, and compliance tracking.

---

## 1. **Member Personal Data Storage**

### Where to Enter Your Details
Click the **"Member Info"** button in the top right of the application.

### Data Fields
- **First Name** - Your first name
- **Surname** - Your family name
- **Email Address** - Contact email
- **Phone Number** - Contact phone
- **SAICA Membership Number** *(Required)* - Your SAICA member ID
- **Registration Number** - Professional registration if applicable
- **Firm/Organization Name** - Your employer or firm

### How Data is Stored
- **Local Storage**: All personal data is stored in your browser's local storage (localStorage)
- **Device-Specific**: Data is NOT sent to any server - it remains completely on your device
- **Persistent**: Data survives browser restarts and updates
- **Private**: Only accessible to you on this device

### Data Persistence
- Automatically saved when you click "Save Information"
- Included in all PDF exports
- Used in backup files and SARS submissions
- Can be cleared via Settings → Danger Zone

---

## 2. **File Download Capability**

### Downloading Individual Evidence Files
1. Go to **Reflection Phase** (Phase 3)
2. Find a completed CPD activity with attachments
3. Attached files are listed in a "Evidence Files" section
4. Click the **Download** (⬇️) icon next to any file
5. File downloads to your Downloads folder with a descriptive name

### File Format
Downloaded files are named as: `[ActivityName]_[OriginalFileName]`
- Example: `SAICA Advanced Tax Course_Certificate.pdf`

### Use Cases
- **SARS Submissions**: Download evidence for tax compliance
- **Audits**: Prepare supporting documentation quickly
- **Backup**: Keep local copies of important certificates
- **Sharing**: Send evidence to auditors or regulators

---

## 3. **Data Export & Import System**

### Access Settings Dashboard
Click **"Settings"** button (⚙️) in the top right

### Available Exports

#### **A. Download Backup (JSON)**
- Exports ALL your CPD data as a single JSON file
- Includes: Career data, learning needs, activities, attachments metadata, personal info
- Use for: Device backup, archiving, multi-device sync
- File name: `CPD_Tracker_Backup_[DATE].json`

#### **B. Export to CSV (Spreadsheet)**
- Converts activities to Excel/Google Sheets format
- Columns: Date, Activity, Type, Competency Area, Hours, Provider, Outcome, Evidence Files
- Use for: Analysis in Excel, sharing with mentors, reporting
- File name: `CPD_Activities_[MEMBERSHIP#]_[YEAR].csv`

#### **C. Export Evidence Manifest**
- Lists all uploaded files with metadata
- Includes: Activity names, attachment counts, file sizes, dates
- Use for: Organizing supporting documentation, SARS evidence list
- File name: `CPD_Evidence_Manifest_[MEMBERSHIP#]_[YEAR].json`

#### **D. Prepare SARS Submission File**
- Creates compliance-ready JSON for tax authorities
- Includes: Taxpayer info, CPD summary, compliance status (40-hour requirement)
- Use for: Annual tax return submissions, SARS compliance
- File name: `SARS_CPD_Submission_[MEMBERSHIP#]_[YEAR].json`

### Restore Backup
1. Click **"Restore Backup"** in Settings
2. Select a previously downloaded JSON backup file
3. Application loads all data from backup
4. Page auto-refreshes with restored data

### Storage Information
- View current storage usage (MB)
- See number of stored items
- Check remaining device storage capacity
- Browser limit: typically 5-10 MB (usually sufficient for 2-3 years of data)

---

## 4. **AI-Assisted Activity Creation (Claude Integration)**

### Setup (First Time Only)
1. **Get Claude API Key**:
   - Visit https://console.anthropic.com/
   - Create account or log in
   - Generate API key from settings
   - Keep this key confidential

2. **Configure Application**:
   - Create `.env.local` file in project root:
     ```
     VITE_CLAUDE_API_KEY=your_api_key_here
     ```
   - Restart development server (`npm run dev`)

### Using AI Assistant

#### **Access AI Assistant**
1. Go to **Reflection Phase** (Phase 3)
2. Click **"AI Assistant"** button (✨)

#### **Analyze a Document**
1. Click the upload area or drag and drop
2. Select document: PDF, image (JPG, PNG, GIF, WebP)
3. Click **"Analyze with AI"**
4. AI examines the document and extracts:
   - **Activity Type**: Formal, Informal, Compulsory, Webinar, Conference, Reading
   - **Provider**: Organization/institution name
   - **CPD Hours**: Estimated or stated hours
   - **Competency Areas**: Relevant skill areas
   - **Description**: 2-3 sentence summary
   - **Learning Outcome**: How it applies to practice
   - **Compliance Notes**: SAICA relevance assessment

#### **Review & Adjust**
- All AI-extracted fields are editable
- Review AI's analysis and make adjustments
- Compliance relevance is highlighted
- Click **"Use This Activity"** to auto-fill the activity form

#### **What AI Analyzes**
- **Certificates**: Training completion, provider, hours
- **Webinar Confirmations**: Date, topic, provider, duration
- **Course Material**: Subject matter, learning outcomes
- **Transcripts**: Educational credits, areas of study
- **Conference Programs**: Sessions attended, hours

### AI Features

#### **Activity Summary Generation**
Request AI to generate professional learning outcome summaries for existing activities

#### **Compliance Validation**
AI audits all activities for SAICA compliance:
- Analyzes activity type distribution
- Checks 40-hour annual requirement
- Identifies compliance risks
- Suggests improvement areas
- Generates audit-ready compliance report

### Cost
- Claude API is **pay-as-you-go**
- Document analysis: ~$0.01-0.05 per document
- Compliance check: ~$0.05-0.10 per audit
- Usage shown in Anthropic dashboard

### Privacy
- Documents sent only to Claude API for analysis
- Anthropic's privacy policy applies
- No documents stored on Anthropic servers
- Your API key never exposed to anyone

### Troubleshooting
- **"API key not configured"**: Add VITE_CLAUDE_API_KEY to .env.local
- **"Invalid file type"**: Use PDF, JPG, PNG, GIF, or WebP only
- **"Analysis failed"**: Check API key, document clarity, or rate limits
- **Rate Limiting**: Wait a few moments and retry

---

## 5. **Data Management Dashboard**

### Access Settings
Click **"Settings"** (⚙️) in top navigation

### Features

#### **Storage Overview**
- Current usage in MB
- Number of items stored
- Browser limit information

#### **Backup & Restore**
- One-click backup creation
- Restore from previous backups
- Recover after accidental deletion

#### **Export Options**
- CSV for spreadsheet analysis
- Evidence manifest for documentation
- SARS-formatted submission files

#### **Clear All Data**
⚠️ **Irreversible Action**
- Deletes all CPD data from device
- Backup first!
- Requires confirmation

---

## 6. **Data Storage Architecture**

### LocalStorage Keys
```javascript
{
  cpdUserInfo: { name, email, membershipNumber, etc. },
  cpdCareerData: { careerPath, competencies, goals },
  cpdLearningNeeds: [ { need1 }, { need2 }, ... ],
  cpdPlannedActivities: [ { activity1 }, { activity2 }, ... ],
  cpdCompletedActivities: [ { activity1 }, { activity2 }, ... ]
}
```

### Storage Limits
- **Local Storage**: 5-10 MB per domain
- **File Attachments**: Stored as base64 in localStorage
- **Recommended**: Backup annually to avoid hitting limits

### Data Backup Strategy
1. **Weekly**: Export CSV for record-keeping
2. **Monthly**: Download full JSON backup
3. **Quarterly**: Export SARS submission file
4. **Annually**: Archive year-end backup externally

---

## 7. **SARS Compliance Export**

### What's Included
- Member information and credentials
- Year of assessment
- Total CPD activities completed
- Total CPD hours
- 40-hour compliance status
- Activity details: dates, types, hours, descriptions

### How to Use for SARS
1. Complete your CPD activities in the Reflection Phase
2. Go to Settings
3. Click **"Prepare SARS Submission File"**
4. File contains all necessary compliance information
5. Keep file with tax return documentation

### Export Frequency
- Generate annually before tax return deadline
- Create multiple copies (backup storage)
- Share with tax practitioner if needed

---

## 8. **Complete Workflow Example**

### Scenario: Recording a Webinar Attendance

#### **Option A: Manual Entry**
1. Go to **Reflection Phase**
2. Click **"Add CPD Activity"**
3. Fill in details manually
4. Upload webinar certificate
5. Click **"Add Activity"**

#### **Option B: AI-Assisted (Recommended)**
1. Go to **Reflection Phase**
2. Click **"AI Assistant"** (✨)
3. Upload webinar attendance certificate/email
4. AI extracts: provider, hours, date, subject
5. Review and adjust if needed
6. Click **"Use This Activity"**
7. Activity auto-fills in form, ready to submit

#### **Evidence Management**
1. Click **Download** (⬇️) to keep local copy
2. Later, export CSV for tax records
3. Use Settings to prepare SARS submission

---

## 9. **Compliance Checklist**

### SAICA Requirements
- ✅ 40 CPD hours minimum annually
- ✅ At least 2 verifiable activities
- ✅ Reflection and outcomes documented
- ✅ Evidence retained for 3 years
- ✅ Member info current and accurate

### Your Tracker Helps With
- Track total hours and activity count
- Filter by activity type (formal, informal, compulsory)
- Store evidence digitally
- Generate compliance reports
- Export for audits

---

## 10. **Best Practices**

### Personal Data
- ✅ Keep email and phone current
- ✅ Update info quarterly
- ✅ Verify membership number accuracy
- ❌ Don't share your device/browser with unsecured access

### File Management
- ✅ Upload evidence immediately after activity
- ✅ Use clear, descriptive activity names
- ✅ Download important files to external storage
- ✅ Backup monthly
- ❌ Don't rely on single copy in browser

### AI Assistance
- ✅ Review AI suggestions carefully
- ✅ Edit fields for accuracy
- ✅ Use for certificates and formal documents
- ✅ Generate compliance audits monthly
- ❌ Don't submit AI summaries without review

### SARS Compliance
- ✅ Generate SARS file by December 31
- ✅ Maintain 40-hour annual requirement
- ✅ Keep evidence for 3 years minimum
- ✅ Update personal details immediately
- ❌ Don't modify historical activity records

---

## 11. **FAQ**

### Q: Where is my data stored?
**A**: Local browser storage on your device only. No cloud storage by default (optional cloud sync available).

### Q: Can I access data on another device?
**A**: Yes, export backup on one device and import on another using Settings.

### Q: How much does AI analysis cost?
**A**: Claude API is pay-as-you-go (~$0.01-0.10 per analysis). You get API credits to start.

### Q: What if I lose my device?
**A**: Download regular backups to external storage (Google Drive, OneDrive, USB).

### Q: Can auditors access this?
**A**: No. Your device is private. Share exported files only when needed for audits.

### Q: How do I delete specific activities?
**A**: Go to Reflection Phase, find activity, click Trash icon, confirm deletion.

### Q: Can I edit past activities?
**A**: Yes. Reflection Phase allows editing. Settings → Clear All Data to reset everything.

### Q: Is mobile supported?
**A**: Yes, browser on any device. Files persist if using same browser.

---

## 12. **Support & Troubleshooting**

### Common Issues

| Issue | Solution |
|-------|----------|
| Data disappeared | Check localStorage in browser dev tools (F12) |
| Files won't upload | Check file size (<10MB) and format |
| AI not working | Verify VITE_CLAUDE_API_KEY in .env.local |
| Backup won't import | Ensure JSON file is from CPD Tracker backup |
| Storage full | Export data, clear old items, import back |

### Contact & Resources
- **SAICA**: https://www.saica.co.za/CPD
- **Anthropic Claude**: https://www.anthropic.com/
- **Browser Storage Info**: Check browser settings → Privacy & Security

---

**Version**: 1.0
**Last Updated**: November 2025
**Status**: Production Ready ✅
