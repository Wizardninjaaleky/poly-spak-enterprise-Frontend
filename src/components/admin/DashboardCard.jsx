'use client';

export default function DashboardCard({ icon, title, value, trend, color = 'blue', onClick }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-gray-600 text-sm font-medium mb-1">{title}</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          {trend && (
            <div
              className={`text-sm font-medium ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
              <span className="text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-2xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
