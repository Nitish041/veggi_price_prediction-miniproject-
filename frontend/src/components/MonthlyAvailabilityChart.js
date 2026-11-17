import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function MonthlyAvailabilityChart({ data }) {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const chartData = data.months.map((month, index) => ({
    month: monthNames[month - 1],
    availability: data.availability[index],
    multiplication_factor: data.multiplication_factors[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis yAxisId="left" label={{ value: 'Availability Count', angle: -90, position: 'insideLeft' }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: 'Scarcity Factor', angle: 90, position: 'insideRight' }}
        />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="availability"
          fill="#667eea"
          name="Records Count"
          radius={[6, 6, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="multiplication_factor"
          stroke="#e74c3c"
          dot={{ fill: '#e74c3c', r: 4 }}
          name="Availability Multiplier"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default MonthlyAvailabilityChart;
