import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CPDAnalytics = ({ plannedActivities, completedActivities, careerData, learningNeeds }) => {
  const currentYear = new Date().getFullYear();

  // Filter activities for current year
  const currentYearActivities = completedActivities.filter(a =>
    new Date(a.date).getFullYear() === currentYear
  );

  // Activity type breakdown
  const activityTypeData = {
    formal: currentYearActivities.filter(a => a.activityType === 'formal').length,
    informal: currentYearActivities.filter(a => a.activityType === 'informal').length,
    compulsory: currentYearActivities.filter(a => a.activityType === 'compulsory').length,
    webinar: currentYearActivities.filter(a => a.activityType === 'webinar').length,
    conference: currentYearActivities.filter(a => a.activityType === 'conference').length,
    reading: currentYearActivities.filter(a => a.activityType === 'reading').length,
    other: currentYearActivities.filter(a => a.activityType === 'other').length,
  };

  // Competency area breakdown
  const competencyData = {};
  currentYearActivities.forEach(activity => {
    const area = activity.developmentArea || 'Other';
    competencyData[area] = (competencyData[area] || 0) + (parseFloat(activity.cpdHours) || 0);
  });

  // Monthly activity distribution
  const monthlyData = Array(12).fill(0);
  currentYearActivities.forEach(activity => {
    const month = new Date(activity.date).getMonth();
    monthlyData[month] += parseFloat(activity.cpdHours) || 0;
  });

  // Calculate totals
  const totalHours = currentYearActivities.reduce((sum, a) => sum + (parseFloat(a.cpdHours) || 0), 0);
  const totalActivities = currentYearActivities.length;
  const averageHoursPerActivity = totalActivities > 0 ? (totalHours / totalActivities).toFixed(1) : 0;

  // SAICA requirements (simplified)
  const saicaRequiredHours = 120;
  const saicaRequiredEthics = 10;
  const ethicsHours = currentYearActivities
    .filter(a => a.isEthics)
    .reduce((sum, a) => sum + (parseFloat(a.cpdHours) || 0), 0);

  const progressPercentage = Math.min((totalHours / saicaRequiredHours) * 100, 100);
  const ethicsProgressPercentage = Math.min((ethicsHours / saicaRequiredEthics) * 100, 100);

  // Chart data
  const activityTypeChartData = {
    labels: ['Formal', 'Informal', 'Compulsory', 'Webinar', 'Conference', 'Reading', 'Other'],
    datasets: [{
      data: Object.values(activityTypeData),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#6B7280'
      ],
      borderWidth: 1,
    }],
  };

  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'CPD Hours',
      data: monthlyData,
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1,
    }],
  };

  const competencyChartData = {
    labels: Object.keys(competencyData),
    datasets: [{
      label: 'Hours',
      data: Object.values(competencyData),
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderWidth: 1,
    }],
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp size={24} />
          CPD Analytics Dashboard
        </h2>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-blue-600" />
              <span className="font-semibold text-blue-800">Total Hours</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{totalHours.toFixed(1)}</div>
            <div className="text-sm text-blue-600">of {saicaRequiredHours} required</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-green-600" />
              <span className="font-semibold text-green-800">Activities</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{totalActivities}</div>
            <div className="text-sm text-green-600">completed this year</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-purple-600" />
              <span className="font-semibold text-purple-800">Average</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{averageHoursPerActivity}</div>
            <div className="text-sm text-purple-600">hours per activity</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-orange-600" />
              <span className="font-semibold text-orange-800">Ethics Hours</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">{ethicsHours.toFixed(1)}</div>
            <div className="text-sm text-orange-600">of {saicaRequiredEthics} required</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 mb-8">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-slate-700">Annual CPD Progress</span>
              <span className="text-sm text-slate-600">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-slate-700">Ethics CPD Progress</span>
              <span className="text-sm text-slate-600">{ethicsProgressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${ethicsProgressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Activity Types</h3>
            <div className="h-64">
              <Doughnut
                data={activityTypeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Distribution</h3>
            <div className="h-64">
              <Bar
                data={monthlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Competency Breakdown */}
        {Object.keys(competencyData).length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Competency Development</h3>
            <div className="h-64">
              <Bar
                data={competencyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Recent Activities Summary */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activities</h3>
          <div className="space-y-2">
            {currentYearActivities.slice(-5).reverse().map((activity, index) => (
              <div key={activity.id || index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                <div>
                  <div className="font-medium text-slate-800">{activity.activity}</div>
                  <div className="text-sm text-slate-600">
                    {activity.activityType} • {activity.cpdHours} hours • {new Date(activity.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">{activity.cpdHours}h</div>
                  {activity.isEthics && (
                    <div className="text-xs text-orange-600 font-medium">Ethics</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPDAnalytics;
  const [editingIndex, setEditingIndex] = useState(null);
