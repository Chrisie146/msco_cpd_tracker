import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, File, Eye, Calendar, BookOpen, CheckCircle, Download, Sparkles, Loader, Save, X } from 'lucide-react';
import { FieldError } from './ErrorDisplay';
import FileService from '../services/FileService';

const ReflectionPhase = ({ completedActivities, setCompletedActivities, learningNeeds }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    activity: '',
    activityType: 'formal',
    developmentArea: '',
    outcome: '',
    provider: '',
    description: '',
    cpdHours: '',
    isVerifiable: true,
    isEthics: false,
    attachments: []
  });
  const [errors, setErrors] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [reflectionData, setReflectionData] = useState({
    reflection: '',
    futureLearning: ''
  });
  const [aiGeneratingReflection, setAiGeneratingReflection] = useState(false);
  const [aiGeneratingFuture, setAiGeneratingFuture] = useState(false);

  const activityTypes = {
    formal: 'Formal Learning',
    informal: 'Informal Learning',
    compulsory: 'Compulsory CPD',
    webinar: 'Webinar',
    conference: 'Conference',
    reading: 'Reading',
    other: 'Other'
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl: URL.createObjectURL(file)
    }));
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...newAttachments]
    });
  };

  const removeAttachment = (index) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.activity.trim()) {
      newErrors.activity = 'Activity name is required';
    }
    if (!formData.developmentArea.trim()) {
      newErrors.developmentArea = 'Development area is required';
    }
    if (!formData.outcome.trim()) {
      newErrors.outcome = 'Outcome/reflection is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingIndex !== null) {
      // Update existing activity
      const updated = [...completedActivities];
      updated[editingIndex] = { 
        ...completedActivities[editingIndex],
        ...formData,
        id: completedActivities[editingIndex].id,
        dateAdded: completedActivities[editingIndex].dateAdded
      };
      setCompletedActivities(updated);
      setEditingIndex(null);
    } else {
      // Add new activity
      const newActivity = {
        id: Date.now(),
        ...formData,
        dateAdded: new Date().toISOString()
      };
      setCompletedActivities([...completedActivities, newActivity]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: '',
      activity: '',
      activityType: 'formal',
      developmentArea: '',
      outcome: '',
      provider: '',
      description: '',
      cpdHours: '',
      isVerifiable: true,
      isEthics: false,
      attachments: []
    });
    setErrors({});
    setShowAddForm(false);
  };

  const startEditing = (index) => {
    setFormData(completedActivities[index]);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const deleteActivity = (index) => {
    if (confirm('Are you sure you want to delete this CPD activity?')) {
      setCompletedActivities(completedActivities.filter((_, i) => i !== index));
    }
  };

  // AI Helper Functions
  const handleAIGenerateReflection = async () => {
    if (!reflectionData.reflection.trim() && !selectedActivity?.outcome) {
      setErrors({ ...errors, reflection: 'Please add some notes or initial thoughts first' });
      return;
    }

    setAiGeneratingReflection(true);
    setErrors({});

    try {
      const prompt = `You are assisting a SAICA member with their CPD reflection. Generate a professional reflection for this learning activity:

Completed Activity: ${selectedActivity.activity || 'Not specified'}
Competency Area: ${selectedActivity.developmentArea || 'Not specified'}
Current Reflection: ${reflectionData.reflection || selectedActivity.outcome || 'Not provided'}

Create a thoughtful reflection (3-4 sentences) that covers:
1. What was learned and how it applies to professional practice
2. How this learning enhances competency in the specific area
3. Future application of this knowledge
4. Alignment with SAICA professional development requirements

Respond with ONLY the reflection text, no labels or explanations.`;

      // Determine API endpoint based on environment
      let apiUrl;
      if (window.location.hostname === 'localhost') {
        apiUrl = 'http://localhost:3001/api/chat';
      } else if (window.location.hostname.includes('web.app') || window.location.hostname.includes('firebase')) {
        apiUrl = 'https://us-central1-msco-cpd-tracker.cloudfunctions.net/chat';
      } else {
        throw new Error('Unable to determine API endpoint');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt
          // Uses default Haiku model for cost savings (simple text generation)
        })
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const data = await response.json();
      setReflectionData({ 
        ...reflectionData, 
        reflection: data.response.trim()
      });

    } catch (error) {
      console.error('AI reflection error:', error);
      setErrors({ ...errors, reflection: 'AI generation failed. Please try again or write manually.' });
    } finally {
      setAiGeneratingReflection(false);
    }
  };

  const handleAIGenerateFuture = async () => {
    setAiGeneratingFuture(true);
    setErrors({});

    try {
      const prompt = `You are assisting a SAICA member with their CPD planning. Based on this completed learning activity, suggest future learning opportunities:

Completed Activity: ${selectedActivity.activity || 'Not specified'}
Competency Area: ${selectedActivity.developmentArea || 'Not specified'}
Current Reflection: ${reflectionData.reflection || selectedActivity.outcome || 'Not provided'}

Suggest 2-3 specific future learning activities or areas to explore that:
1. Build on this learning
2. Deepen expertise in this competency area
3. Address emerging trends in this field
4. Align with SAICA professional development requirements

Format as a concise paragraph (3-4 sentences). Respond with ONLY the suggestions text, no labels.`;

      // Determine API endpoint based on environment
      let apiUrl;
      if (window.location.hostname === 'localhost') {
        apiUrl = 'http://localhost:3001/api/chat';
      } else if (window.location.hostname.includes('web.app') || window.location.hostname.includes('firebase')) {
        apiUrl = 'https://us-central1-msco-cpd-tracker.cloudfunctions.net/chat';
      } else {
        throw new Error('Unable to determine API endpoint');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt
          // Uses default Haiku model for cost savings (simple text generation)
        })
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const data = await response.json();
      setReflectionData({ 
        ...reflectionData, 
        futureLearning: data.response.trim()
      });

    } catch (error) {
      console.error('AI future learning error:', error);
      setErrors({ ...errors, futureLearning: 'AI generation failed. Please try again or write manually.' });
    } finally {
      setAiGeneratingFuture(false);
    }
  };

  const handleEditReflection = (activity) => {
    setSelectedActivity(activity);
    setReflectionData({
      reflection: activity.reflection || activity.outcome || '',
      futureLearning: activity.futureLearning || ''
    });
  };

  const handleSaveReflection = () => {
    if (!reflectionData.reflection.trim()) {
      setErrors({ ...errors, reflection: 'Reflection is required' });
      return;
    }

    const updatedActivities = completedActivities.map(activity => {
      if (activity.id === selectedActivity.id) {
        return {
          ...activity,
          reflection: reflectionData.reflection,
          futureLearning: reflectionData.futureLearning
        };
      }
      return activity;
    });

    setCompletedActivities(updatedActivities);
    setSelectedActivity(null);
    setReflectionData({ reflection: '', futureLearning: '' });
    setErrors({});
  };

  const handleCloseReflectionModal = () => {
    setSelectedActivity(null);
    setReflectionData({ reflection: '', futureLearning: '' });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">PHASE THREE: The Reflection Phase</h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Completed CPD Activities</h3>
            <p className="text-sm text-slate-600 mt-1">
              Record your completed learning activities with outcomes and evidence
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add CPD Activity
          </button>
        </div>

        {showAddForm && (
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-800 mb-4">
              {editingIndex !== null ? 'Edit CPD Activity' : 'Add CPD Activity'}
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date Completed *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.date ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={errors.date} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Activity Type *
                  </label>
                  <select
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(activityTypes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.activity ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="e.g., IFRS 17 Workshop, Tax Update Webinar"
                />
                <FieldError error={errors.activity} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Development Area / Competency *
                  </label>
                  <input
                    type="text"
                    value={formData.developmentArea}
                    onChange={(e) => setFormData({ ...formData, developmentArea: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.developmentArea ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Technical - IFRS, Ethics & Professionalism"
                  />
                  <FieldError error={errors.developmentArea} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CPD Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.cpdHours}
                    onChange={(e) => setFormData({ ...formData, cpdHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Provider / Institution
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., SAICA, University, Online Platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief description of the activity..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Outcome / Reflection *
                </label>
                <textarea
                  rows="3"
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.outcome ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="What did you learn? How will you apply this knowledge? Impact on your professional development..."
                />
                <FieldError error={errors.outcome} />
              </div>

              {/* SAICA Compliance Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isVerifiable}
                      onChange={(e) => setFormData({ ...formData, isVerifiable: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span>Verifiable CPD</span>
                  </label>
                  <p className="text-xs text-slate-500 ml-6">Has certificate/proof of completion</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isEthics}
                      onChange={(e) => setFormData({ ...formData, isEthics: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span>Ethics CPD</span>
                  </label>
                  <p className="text-xs text-slate-500 ml-6">Ethics-related activity</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload Evidence (Certificates, Attendance Proof, etc.)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="text-slate-400 mb-2" size={32} />
                    <span className="text-sm text-slate-600">Click to upload or drag and drop</span>
                    <span className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, DOC (max 10MB)</span>
                  </label>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div className="flex items-center gap-2">
                          <File size={16} className="text-purple-600" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-slate-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingIndex !== null ? 'Update Activity' : 'Add Activity'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List */}
        {completedActivities.length > 0 ? (
          <div className="space-y-3">
            {completedActivities.map((activity, index) => (
              <div key={activity.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-purple-600" />
                      <span className="text-sm text-slate-600">{activity.date}</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                        {activityTypes[activity.activityType]}
                      </span>
                      {activity.cpdHours && (
                        <span className="text-xs text-slate-600">• {activity.cpdHours} hours</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1">{activity.activity}</h4>
                    <p className="text-sm text-blue-600 mb-2">
                      <span className="font-medium">Competency:</span> {activity.developmentArea}
                    </p>
                    {activity.provider && (
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-medium">Provider:</span> {activity.provider}
                      </p>
                    )}
                    {activity.description && (
                      <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                    )}
                    <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium text-green-800">Outcome:</span> {activity.outcome}
                      </p>
                    </div>
                    {activity.attachments && activity.attachments.length > 0 && (
                      <div className="mt-3 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Evidence Files:</p>
                        {activity.attachments.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <div className="flex items-center gap-2 min-w-0">
                              <File size={14} className="text-purple-600 shrink-0" />
                              <span className="text-xs text-slate-700 truncate">{file.name}</span>
                              <span className="text-xs text-slate-500 shrink-0">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() => FileService.downloadActivityEvidence(file, activity.activity)}
                              className="text-blue-500 hover:text-blue-700 p-1 shrink-0"
                              title="Download file"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditReflection(completedActivities[index])}
                      className="text-purple-500 hover:text-purple-700 p-1"
                      title="Reflect"
                    >
                      <Sparkles size={16} />
                    </button>
                    <button
                      onClick={() => startEditing(index)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteActivity(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-2">No completed CPD activities yet</p>
            <p className="text-sm">Click "Add CPD Activity" to record your learning activities</p>
          </div>
        )}
      </div>

      {/* Reflection Editing Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Reflect on Learning Activity</h3>
                <button
                  onClick={handleCloseReflectionModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">{selectedActivity.activity}</h4>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Type:</span> {selectedActivity.activityType} • 
                  <span className="font-medium">Hours:</span> {selectedActivity.cpdHours} • 
                  <span className="font-medium">Area:</span> {selectedActivity.developmentArea}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Professional Reflection *
                    </label>
                    <button
                      onClick={handleAIGenerateReflection}
                      disabled={aiGeneratingReflection}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {aiGeneratingReflection ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {aiGeneratingReflection ? 'Generating...' : 'AI Assist'}
                    </button>
                  </div>
                  <textarea
                    value={reflectionData.reflection}
                    onChange={(e) => setReflectionData({ ...reflectionData, reflection: e.target.value })}
                    placeholder="Reflect on what you learned, how it applies to your professional practice, and how it enhances your competencies..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.reflection ? 'border-red-300' : 'border-slate-300'
                    }`}
                    rows={6}
                  />
                  <FieldError error={errors.reflection} />
                  <p className="text-xs text-slate-500 mt-1">
                    Consider: What was learned? How does it apply to practice? What competencies were developed?
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Future Learning Opportunities
                    </label>
                    <button
                      onClick={handleAIGenerateFuture}
                      disabled={aiGeneratingFuture}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {aiGeneratingFuture ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {aiGeneratingFuture ? 'Generating...' : 'AI Suggest'}
                    </button>
                  </div>
                  <textarea
                    value={reflectionData.futureLearning}
                    onChange={(e) => setReflectionData({ ...reflectionData, futureLearning: e.target.value })}
                    placeholder="What future learning activities could build on this experience?..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.futureLearning ? 'border-red-300' : 'border-slate-300'
                    }`}
                    rows={4}
                  />
                  <FieldError error={errors.futureLearning} />
                  <p className="text-xs text-slate-500 mt-1">
                    Consider: Advanced topics, emerging trends, related competencies, or practical applications
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCloseReflectionModal}
                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReflection}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    <Save size={16} />
                    Save Reflection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionPhase;