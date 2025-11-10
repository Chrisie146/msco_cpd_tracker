import React, { useState } from 'react';
import { Sparkles, X, Upload, Loader } from 'lucide-react';
import AIService from '../services/AIService';
import { FieldError } from './ErrorDisplay';

const AIAssistant = ({ onActivityGenerated, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [adjustedData, setAdjustedData] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a document to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await AIService.analyzeDocument(file, file.type);
      setGeneratedData(data);
      setAdjustedData(data);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseActivity = () => {
    if (adjustedData && onActivityGenerated) {
      onActivityGenerated({
        activity: `${adjustedData.provider} - ${adjustedData.description}`,
        activityType: adjustedData.activityType,
        developmentArea: adjustedData.competencyAreas?.[0] || '',
        cpdHours: adjustedData.cpdHours?.toString() || '',
        provider: adjustedData.provider,
        description: adjustedData.description,
        outcome: adjustedData.outcome,
        attachments: [{ name: file.name, type: file.type }]
      });
      onClose();
    }
  };

  const updateAdjustedData = (field, value) => {
    setAdjustedData({
      ...adjustedData,
      [field]: value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-hidden" style={{ zIndex: 1001 }}>
      <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-600" size={20} />
            <h3 className="text-base font-bold text-slate-800">AI Assistant - Document Analysis</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-scroll flex-1">
          {!generatedData ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Upload a certificate, training document, or webinar confirmation. AI will analyze it and pre-fill your CPD activity form.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="ai-file-input"
                  onChange={handleFileSelect}
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  className="hidden"
                />
                <label
                  htmlFor="ai-file-input"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="text-slate-400" size={32} />
                  <span className="font-medium text-slate-700">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-slate-500">
                    JPG, PNG, GIF, WebP images up to 20MB (PDF not supported - please convert to image)
                  </span>
                </label>
              </div>

              {error && <FieldError error={error} />}

              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2 pb-2 border-b">
                <button
                  onClick={() => { setGeneratedData(null); setAdjustedData(null); setFile(null); }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 text-sm rounded-lg transition-colors"
                >
                  Analyze Another
                </button>
                <button
                  onClick={handleUseActivity}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded-lg transition-colors font-medium"
                >
                  Use This Activity
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <p className="text-xs text-green-800">✓ Document analyzed successfully</p>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Activity Type
                  </label>
                  <select
                    value={adjustedData.activityType}
                    onChange={(e) => updateAdjustedData('activityType', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="formal">Formal Learning</option>
                    <option value="informal">Informal Learning</option>
                    <option value="compulsory">Compulsory CPD</option>
                    <option value="webinar">Webinar</option>
                    <option value="conference">Conference</option>
                    <option value="reading">Reading</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={adjustedData.provider}
                    onChange={(e) => updateAdjustedData('provider', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                      CPD Hours
                    </label>
                    <input
                      type="number"
                      value={adjustedData.cpdHours}
                      onChange={(e) => updateAdjustedData('cpdHours', parseFloat(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                      Relevance
                    </label>
                    <input
                      type="text"
                      value={adjustedData.relevance}
                      readOnly
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Competency Areas
                  </label>
                  <input
                    type="text"
                    value={adjustedData.competencyAreas?.join(', ') || ''}
                    onChange={(e) => updateAdjustedData('competencyAreas', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Description
                  </label>
                  <textarea
                    value={adjustedData.description}
                    onChange={(e) => updateAdjustedData('description', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-12 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Learning Outcome
                  </label>
                  <textarea
                    value={adjustedData.outcome}
                    onChange={(e) => updateAdjustedData('outcome', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-12 resize-none"
                  />
                </div>

                {adjustedData.complianceNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <p className="text-xs text-blue-800">
                      <strong>Compliance Notes:</strong> {adjustedData.complianceNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
