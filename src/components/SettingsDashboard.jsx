import React, { useState } from 'react';
import { Settings, Download, Upload, Trash2, Database, X, AlertTriangle } from 'lucide-react';
import FileService from '../services/FileService';

const SettingsDashboard = ({ 
  onClose, 
  userInfo, 
  careerData, 
  learningNeeds, 
  plannedActivities, 
  completedActivities,
  onDataImported 
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [storageInfo, setStorageInfo] = useState(FileService.getStorageUsage());
  const [importError, setImportError] = useState(null);

  const handleBackupData = () => {
    const allData = {
      userInfo,
      careerData,
      learningNeeds,
      plannedActivities,
      completedActivities
    };
    FileService.exportBackup(allData);
  };

  const handleImportData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImportError(null);
      const data = await FileService.importBackup(file);
      onDataImported(data);
      alert('Data imported successfully!');
    } catch (error) {
      setImportError(error.message);
    }
  };

  const handleDownloadCSV = () => {
    FileService.exportToCSV(completedActivities, userInfo);
  };

  const handleDownloadEvidence = () => {
    FileService.downloadAllEvidence(completedActivities, userInfo);
  };

  const handleSARSSubmission = () => {
    FileService.compressActivitiesForSARS(completedActivities, userInfo);
  };

  const handleClearData = () => {
    FileService.clearAllData();
    setShowConfirmClear(false);
    window.location.reload();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4" 
      style={{ zIndex: 1001, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-3xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 1rem)', height: '95vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="text-slate-600" size={24} />
            <h3 className="text-lg font-bold text-slate-800">Settings & Data Management</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div 
          className="p-6 space-y-6 flex-1" 
          style={{ 
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Storage Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Database size={16} />
              Storage Usage
            </h4>
            <div className="space-y-1 text-sm text-slate-600">
              <p>Total Items: {storageInfo.items}</p>
              <p>Storage Used: {storageInfo.mb} MB</p>
              <p className="text-xs text-slate-500 mt-2">
                Local browser storage limit is typically 5-10 MB. Your data is stored locally on this device only.
              </p>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 mb-3">Backup & Restore</h4>
            <div className="space-y-2">
              <button
                onClick={handleBackupData}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Download Backup (JSON)
              </button>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="import-backup"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <label
                  htmlFor="import-backup"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Restore Backup
                </label>
              </div>
              {importError && (
                <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
                  {importError}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Backup contains all your CPD data. You can restore it on another device or after clearing browser data.
              </p>
            </div>
          </div>

          {/* Export for Analysis */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 mb-3">Export for Analysis</h4>
            <div className="space-y-2">
              <button
                onClick={handleDownloadCSV}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export to CSV (Spreadsheet)
              </button>
              <button
                onClick={handleDownloadEvidence}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export Evidence Manifest
              </button>
              <p className="text-xs text-slate-500 mt-2">
                CSV for analysis in Excel/Sheets. Manifest lists all uploaded evidence files for organization.
              </p>
            </div>
          </div>

          {/* Tax & Audit Compliance */}
          <div className="border rounded-lg p-4 bg-orange-50">
            <h4 className="font-semibold text-slate-800 mb-3">SAICA Compliance & Tax Reporting</h4>
            <button
              onClick={handleSARSSubmission}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={16} />
              Export Compliance Report
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Creates a JSON file with your CPD activities and compliance status for SAICA audits and tax reporting. Suitable for SARS submissions.
            </p>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-red-700">
              <AlertTriangle size={16} />
              Danger Zone
            </h4>
            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                Clear All Data
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-red-700 font-medium">
                  Are you sure? This will permanently delete all your CPD data from this device.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearData}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Yes, Delete Everything
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;
