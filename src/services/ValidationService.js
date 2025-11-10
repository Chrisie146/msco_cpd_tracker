class ValidationService {
  static validateCPDActivity(formData) {
    const errors = {};
    
    // Required field validation
    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const activityDate = new Date(formData.date);
      const today = new Date();
      
      // Check if date is in the future
      if (activityDate > today) {
        errors.date = 'CPD activity date cannot be in the future';
      }
      
      // Check if date is too old (more than 5 years)
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(today.getFullYear() - 5);
      if (activityDate < fiveYearsAgo) {
        errors.date = 'CPD activity date should not be more than 5 years old';
      }
    }
    
    if (!formData.activity || formData.activity.trim().length === 0) {
      errors.activity = 'Activity name is required';
    } else if (formData.activity.trim().length < 3) {
      errors.activity = 'Activity name must be at least 3 characters';
    } else if (formData.activity.trim().length > 100) {
      errors.activity = 'Activity name must be less than 100 characters';
    }
    
    if (!formData.activityType) {
      errors.activityType = 'Activity type is required';
    }
    
    // Optional but recommended fields
    if (formData.developmentArea && formData.developmentArea.length > 50) {
      errors.developmentArea = 'Development area must be less than 50 characters';
    }
    
    if (formData.outcome && formData.outcome.length < 10) {
      errors.outcome = 'Learning outcome should be at least 10 characters for meaningful reflection';
    }
    
    if (formData.outcome && formData.outcome.length > 1000) {
      errors.outcome = 'Learning outcome must be less than 1000 characters';
    }
    
    if (formData.provider && formData.provider.length > 100) {
      errors.provider = 'Provider name must be less than 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  static validateUserInfo(userInfo) {
    const errors = {};
    
    if (!userInfo.name || userInfo.name.trim().length === 0) {
      errors.name = 'Full name is required';
    } else if (userInfo.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (userInfo.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }
    
    if (!userInfo.membershipNumber || userInfo.membershipNumber.trim().length === 0) {
      errors.membershipNumber = 'SAICA membership number is required';
    } else {
      // Basic SAICA membership number format validation
      const membershipPattern = /^[A-Z0-9]{6,12}$/i;
      if (!membershipPattern.test(userInfo.membershipNumber.trim())) {
        errors.membershipNumber = 'Please enter a valid SAICA membership number (6-12 alphanumeric characters)';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  static validateFileUpload(file) {
    const errors = [];
    
    // File size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      errors.push(`File "${file.name}" is too large. Maximum size is 10MB.`);
    }
    
    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File "${file.name}" is not a supported format. Please use PDF, Word, or image files.`);
    }
    
    // File name validation
    if (file.name.length > 100) {
      errors.push(`File name "${file.name}" is too long. Please use a shorter name.`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateMultipleFiles(files) {
    const allErrors = [];
    let validFiles = [];
    
    // Total files limit
    if (files.length > 10) {
      allErrors.push('Maximum 10 files can be uploaded at once.');
      return { isValid: false, errors: allErrors, validFiles: [] };
    }
    
    // Total size limit (50MB for all files combined)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 50 * 1024 * 1024; // 50MB
    
    if (totalSize > maxTotalSize) {
      allErrors.push('Total file size exceeds 50MB limit. Please select fewer or smaller files.');
      return { isValid: false, errors: allErrors, validFiles: [] };
    }
    
    // Validate each file
    files.forEach(file => {
      const validation = this.validateFileUpload(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        allErrors.push(...validation.errors);
      }
    });
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      validFiles
    };
  }
  
  static getSAICAComplianceWarnings(activities) {
    const warnings = [];
    const currentYear = new Date().getFullYear();
    const currentYearActivities = activities.filter(a => 
      new Date(a.date).getFullYear() === currentYear
    );
    
    // SAICA requires minimum CPD activities
    if (currentYearActivities.length < 5) {
      warnings.push({
        type: 'warning',
        message: `You have only ${currentYearActivities.length} CPD activities recorded for ${currentYear}. SAICA recommends regular ongoing professional development.`
      });
    }
    
    // Check for formal learning
    const formalActivities = currentYearActivities.filter(a => a.activityType === 'formal');
    if (formalActivities.length === 0) {
      warnings.push({
        type: 'info',
        message: 'Consider adding some formal learning activities (courses, qualifications) to your CPD plan.'
      });
    }
    
    // Check for learning outcomes
    const activitiesWithoutOutcomes = currentYearActivities.filter(a => !a.outcome || a.outcome.trim().length < 10);
    if (activitiesWithoutOutcomes.length > 0) {
      warnings.push({
        type: 'warning',
        message: `${activitiesWithoutOutcomes.length} activities lack detailed learning outcomes. SAICA emphasizes output-based CPD measurement.`
      });
    }
    
    // Check for evidence
    const activitiesWithoutEvidence = currentYearActivities.filter(a => !a.attachments || a.attachments.length === 0);
    if (activitiesWithoutEvidence.length > currentYearActivities.length * 0.5) {
      warnings.push({
        type: 'info',
        message: 'Consider adding evidence (certificates, materials) to support your CPD activities for compliance purposes.'
      });
    }
    
    return warnings;
  }
}

export default ValidationService;