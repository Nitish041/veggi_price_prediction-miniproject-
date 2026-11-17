import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function SeasonalAvailabilityChart({ data }) {
  const chartData = data.seasons.map((season, index) => ({
    season: season,
    availability: data.availability[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="season"
          label={{ value: 'Season', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="availability"
          fill="#764ba2"
          name="Records Count"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SeasonalAvailabilityChart;
