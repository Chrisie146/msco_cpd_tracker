import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const ErrorDisplay = ({ errors, type = 'error', onDismiss, className = '' }) => {
  if (!errors || (Array.isArray(errors) && errors.length === 0)) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'info':
        return <Info size={16} className="text-blue-600" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <AlertCircle size={16} className="text-red-600" />;
    }
  };

  const getStyleClasses = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const errorList = Array.isArray(errors) ? errors : Object.values(errors);

  return (
    <div className={`border rounded-lg p-3 ${getStyleClasses()} ${className}`}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          {errorList.length === 1 ? (
            <p className="text-sm font-medium">{errorList[0]}</p>
          ) : (
            <>
              <p className="text-sm font-medium mb-1">
                {type === 'error' ? 'Please fix the following issues:' : 
                 type === 'warning' ? 'Warnings:' : 
                 type === 'info' ? 'Information:' : 'Success!'}
              </p>
              <ul className="text-sm space-y-1">
                {errorList.map((error, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-xs mt-1">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const FieldError = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`flex items-center gap-1 text-red-600 text-xs mt-1 ${className}`}>
      <AlertCircle size={12} />
      <span>{error}</span>
    </div>
  );
};

export { ErrorDisplay, FieldError };
export default ErrorDisplay;