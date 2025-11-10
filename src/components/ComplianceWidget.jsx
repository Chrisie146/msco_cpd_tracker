import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const ComplianceWidget = ({ completedActivities }) => {
  // SAICA Requirements
  const REQUIREMENTS = {
    totalHours: 20,
    verifiableHours: 10,
    ethicsHours: 2
  };

  // Calculate hours from completed activities
  const calculateHours = () => {
    let total = 0;
    let verifiable = 0;
    let ethics = 0;

    completedActivities.forEach(activity => {
      const hours = parseFloat(activity.cpdHours || activity.hours || 0);
      total += hours;

      // Check if verifiable (has isVerifiable flag or activityType is formal/verifiable)
      if (activity.isVerifiable || activity.activityType === 'verifiable' || activity.activityType === 'formal') {
        verifiable += hours;
      }

      // Check if ethics (has isEthics flag or competency contains 'ethics')
      if (activity.isEthics || 
          activity.competencyName?.toLowerCase().includes('ethics') ||
          activity.developmentArea?.toLowerCase().includes('ethics')) {
        ethics += hours;
      }
    });

    return {
      total: Math.round(total * 10) / 10,
      verifiable: Math.round(verifiable * 10) / 10,
      nonVerifiable: Math.round((total - verifiable) * 10) / 10,
      ethics: Math.round(ethics * 10) / 10
    };
  };

  const hours = calculateHours();

  // Calculate percentages
  const getPercentage = (current, required) => {
    return Math.min((current / required) * 100, 100);
  };

  // Determine status color
  const getStatusColor = (current, required) => {
    const percentage = (current / required) * 100;
    if (percentage >= 100) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  };

  // Check overall compliance
  const isCompliant = 
    hours.total >= REQUIREMENTS.totalHours &&
    hours.verifiable >= REQUIREMENTS.verifiableHours &&
    hours.ethics >= REQUIREMENTS.ethicsHours;

  const getProgressBarColor = (current, required) => {
    const status = getStatusColor(current, required);
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const ProgressBar = ({ current, required, label }) => {
    const percentage = getPercentage(current, required);
    const colorClass = getProgressBarColor(current, required);
    const status = getStatusColor(current, required);

    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-700">{label}</span>
          <span className="text-xs font-semibold text-slate-800">
            {current}/{required}h
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-600" />
          SAICA Compliance
        </h3>
        {isCompliant ? (
          <CheckCircle size={18} className="text-green-600" />
        ) : (
          <AlertCircle size={18} className="text-yellow-600" />
        )}
      </div>

      <div className="space-y-1 mb-4">
        <ProgressBar 
          current={hours.total} 
          required={REQUIREMENTS.totalHours} 
          label="Total CPD Hours" 
        />
        <ProgressBar 
          current={hours.verifiable} 
          required={REQUIREMENTS.verifiableHours} 
          label="Verifiable Hours" 
        />
        <ProgressBar 
          current={hours.ethics} 
          required={REQUIREMENTS.ethicsHours} 
          label="Ethics Hours" 
        />
      </div>

      {/* Non-verifiable hours info */}
      <div className="text-xs text-slate-600 bg-slate-50 rounded p-2 mb-3">
        <div className="flex justify-between">
          <span>Non-Verifiable:</span>
          <span className="font-medium">{hours.nonVerifiable}h / 10h max</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`text-center py-2 px-3 rounded-lg text-xs font-semibold ${
        isCompliant 
          ? 'bg-green-100 text-green-800 border border-green-300' 
          : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
      }`}>
        {isCompliant ? (
          <span>✓ Compliant for {new Date().getFullYear()}</span>
        ) : (
          <span>⚠ Needs Attention</span>
        )}
      </div>

      {/* What's needed */}
      {!isCompliant && (
        <div className="mt-3 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-700">Still needed:</p>
          {hours.total < REQUIREMENTS.totalHours && (
            <p className="text-red-600">• {REQUIREMENTS.totalHours - hours.total}h more total CPD</p>
          )}
          {hours.verifiable < REQUIREMENTS.verifiableHours && (
            <p className="text-red-600">• {REQUIREMENTS.verifiableHours - hours.verifiable}h more verifiable CPD</p>
          )}
          {hours.ethics < REQUIREMENTS.ethicsHours && (
            <p className="text-red-600">• {REQUIREMENTS.ethicsHours - hours.ethics}h more ethics CPD</p>
          )}
        </div>
      )}

      {/* CPD Year Info */}
      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          CPD Year: Jan 1 - Dec 31, {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default ComplianceWidget;
