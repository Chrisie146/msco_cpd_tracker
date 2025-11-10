// File Management Service for download and export functionality

class FileService {
  static downloadFile(dataUrl, fileName) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static downloadActivityEvidence(attachment, activityName) {
    try {
      const fileName = `${activityName}_${attachment.name}`;
      this.downloadFile(attachment.dataUrl, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    }
  }

  static downloadAllEvidence(completedActivities, userInfo) {
    // Create a manifest file listing all evidence
    const manifest = {
      generatedDate: new Date().toISOString(),
      memberName: `${userInfo.firstName} ${userInfo.surname}`,
      membershipNumber: userInfo.membershipNumber,
      activities: completedActivities.map(activity => ({
        activityName: activity.activity,
        date: activity.date,
        attachmentCount: activity.attachments?.length || 0,
        attachments: activity.attachments?.map(att => ({
          name: att.name,
          size: att.size,
          type: att.type,
          dateAdded: activity.dateAdded
        })) || []
      }))
    };

    const dataStr = JSON.stringify(manifest, null, 2);
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `CPD_Evidence_Manifest_${userInfo.membershipNumber}_${new Date().getFullYear()}.json`;
    
    this.downloadFile(dataUrl, fileName);
  }

  static exportBackup(allData) {
    // Export all CPD data as JSON for backup
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: allData
    };

    const dataStr = JSON.stringify(backup, null, 2);
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `CPD_Tracker_Backup_${new Date().toISOString().split('T')[0]}.json`;
    
    this.downloadFile(dataUrl, fileName);
  }

  static importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          if (backup.version !== '1.0') {
            reject(new Error('Invalid backup version'));
          }
          resolve(backup.data);
        } catch (error) {
          reject(new Error('Invalid backup file format'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }

  static getStorageUsage() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    // Estimate in MB (rough calculation)
    const mb = (totalSize / 1024 / 1024).toFixed(2);
    return {
      bytes: totalSize,
      mb: parseFloat(mb),
      items: Object.keys(localStorage).length
    };
  }

  static clearAllData() {
    const cpdKeys = [
      'cpdCareerData',
      'cpdLearningNeeds',
      'cpdPlannedActivities',
      'cpdCompletedActivities',
      'cpdUserInfo'
    ];
    cpdKeys.forEach(key => localStorage.removeItem(key));
  }

  static exportToCSV(completedActivities, userInfo) {
    // Export activities as CSV for spreadsheet analysis
    const headers = ['Date', 'Activity', 'Type', 'Competency Area', 'Hours', 'Provider', 'Outcome', 'Evidence Files'];
    const rows = completedActivities.map(activity => [
      activity.date || '',
      activity.activity || '',
      activity.activityType || '',
      activity.developmentArea || '',
      activity.cpdHours || '',
      activity.provider || '',
      activity.outcome || '',
      activity.attachments?.length || 0
    ]);

    const csvContent = [
      `CPD Tracker Export - ${userInfo.firstName} ${userInfo.surname}`,
      `Exported: ${new Date().toLocaleDateString()}`,
      '',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const fileName = `CPD_Activities_${userInfo.membershipNumber}_${new Date().getFullYear()}.csv`;
    
    this.downloadFile(dataUrl, fileName);
  }

  static compressActivitiesForSARS(completedActivities, userInfo) {
    // Prepare data for SARS submission with proper formatting
    const submission = {
      submissionDate: new Date().toISOString(),
      taxpayerInfo: {
        name: `${userInfo.firstName} ${userInfo.surname}`,
        membershipNumber: userInfo.membershipNumber,
        firmName: userInfo.firmName
      },
      cpdSummary: {
        year: new Date().getFullYear(),
        totalActivities: completedActivities.length,
        totalHours: completedActivities.reduce((sum, a) => sum + (parseFloat(a.cpdHours) || 0), 0),
        compliant: completedActivities.reduce((sum, a) => sum + (parseFloat(a.cpdHours) || 0), 0) >= 40
      },
      activities: completedActivities.map(a => ({
        date: a.date,
        activityType: a.activityType,
        hours: a.cpdHours,
        description: a.description,
        evidence: a.attachments?.length > 0,
        provider: a.provider
      }))
    };

    const dataStr = JSON.stringify(submission, null, 2);
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `SARS_CPD_Submission_${userInfo.membershipNumber}_${new Date().getFullYear()}.json`;
    
    this.downloadFile(dataUrl, fileName);
  }
}

export default FileService;
