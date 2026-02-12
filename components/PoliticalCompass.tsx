import React from 'react';
import { PoliticalAnalysis } from '../types';

interface PoliticalCompassProps {
  data: PoliticalAnalysis;
}

const AxisRow = ({ 
  labelLeft, 
  labelRight, 
  scoreLeft, 
  scoreRight, 
  status, 
  colorLeft, 
  colorRight 
}: { 
  labelLeft: string; 
  labelRight: string; 
  scoreLeft: number; 
  scoreRight: number; 
  status: string;
  colorLeft: string;
  colorRight: string;
}) => {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-1 text-slate-600 font-bold text-lg">
        <div className="w-16 text-left">{labelLeft}</div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{status}</div>
        <div className="w-16 text-right">{labelRight}</div>
      </div>
      <div className="flex h-8 w-full rounded-full overflow-hidden bg-slate-200 shadow-inner">
        <div 
          className={`h-full flex items-center justify-start px-2 text-white font-bold text-sm transition-all duration-1000 ${colorLeft}`}
          style={{ width: `${scoreLeft}%` }}
        >
          {scoreLeft > 15 && `${scoreLeft}%`}
        </div>
        <div 
          className={`h-full flex items-center justify-end px-2 text-white font-bold text-sm transition-all duration-1000 ${colorRight}`}
          style={{ width: `${scoreRight}%` }}
        >
          {scoreRight > 15 && `${scoreRight}%`}
        </div>
      </div>
    </div>
  );
};

const PoliticalCompass: React.FC<PoliticalCompassProps> = ({ data }) => {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
      <div className="text-center mb-6">
        <h4 className="text-xl font-black text-slate-800 tracking-tight">政治价值观分析 (8values)</h4>
        <p className="text-sm text-slate-500 mt-1">
          最接近的意识形态: <span className="font-bold text-indigo-600">{data.ideology}</span>
        </p>
      </div>

      <div className="space-y-2">
        {/* Economic: Equality (Red) vs Market (Green) */}
        <AxisRow 
          labelLeft="平等" 
          labelRight="市场" 
          scoreLeft={data.economic.leftScore} 
          scoreRight={data.economic.rightScore} 
          status={data.economic.label}
          colorLeft="bg-rose-500"
          colorRight="bg-emerald-400"
        />

        {/* Diplomatic: Nation (Red) vs World (Green) */}
        <AxisRow 
          labelLeft="国家" 
          labelRight="世界" 
          scoreLeft={data.diplomatic.leftScore} 
          scoreRight={data.diplomatic.rightScore} 
          status={data.diplomatic.label}
          colorLeft="bg-rose-500"
          colorRight="bg-emerald-400"
        />

        {/* Civil: Liberty (Red) vs Authority (Green) */}
        <AxisRow 
          labelLeft="自由" 
          labelRight="威权" 
          scoreLeft={data.civil.leftScore} 
          scoreRight={data.civil.rightScore} 
          status={data.civil.label}
          colorLeft="bg-rose-500"
          colorRight="bg-emerald-400"
        />

        {/* Societal: Tradition (Red) vs Progress (Green) */}
        <AxisRow 
          labelLeft="传统" 
          labelRight="进步" 
          scoreLeft={data.societal.leftScore} 
          scoreRight={data.societal.rightScore} 
          status={data.societal.label}
          colorLeft="bg-rose-500"
          colorRight="bg-emerald-400"
        />
      </div>
    </div>
  );
};

export default PoliticalCompass;