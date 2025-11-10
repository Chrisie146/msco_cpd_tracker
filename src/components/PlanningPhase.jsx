import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target, Briefcase, Calendar, ChevronDown, Sparkles, Loader } from 'lucide-react';
import { FieldError } from './ErrorDisplay';
import AIService from '../services/AIService';

const PlanningPhase = ({ careerData, setCareerData, learningNeeds, setLearningNeeds, completedActivities }) => {
  console.log('PlanningPhase rendering...', { careerData, learningNeeds, completedActivities });
  
  // SAICA Competencies Framework
  const competenciesByCategory = {
    'Professional Values and Attitudes': {
      'Ethics': ['Personal ethics', 'Business ethics', 'Professional ethics'],
      'Lifelong Learning': ['Adaptive Mind-set', 'Agility', 'Inquisitiveness', 'Self-development'],
      'Citizenship': ['Personal citizenship', 'Business citizenship', 'Professional citizenship', 'Global citizenship']
    },
    'Enabling and Future Competencies': {
      'Business Acumen': ['Business external environment', 'Business internal environment', 'Planning and organising'],
      'Digital Acumen': ['Computational thinking', 'Cyber security', 'Data analytics', 'Database management', 'Digital affinity', 'Digital familiarity', 'Digital impact', 'Digital user skills', 'Interdigital relationships'],
      'Decision-Making Acumen': ['Analytical thinking', 'Critical thinking', 'Effective decision-making', 'Entrepreneurial thinking', 'Innovative thinking', 'Integrated thinking', 'Judgement', 'Numerical reasoning', 'Problem solving', 'Professional scepticism', 'Strategic thinking', 'Sustainable mind-set', 'Value creation mind-set'],
      'Relational Acumen': ['Communication skills', 'Emotional display', 'Emotional regulation', 'Emotional resilience', 'Leadership skills', 'Managing others', 'Relationship-building skills', 'Self-management', 'Teamwork / people skills']
    },
    'Technical Competencies': {
      'Financial and Governance': ['Assurance engagements', 'Audits of historical financial statements', 'External financial decision-making', 'Financial management', 'Governance model', 'Internal financial decision-making', 'Reporting fundamentals'],
      'Business Operations': ['Automation management', 'Business processes implementation', 'Business strategy', 'Business system applications', 'Change management', 'Design and innovate', 'Investment decisions', 'Operational decision-making', 'Project implementation', 'Quality assurance', 'Resource mobilisation'],
      'Risk and Compliance': ['Laws and regulations', 'Managing uncertainty', 'Risk and asset management', 'Stakeholder management', 'Tax governance', 'Tax planning'],
      'Analysis and Review': ['New developments and protocols knowledge', 'Providing advice', 'Review, analyse and monitor']
    }
  };

  // Flatten all competencies for the form dropdown
  const allCompetencies = [];
  Object.values(competenciesByCategory).forEach(category => {
    Object.values(category).forEach(subItems => {
      subItems.forEach(item => {
        if (!allCompetencies.includes(item)) {
          allCompetencies.push(item);
        }
      });
    });
  });
  allCompetencies.sort();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    courseName: '',
    competencyId: '',
    needPrompt: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedCompetencies, setSelectedCompetencies] = useState(careerData.competenciesExpected || []);
  const [showCompetencyDropdown, setShowCompetencyDropdown] = useState(false);
  const [aiSuggestingCompetencies, setAiSuggestingCompetencies] = useState(false);
  const [showCompetencyPicker, setShowCompetencyPicker] = useState(false);
  const [aiEnhancingPrompt, setAiEnhancingPrompt] = useState(false);
  const [aiSuggestingRoleCompetencies, setAiSuggestingRoleCompetencies] = useState(false);

  const handleCareerDataChange = (field, value) => {
    setCareerData({ ...careerData, [field]: value });
  };

  const handleAISuggestCompetencies = async () => {
    if (!formData.courseName.trim()) {
      setErrors({ ...errors, courseName: 'Please enter a course name first' });
      return;
    }

    setAiSuggestingCompetencies(true);
    setErrors({});

    try {
      const prompt = `Based on this learning activity: "${formData.courseName}", suggest 3-5 relevant SAICA competencies from this list that would be developed:

${allCompetencies.join(', ')}

Respond with ONLY a JSON array of competency names, no explanation. Example: ["Analytical thinking", "Leadership skills", "Communication skills"]`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt
        })
      });

      if (!response.ok) {
        throw new Error('AI suggestion failed');
      }

      const data = await response.json();
      const suggestedCompetencies = JSON.parse(data.response);
      
      // Update competencyId with suggested competencies
      setFormData({ 
        ...formData, 
        competencyId: suggestedCompetencies.join(', ')
      });

    } catch (error) {
      console.error('AI suggestion error:', error);
      setErrors({ ...errors, competencyId: 'AI suggestion failed. Please select manually or check AI configuration.' });
    } finally {
      setAiSuggestingCompetencies(false);
    }
  };

  const handleAIEnhancePrompt = async () => {
    if (!formData.needPrompt.trim()) {
      setErrors({ ...errors, needPrompt: 'Please enter some text first to enhance' });
      return;
    }

    setAiEnhancingPrompt(true);
    setErrors({});

    try {
      const enhancementPrompt = `You are assisting a SAICA member with their CPD (Continuing Professional Development) planning. They have identified a learning need and provided a brief description of what prompted it.

Course/Activity: ${formData.courseName || 'Not specified'}
Competencies targeted: ${formData.competencyId || 'Not specified'}
Current description: "${formData.needPrompt}"

Please enhance this description by:
1. Making it more professional and clear
2. Highlighting the specific business/professional context that created this need
3. Explaining how this relates to their competency development
4. Keeping it concise (2-4 sentences)

Respond with ONLY the enhanced text, no explanations or labels.`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: enhancementPrompt
        })
      });

      if (!response.ok) {
        throw new Error('AI enhancement failed');
      }

      const data = await response.json();
      
      // Update needPrompt with enhanced text
      setFormData({ 
        ...formData, 
        needPrompt: data.response.trim()
      });

    } catch (error) {
      console.error('AI enhancement error:', error);
      setErrors({ ...errors, needPrompt: 'AI enhancement failed. Please try again or edit manually.' });
    } finally {
      setAiEnhancingPrompt(false);
    }
  };

  const handleAISuggestRoleCompetencies = async () => {
    if (!careerData.currentPosition || !careerData.currentPosition.trim()) {
      setErrors({ ...errors, competenciesExpected: 'Please enter your current position/role first' });
      return;
    }

    setAiSuggestingRoleCompetencies(true);
    setErrors({});

    try {
      const prompt = `You are a SAICA competency expert. Based on the following career information, suggest 5-8 key competencies from the SAICA competencies framework that would typically be expected for this role.

Career Information:
- Current Position/Role: ${careerData.currentPosition || 'Not specified'}
- Years in Role: ${careerData.yearsInRole || 'Not specified'}
- Industry Focus: ${careerData.industryFocus || 'Not specified'}
- Career Path/Aspirations: ${careerData.careerPath || 'Not specified'}
- Organization Type: ${careerData.organizationType || 'Not specified'}

Analyze this role and suggest the most relevant competencies that would be expected for someone in this position. Consider:
1. The technical competencies needed for this specific role
2. The professional skills required at this career level
3. The business competencies relevant to this industry/sector
4. Enabling competencies for career progression

Available SAICA competencies:
${allCompetencies.join(', ')}

Respond with ONLY a JSON array of competency names, no explanation. Example: ["Analytical thinking", "Leadership skills", "Communication skills", "Strategic thinking", "Financial management"]`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt
        })
      });

      if (!response.ok) {
        throw new Error('AI suggestion failed');
      }

      const data = await response.json();
      const suggestedCompetencies = JSON.parse(data.response);
      
      // Update selected competencies
      setSelectedCompetencies(suggestedCompetencies);
      handleCareerDataChange('competenciesExpected', suggestedCompetencies);

    } catch (error) {
      console.error('AI role competency suggestion error:', error);
      setErrors({ ...errors, competenciesExpected: 'AI suggestion failed. Please select competencies manually or check AI configuration.' });
    } finally {
      setAiSuggestingRoleCompetencies(false);
    }
  };

  const handleSubmitLearningNeed = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course/Activity name is required';
    }
    if (!formData.competencyId.trim()) {
      newErrors.competencyId = 'Competency ID is required';
    }
    if (!formData.needPrompt.trim()) {
      newErrors.needPrompt = 'Description of need is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newNeed = {
      id: Date.now(),
      ...formData,
      dateAdded: new Date().toISOString()
    };

    if (editingIndex !== null) {
      const updated = [...learningNeeds];
      updated[editingIndex] = { ...updated[editingIndex], ...formData };
      setLearningNeeds(updated);
      setEditingIndex(null);
    } else {
      setLearningNeeds([...learningNeeds, newNeed]);
    }

    setFormData({ courseName: '', competencyId: '', needPrompt: '' });
    setErrors({});
    setShowAddForm(false);
  };

  const startEditing = (index) => {
    setFormData(learningNeeds[index]);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const deleteLearningNeed = (index) => {
    if (confirm('Are you sure you want to delete this learning need?')) {
      setLearningNeeds(learningNeeds.filter((_, i) => i !== index));
    }
  };

  const cancelEdit = () => {
    setFormData({ courseName: '', competencyId: '', needPrompt: '' });
    setErrors({});
    setEditingIndex(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">PHASE ONE: The Planning Phase</h2>
        </div>

        {/* Current Roles and Responsibilities */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            Current Roles and Responsibilities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Career Path / Industry Focus
                </label>
                <textarea
                  rows="3"
                  value={careerData.careerPath}
                  onChange={(e) => handleCareerDataChange('careerPath', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your career path and industry focus..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Position Title / Role
                </label>
                <input
                  type="text"
                  value={careerData.currentPosition}
                  onChange={(e) => handleCareerDataChange('currentPosition', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Senior Accountant, Tax Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Number of Years in This Role
                </label>
                <input
                  type="number"
                  value={careerData.yearsInRole}
                  onChange={(e) => handleCareerDataChange('yearsInRole', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Years"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Competencies Expected in This Role
                  </label>
                  <button
                    type="button"
                    onClick={handleAISuggestRoleCompetencies}
                    disabled={aiSuggestingRoleCompetencies || !careerData.currentPosition}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {aiSuggestingRoleCompetencies ? (
                      <Loader size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    AI Suggest for Role
                  </button>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCompetencyDropdown(!showCompetencyDropdown)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white hover:bg-slate-50"
                  >
                    <span className="text-slate-700">
                      {selectedCompetencies.length === 0 
                        ? 'Select competencies...' 
                        : `${selectedCompetencies.length} selected`}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${showCompetencyDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCompetencyDropdown && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                      <div className="p-3 space-y-3">
                        {Object.entries(competenciesByCategory).map(([category, subcategories]) => (
                          <div key={category}>
                            <div className="font-semibold text-slate-800 text-sm px-2 py-1 bg-slate-100 rounded sticky top-0">
                              {category}
                            </div>
                            <div className="pl-2 space-y-2">
                              {Object.entries(subcategories).map(([subcategory, items]) => (
                                <div key={subcategory}>
                                  <div className="text-xs font-medium text-slate-600 px-2 py-1 mt-2">{subcategory}</div>
                                  {items.map((competency) => (
                                    <label key={competency} className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={selectedCompetencies.includes(competency)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedCompetencies([...selectedCompetencies, competency]);
                                            handleCareerDataChange('competenciesExpected', [...selectedCompetencies, competency]);
                                          } else {
                                            const updated = selectedCompetencies.filter(c => c !== competency);
                                            setSelectedCompetencies(updated);
                                            handleCareerDataChange('competenciesExpected', updated);
                                          }
                                        }}
                                        className="rounded w-4 h-4"
                                      />
                                      <span className="text-sm text-slate-700">{competency}</span>
                                    </label>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedCompetencies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCompetencies.map((comp) => (
                      <span key={comp} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {comp}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = selectedCompetencies.filter(c => c !== comp);
                            setSelectedCompetencies(updated);
                            handleCareerDataChange('competenciesExpected', updated);
                          }}
                          className="ml-1 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Short Term Goals (Next 12 months)
                </label>
                <textarea
                  rows="3"
                  value={careerData.shortTermGoals}
                  onChange={(e) => handleCareerDataChange('shortTermGoals', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Where do you see yourself in the next 12 months?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Medium to Long Term Goals (Beyond 12 months)
                </label>
                <textarea
                  rows="3"
                  value={careerData.longTermGoals}
                  onChange={(e) => handleCareerDataChange('longTermGoals', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What role do you see yourself in beyond 12 months?"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Guidance</h4>
                <p className="text-sm text-blue-800">
                  Consider your performance reviews, industry changes, the SAICA Competency Framework, 
                  and compulsory areas when planning your development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Needs Identification */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="text-green-600" size={20} />
              Competency Development Needs
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Add Learning Need
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Select competencies from the SAICA Competency Framework that align with your career path and development goals.
          </p>

          {showAddForm && (
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-slate-800 mb-4">
                {editingIndex !== null ? 'Edit Learning Need' : 'Add Learning Need'}
              </h4>
              
              <form onSubmit={handleSubmitLearningNeed} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Course Name / Learning Activity
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.courseName ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Advanced Tax Planning, Ethics Workshop"
                  />
                  <FieldError error={errors.courseName} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Competency ID / Area
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCompetencyPicker(!showCompetencyPicker)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <ChevronDown size={14} />
                        Select from list
                      </button>
                      <button
                        type="button"
                        onClick={handleAISuggestCompetencies}
                        disabled={aiSuggestingCompetencies || !formData.courseName.trim()}
                        className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {aiSuggestingCompetencies ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        AI Suggest
                      </button>
                    </div>
                  </div>

                  {showCompetencyPicker && (
                    <div className="mb-2 max-h-60 overflow-y-auto border border-slate-300 rounded-lg bg-white">
                      {Object.entries(competenciesByCategory).map(([category, subcategories]) => (
                        <div key={category} className="border-b last:border-b-0">
                          <div className="bg-slate-100 px-3 py-2 font-medium text-sm text-slate-700 sticky top-0">
                            {category}
                          </div>
                          {Object.entries(subcategories).map(([subcat, items]) => (
                            <div key={subcat} className="px-3 py-1">
                              <div className="text-xs font-medium text-slate-600 mb-1">{subcat}</div>
                              {items.map((competency) => (
                                <label key={competency} className="flex items-center gap-2 py-1 hover:bg-slate-50 cursor-pointer text-sm">
                                  <input
                                    type="checkbox"
                                    checked={formData.competencyId.includes(competency)}
                                    onChange={(e) => {
                                      const currentCompetencies = formData.competencyId.split(', ').filter(c => c.trim());
                                      if (e.target.checked) {
                                        setFormData({ ...formData, competencyId: [...currentCompetencies, competency].join(', ') });
                                      } else {
                                        const updated = currentCompetencies.filter(c => c !== competency);
                                        setFormData({ ...formData, competencyId: updated.join(', ') });
                                      }
                                    }}
                                    className="rounded text-blue-600"
                                  />
                                  <span className="text-slate-700">{competency}</span>
                                </label>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    value={formData.competencyId}
                    onChange={(e) => setFormData({ ...formData, competencyId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.competencyId ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Technical Knowledge - Taxation, Ethics & Professionalism"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter competencies manually, select from the list, or use AI to suggest based on your course name
                  </p>
                  <FieldError error={errors.competencyId} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    What Prompted This Need?
                  </label>
                  <textarea
                    rows="3"
                    value={formData.needPrompt}
                    onChange={(e) => setFormData({ ...formData, needPrompt: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.needPrompt ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Describe what prompted this learning need (performance review, industry changes, role requirements, etc.)"
                  />
                  <FieldError error={errors.needPrompt} />
                  <button
                    type="button"
                    onClick={handleAIEnhancePrompt}
                    disabled={aiEnhancingPrompt || !formData.needPrompt.trim()}
                    className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiEnhancingPrompt ? (
                      <>
                        <Loader className="animate-spin" size={16} />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {editingIndex !== null ? 'Update Need' : 'Add Need'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Learning Needs List */}
          {learningNeeds.length > 0 ? (
            <div className="space-y-3">
              {learningNeeds.map((need, index) => (
                <div key={need.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{need.courseName}</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        <span className="font-medium">Competency:</span> {need.competencyId}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        <span className="font-medium">Prompted by:</span> {need.needPrompt}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEditing(index)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteLearningNeed(index)}
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
            <div className="text-center py-8 text-slate-500">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-2">No learning needs identified yet</p>
              <p className="text-sm">Start by adding competencies you'd like to develop</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningPhase;