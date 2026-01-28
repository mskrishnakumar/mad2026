'use client';

interface RiskDistributionChartProps {
  data: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  total: number;
}

const riskLevels = [
  { key: 'low' as const, label: 'Low Risk', color: 'bg-green-500', textColor: 'text-green-700' },
  { key: 'medium' as const, label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  { key: 'high' as const, label: 'High Risk', color: 'bg-orange-500', textColor: 'text-orange-700' },
  { key: 'critical' as const, label: 'Critical', color: 'bg-red-500', textColor: 'text-red-700' },
];

export function RiskDistributionChart({ data, total }: RiskDistributionChartProps) {
  const maxCount = Math.max(...Object.values(data), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Risk Distribution
      </h3>

      <div className="space-y-4">
        {riskLevels.map((level) => {
          const count = data[level.key];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={level.key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {level.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${level.textColor}`}>
                    {count}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${level.color}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
        <div>
          <p className="text-sm text-gray-500">Students Needing Attention</p>
          <p className="text-2xl font-bold text-gray-900">
            {data.high + data.critical}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">of total</p>
          <p className="text-lg font-semibold text-orange-600">
            {total > 0 ? (((data.high + data.critical) / total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
