'use client';

import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#4ade80', '#f87171'];

export function MatchingStats() {
  const [data, setData] = useState([
    { name: '발견 성공', value: 0 },
    { name: '발견 실패', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('https://tmc.kro.kr/api/v1/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const apiData = await response.json();
        const success = apiData.matchingSuccessRate || 0;
        const failure = 100 - success;
        setData([
          { name: '연결 성공', value: success },
          { name: '연결 실패', value: failure },
        ]);
      } catch (e) {
        setData([
          { name: '연결 성공', value: 0 },
          { name: '연결 실패', value: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-semibold">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[250px]">Loading...</div>;
  }

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
