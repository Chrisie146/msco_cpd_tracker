import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { FieldError } from './ErrorDisplay';

const ActionPhase = ({ plannedActivities, setPlannedActivities, completedActivities, setCompletedActivities, learningNeeds }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // SAICA Competency Areas
  const competencyOptions = [
    'Technical Knowledge - Taxation',
    'Technical Knowledge - Audit & Assurance',
    'Technical Knowledge - Financial Reporting',
    'Technical Knowledge - Management Accounting',
    'Technical Knowledge - Accounting Practice',
    'Professional Skills - Communication',
    'Professional Skills - Leadership',
    'Professional Skills - Problem Solving',
    'Professional Skills - Time Management',
    'Business Competencies - Business Acumen',
    'Business Competencies - Strategic Thinking',
    'Business Competencies - Risk Management',
    'Ethics & Compliance - Professional Ethics',
    'Ethics & Compliance - Law & Regulation',
    'Digital Competencies - Technology',
    'Digital Competencies - Data Analytics',
    'Other'
  ];

  const [formData, setFormData] = useState({
    courseName: '',
    competencyName: '',
    activityType: 'formal',
    cpdHours: '',
    plannedDate: '',
    status: 'planned',
    certification: 'no',
    isVerifiable: true,
    isEthics: false,
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const statusOptions = {
    planned: { label: 'Planned', color: 'blue', icon: Calendar },
    inProgress: { label: 'In Progress', color: 'yellow', icon: Clock },
    completed: { label: 'Completed', color: 'green', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'red', icon: AlertCircle }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course/Activity name is required';
    }
    if (!formData.competencyName.trim()) {
      newErrors.competencyName = 'Competency name is required';
    }
    if (!formData.plannedDate) {
      newErrors.plannedDate = 'Planned date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newActivity = {
      id: Date.now(),
      ...formData,
      dateAdded: new Date().toISOString()
    };

    if (editingIndex !== null) {
      const updated = [...plannedActivities];
      updated[editingIndex] = { ...updated[editingIndex], ...formData };
      setPlannedActivities(updated);
      setEditingIndex(null);
    } else {
      setPlannedActivities([...plannedActivities, newActivity]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      courseName: '',
      competencyName: '',
      activityType: 'formal',
      cpdHours: '',
      plannedDate: '',
      status: 'planned',
      certification: 'no',
      isVerifiable: true,
      isEthics: false,
      notes: ''
    });
    setErrors({});
    setShowAddForm(false);
  };

  const startEditing = (index) => {
    setFormData(plannedActivities[index]);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const deleteActivity = (index) => {
    if (confirm('Are you sure you want to delete this planned activity?')) {
      setPlannedActivities(plannedActivities.filter((_, i) => i !== index));
    }
  };

  const moveToCompleted = (plannedActivity) => {
    // Move to completed activities with all original fields preserved
    const completedActivity = {
      ...plannedActivity,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    // Add to completedActivities
    setCompletedActivities([...completedActivities, completedActivity]);
    
    // Remove from plannedActivities
    const index = plannedActivities.findIndex(a => a.id === plannedActivity.id);
    if (index !== -1) {
      const updated = plannedActivities.filter((_, i) => i !== index);
      setPlannedActivities(updated);
    }
  };

  // Calculate statistics
  const totalPlanned = plannedActivities.length;
  const completed = plannedActivities.filter(a => a.status === 'completed').length;
  const inProgress = plannedActivities.filter(a => a.status === 'inProgress').length;
  const overdue = plannedActivities.filter(a => {
    const planned = new Date(a.plannedDate);
    const now = new Date();
    return a.status === 'planned' && planned < now;
  }).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-green-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">PHASE TWO: The Action Phase</h2>
        </div>

        <p className="text-slate-600 mb-6">
          List the CPD activities you plan to undertake in the next twelve months. 
          Link these to the development areas identified in Phase One.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalPlanned}</div>
            <div className="text-sm text-blue-900">Total Planned</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{inProgress}</div>
            <div className="text-sm text-yellow-900">In Progress</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <div className="text-sm text-green-900">Completed</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{overdue}</div>
            <div className="text-sm text-red-900">Overdue</div>
          </div>
        </div>

        {/* Add Activity Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Activity Planner</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Plan Activity
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-800 mb-4">
              {editingIndex !== null ? 'Edit Planned Activity' : 'Plan New Activity'}
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Course Name / Learning Activity *
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.courseName ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Advanced Tax Planning Workshop"
                  />
                  <FieldError error={errors.courseName} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Competency Area *
                  </label>
                  <select
                    value={formData.competencyName}
                    onChange={(e) => setFormData({ ...formData, competencyName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.competencyName ? 'border-red-300' : 'border-slate-300'
                    }`}
                  >
                    <option value="">-- Select a Competency Area --</option>
                    {competencyOptions.map((competency) => (
                      <option key={competency} value={competency}>
                        {competency}
                      </option>
                    ))}
                  </select>
                  <FieldError error={errors.competencyName} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type of Activity
                  </label>
                  <select
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="formal">Formal Learning</option>
                    <option value="informal">Informal Learning</option>
                    <option value="compulsory">Compulsory CPD</option>
                    <option value="webinar">Webinar/Online Course</option>
                    <option value="conference">Conference/Seminar</option>
                    <option value="reading">Professional Reading</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CPD Hours (if applicable)
                  </label>
                  <input
                    type="number"
                    value={formData.cpdHours}
                    onChange={(e) => setFormData({ ...formData, cpdHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Planned Date *
                  </label>
                  <input
                    type="date"
                    value={formData.plannedDate}
                    onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.plannedDate ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={errors.plannedDate} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Certification Expected
                  </label>
                  <select
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                {/* SAICA Compliance Fields */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isVerifiable}
                      onChange={(e) => setFormData({ ...formData, isVerifiable: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
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
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span>Ethics CPD</span>
                  </label>
                  <p className="text-xs text-slate-500 ml-6">Ethics-related activity</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes about this activity..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingIndex !== null ? 'Update Activity' : 'Plan Activity'}
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

        {/* Planned Activities List */}
        {plannedActivities.length > 0 ? (
          <div className="space-y-3">
            {plannedActivities.map((activity, index) => {
              const statusInfo = statusOptions[activity.status];
              const StatusIcon = statusInfo.icon;
              const isOverdue = activity.status === 'planned' && new Date(activity.plannedDate) < new Date();
              
              return (
                <div key={activity.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-800">{activity.courseName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          statusInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          statusInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                        {isOverdue && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Overdue
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Competency:</span> {activity.competencyName}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {activity.activityType}
                        </div>
                        <div>
                          <span className="font-medium">Planned Date:</span> {new Date(activity.plannedDate).toLocaleDateString()}
                        </div>
                        {activity.cpdHours && (
                          <div>
                            <span className="font-medium">Hours:</span> {activity.cpdHours}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Certification:</span> {activity.certification}
                        </div>
                      </div>
                      
                      {activity.notes && (
                        <p className="text-sm text-slate-600 mt-2">{activity.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {activity.status === 'planned' && (
                        <button
                          onClick={() => moveToCompleted(activity)}
                          className="text-green-500 hover:text-green-700 p-1"
                          title="Mark as completed and move to Phase 3"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
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
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-2">No activities planned yet</p>
            <p className="text-sm">Start planning your CPD activities for the year</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionPhase;