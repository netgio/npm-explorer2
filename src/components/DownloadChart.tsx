import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ComparisonData } from '../types';

interface DownloadChartProps {
  packages: ComparisonData;
}

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#6B7280'];

function DownloadChart({ packages }: DownloadChartProps) {
  const packageNames = Object.keys(packages);
  if (packageNames.length === 0) return null;

  // Combine all download data
  const allDates = new Set<string>();
  packageNames.forEach(name => {
    packages[name].downloads.forEach(day => {
      allDates.add(day.day);
    });
  });

  const data = Array.from(allDates).sort().map(date => {
    const point: any = { date };
    packageNames.forEach(name => {
      const dayData = packages[name].downloads.find(d => d.day === date);
      point[name] = dayData?.downloads || 0;
    });
    return point;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Download Trends Comparison</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={str => format(parseISO(str), 'MMM d')}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={value => value.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Downloads']}
              labelFormatter={(value: string) => format(parseISO(value), 'MMMM d, yyyy')}
            />
            <Legend />
            {packageNames.map((name, index) => (
              <Area
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DownloadChart;