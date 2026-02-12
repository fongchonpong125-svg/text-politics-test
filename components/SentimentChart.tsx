import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TimelinePoint } from '../types';

interface SentimentChartProps {
  data: TimelinePoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
        <p className="text-sm font-semibold text-slate-700">{payload[0].payload.segmentSummary}</p>
        <p className={`text-sm font-bold ${score > 0 ? 'text-emerald-600' : score < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
          得分: {score}
        </p>
      </div>
    );
  }
  return null;
};

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.score));
    const dataMin = Math.min(...data.map((i) => i.score));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="segmentSummary" 
            hide={true} 
          />
          <YAxis domain={[-100, 100]} tick={{fontSize: 12, fill: '#64748b'}} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="#10b981" stopOpacity={0.8} />
              <stop offset={off} stopColor="#f43f5e" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="score"
            stroke="url(#splitColor)"
            fill="url(#splitColor)"
            strokeWidth={2}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;