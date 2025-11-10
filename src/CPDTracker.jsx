import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Download, Upload, File, Eye, Sparkles, User, Clock, BookOpen, FileText, Settings } from 'lucide-react';
import PlanningPhase from './components/PlanningPhase';
import ActionPhase from './components/ActionPhase';
import ReflectionPhase from './components/ReflectionPhase';
import PhaseNavigation from './components/PhaseNavigation';
import UserInfoModal from './components/UserInfoModal';
import AIAssistant from './components/AIAssistant';
import SettingsDashboard from './components/SettingsDashboard';
import ComplianceWidget from './components/ComplianceWidget';
import { ErrorDisplay, FieldError } from './components/ErrorDisplay';
import ValidationService from './services/ValidationService';
import PDFService from './services/PDFService';
import FileService from './services/FileService';

const CPDTracker = () => {
  console.log('CPDTracker component rendering...');
  const [activePhase, setActivePhase] = useState('planning');
  const [careerData, setCareerData] = useState(() => {
    const saved = localStorage.getItem('cpdCareerData');
    return saved ? JSON.parse(saved) : {};
  });
  const [learningNeeds, setLearningNeeds] = useState(() => {
    const saved = localStorage.getItem('cpdLearningNeeds');
    return saved ? JSON.parse(saved) : [];
  });
  const [plannedActivities, setPlannedActivities] = useState(() => {
    const saved = localStorage.getItem('cpdPlannedActivities');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedActivities, setCompletedActivities] = useState(() => {
    const saved = localStorage.getItem('cpdCompletedActivities');
    return saved ? JSON.parse(saved) : [];
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('cpdUserInfo');
    return saved ? JSON.parse(saved) : {};
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cpdCareerData', JSON.stringify(careerData));
  }, [careerData]);

  useEffect(() => {
    localStorage.setItem('cpdLearningNeeds', JSON.stringify(learningNeeds));
  }, [learningNeeds]);

  useEffect(() => {
    localStorage.setItem('cpdPlannedActivities', JSON.stringify(plannedActivities));
  }, [plannedActivities]);

  useEffect(() => {
    localStorage.setItem('cpdCompletedActivities', JSON.stringify(completedActivities));
  }, [completedActivities]);

  useEffect(() => {
    localStorage.setItem('cpdUserInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  const handleExportPDF = async () => {
    try {
      // Ensure latest data is used by re-reading from localStorage
      const savedCompletedActivities = localStorage.getItem('cpdCompletedActivities');
      const completedActivitiesData = savedCompletedActivities ? JSON.parse(savedCompletedActivities) : completedActivities;
      
      await PDFService.generateReport(completedActivitiesData, careerData, userInfo, learningNeeds, plannedActivities);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  const renderPhaseContent = () => {
    switch (activePhase) {
      case 'planning':
        return (
          <PlanningPhase
            careerData={careerData}
            setCareerData={setCareerData}
            learningNeeds={learningNeeds}
            setLearningNeeds={setLearningNeeds}
            completedActivities={completedActivities}
          />
        );
      case 'action':
        return (
          <ActionPhase
            plannedActivities={plannedActivities}
            setPlannedActivities={setPlannedActivities}
            completedActivities={completedActivities}
            setCompletedActivities={setCompletedActivities}
            learningNeeds={learningNeeds}
          />
        );
      case 'reflection':
        return (
          <ReflectionPhase
            completedActivities={completedActivities}
            setCompletedActivities={setCompletedActivities}
            learningNeeds={learningNeeds}
          />
        );
      default:
        return <div>Phase not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:flex-col w-80 bg-white shadow-lg border-r border-slate-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">CPD Phases</h2>
          <PhaseNavigation
            activePhase={activePhase}
            setActivePhase={setActivePhase}
            plannedActivities={plannedActivities}
            completedActivities={completedActivities}
          />

          {/* Compliance Widget */}
          <ComplianceWidget completedActivities={completedActivities} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 lg:p-6 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">SAICA CPD Tracker</h1>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                <User size={16} />
                <span className="hidden sm:inline">Member Info</span>
              </button>
              {activePhase === 'reflection' && (
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm"
                >
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">AI Assistant</span>
                </button>
              )}
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm"
              >
                <Settings size={16} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Mobile Phase Navigation */}
          <div className="lg:hidden mt-4">
            <PhaseNavigation
              activePhase={activePhase}
              setActivePhase={setActivePhase}
              plannedActivities={plannedActivities}
              completedActivities={completedActivities}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              {renderPhaseContent()}
            </div>
          </div>
        </div>

        {showUserModal && (
          <UserInfoModal
            isOpen={showUserModal}
            userInfo={userInfo}
            onSave={setUserInfo}
            onClose={() => setShowUserModal(false)}
          />
        )}

        {showAIAssistant && (
          <AIAssistant
            onActivityGenerated={(activityData) => {
              if (activePhase === 'reflection') {
                setCompletedActivities([...completedActivities, {
                  id: Date.now(),
                  ...activityData,
                  dateAdded: new Date().toISOString()
                }]);
              }
            }}
            onClose={() => setShowAIAssistant(false)}
          />
        )}

        {showSettings && (
          <SettingsDashboard
            onClose={() => setShowSettings(false)}
            userInfo={userInfo}
            careerData={careerData}
            learningNeeds={learningNeeds}
            plannedActivities={plannedActivities}
            completedActivities={completedActivities}
            onDataImported={(data) => {
              if (data.userInfo) setUserInfo(data.userInfo);
              if (data.careerData) setCareerData(data.careerData);
              if (data.learningNeeds) setLearningNeeds(data.learningNeeds);
              if (data.plannedActivities) setPlannedActivities(data.plannedActivities);
              if (data.completedActivities) setCompletedActivities(data.completedActivities);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CPDTracker;
