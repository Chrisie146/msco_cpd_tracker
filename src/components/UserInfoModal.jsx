import React, { useState } from 'react';
import { User, X } from 'lucide-react';
import ValidationService from '../services/ValidationService';
import { FieldError } from './ErrorDisplay';

const UserInfoModal = ({ isOpen, onClose, onSave, userInfo }) => {
  const [formData, setFormData] = useState({
    firstName: userInfo.firstName || '',
    surname: userInfo.surname || '',
    email: userInfo.email || '',
    phone: userInfo.phone || '',
    membershipNumber: userInfo.membershipNumber || '',
    registrationNumber: userInfo.registrationNumber || '',
    firmName: userInfo.firmName || '',
    ...userInfo
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save immediately without validation
    setErrors({});
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4" 
      style={{ zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-lg flex flex-col"
        style={{ maxHeight: 'calc(100vh - 1rem)', height: '95vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b shrink-0">
          <h3 className="text-lg font-bold text-slate-808">Member Information</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4 px-6 pb-6 pt-4 flex-1"
          style={{ 
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="First name"
                required
              />
              <FieldError error={errors.firstName} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Surname
              </label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.surname ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Surname"
                required
              />
              <FieldError error={errors.surname} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="your.email@example.com"
            />
            <FieldError error={errors.email} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="+27 (11) 123-4567"
            />
            <FieldError error={errors.phone} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              SAICA Membership Number *
            </label>
            <input
              type="text"
              value={formData.membershipNumber}
              onChange={(e) => handleInputChange('membershipNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.membershipNumber ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="e.g., SA123456"
              required
            />
            <FieldError error={errors.membershipNumber} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Registration Number (if applicable)
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.registrationNumber ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Registration number"
            />
            <FieldError error={errors.registrationNumber} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Firm/Organization Name
            </label>
            <input
              type="text"
              value={formData.firmName}
              onChange={(e) => handleInputChange('firmName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firmName ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Your firm or organization"
            />
            <FieldError error={errors.firmName} />
          </div>

          <div className="border-t pt-4 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Save Information
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoModal;