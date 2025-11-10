import React, { useState } from 'react';
import { Target, Calendar, BookOpen, User } from 'lucide-react';

const PhaseNavigation = ({ activePhase, setActivePhase, plannedActivities, completedActivities }) => {
  const phases = [
    {
      id: 'planning',
      name: 'Planning Phase',
      description: 'Career goals & learning needs',
      icon: Target,
      color: 'blue'
    },
    {
      id: 'action',
      name: 'Action Phase', 
      description: 'Activity planning & tracking',
      icon: Calendar,
      color: 'green'
    },
    {
      id: 'reflection',
      name: 'Reflection Phase',
      description: 'Record completed activities',
      icon: BookOpen,
      color: 'purple'
    }
  ];

  const getColorClasses = (color, isActive) => {
    const baseClasses = isActive ? 'ring-2' : '';
    
    switch (color) {
      case 'blue':
        return `${baseClasses} ${isActive ? 'bg-blue-50 ring-blue-500 border-blue-300' : 'hover:bg-blue-50'} text-blue-700`;
      case 'green':
        return `${baseClasses} ${isActive ? 'bg-green-50 ring-green-500 border-green-300' : 'hover:bg-green-50'} text-green-700`;
      case 'purple':
        return `${baseClasses} ${isActive ? 'bg-purple-50 ring-purple-500 border-purple-300' : 'hover:bg-purple-50'} text-purple-700`;
      case 'orange':
        return `${baseClasses} ${isActive ? 'bg-orange-50 ring-orange-500 border-orange-300' : 'hover:bg-orange-50'} text-orange-700`;
      default:
        return baseClasses;
    }
  };

  return (
    <div>
      {/* Vertical layout for desktop sidebar, horizontal for mobile */}
      <div className="flex flex-col gap-3">
        {phases.map((phase) => {
          const Icon = phase.icon;
          const isActive = activePhase === phase.id;
          
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`text-left p-4 border-2 rounded-lg transition-all duration-200 w-full ${getColorClasses(phase.color, isActive)}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} />
                <span className="font-semibold text-sm lg:text-base">{phase.name}</span>
              </div>
              <p className="text-xs lg:text-sm opacity-80">{phase.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-600">
          <strong>Note:</strong> This reflective plan follows SAICA's three-phase CPD approach. 
          Complete Phase 1 (Planning) first, then move through Action and Reflection phases systematically.
        </p>
      </div>
    </div>
  );
};

export default PhaseNavigation;