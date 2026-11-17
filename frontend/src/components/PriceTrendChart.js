import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function PriceTrendChart({ data }) {
  const chartData = data.months.map((month, index) => ({
    month: month,
    price: data.prices[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis label={{ value: 'Price (₹/kg)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          formatter={(value) => `₹${value.toFixed(2)}`}
          labelStyle={{ color: '#333' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#667eea"
          dot={{ fill: '#667eea', r: 5 }}
          activeDot={{ r: 7 }}
          name="Average Price"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PriceTrendChart;
