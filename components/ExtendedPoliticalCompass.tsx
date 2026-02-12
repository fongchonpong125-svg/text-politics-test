import React from 'react';
import { ExtendedPoliticalAnalysis } from '../types';
import { Globe2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExtendedCompassProps {
  data: ExtendedPoliticalAnalysis;
}

const AxisRow = ({ 
  labelLeft, 
  labelRight, 
  scoreLeft, 
  scoreRight, 
  status,
  leftColor = "bg-[#d9344a]", // Pinkish Red (Revolution/Left)
  rightColor = "bg-[#02a99d]"  // Teal Green (Reform/Right)
}: { 
  labelLeft: string; 
  labelRight: string; 
  scoreLeft: number; 
  scoreRight: number; 
  status: string;
  leftColor?: string;
  rightColor?: string;
}) => {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-center mb-1 text-slate-600 font-bold text-base sm:text-lg">
        <div className="w-12 sm:w-16 text-left whitespace-nowrap">{labelLeft}</div>
        <div className="text-xs sm:text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mx-2 text-center truncate max-w-[120px]">{status}</div>
        <div className="w-12 sm:w-16 text-right whitespace-nowrap">{labelRight}</div>
      </div>
      <div className="flex h-6 sm:h-8 w-full rounded-full overflow-hidden bg-slate-200 shadow-inner">
        <div 
          className={`h-full flex items-center justify-start px-2 text-white font-bold text-xs sm:text-sm transition-all duration-1000 ${leftColor}`}
          style={{ width: `${scoreLeft}%` }}
        >
          {scoreLeft > 15 && `${scoreLeft}%`}
        </div>
        <div 
          className={`h-full flex items-center justify-end px-2 text-white font-bold text-xs sm:text-sm transition-all duration-1000 ${rightColor}`}
          style={{ width: `${scoreRight}%` }}
        >
          {scoreRight > 15 && `${scoreRight}%`}
        </div>
      </div>
    </div>
  );
};

const ExtendedPoliticalCompass: React.FC<ExtendedCompassProps> = ({ data }) => {
  const chartData = [
    { name: data.closestWorldParty, value: data.globalPercentage },
    { name: '其他', value: Math.max(0, 100 - data.globalPercentage) },
  ];

  const COLORS = ['#4f46e5', '#cbd5e1']; // Indigo-600 vs Slate-300

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full">
      <div className="text-center mb-6 border-b border-slate-200 pb-4">
        <h4 className="text-xl font-black text-slate-800 tracking-tight">深度政治光谱 (LeftValues)</h4>
        
        <div className="mt-4 flex flex-col items-center">
             <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">匹配现实政党</p>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
                 {/* Party Name & Reason */}
                 <div className="flex flex-col items-center sm:items-end flex-1">
                    <p className="text-xl font-bold text-indigo-700 bg-indigo-50 px-5 py-2 rounded-lg border border-indigo-100 shadow-sm mb-2 text-center sm:text-right">
                      {data.closestWorldParty}
                    </p>
                    <p className="text-xs text-slate-500 italic max-w-[220px] text-center sm:text-right leading-relaxed bg-white/50 p-2 rounded">
                      "{data.closestWorldPartyReason}"
                    </p>
                 </div>

                 {/* Vertical Divider (Hidden on mobile) */}
                 <div className="hidden sm:block w-px h-24 bg-slate-200"></div>

                 {/* Pie Chart Section */}
                 <div className="flex flex-col items-center sm:items-start flex-1">
                    <div className="w-28 h-28 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={45}
                                    fill="#8884d8"
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                   formatter={(value: number) => [`${value}%`, '占比']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                            <span className="text-lg font-black text-indigo-700 leading-none">{data.globalPercentage}%</span>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mt-1 pl-1">
                      <Globe2 className="w-3 h-3" /> 全球影响占比
                    </span>
                 </div>
             </div>
        </div>
      </div>

      <div className="space-y-1">
        <AxisRow 
          labelLeft="革命" labelRight="改良" 
          scoreLeft={data.revolution.leftScore} scoreRight={data.revolution.rightScore} status={data.revolution.label} 
        />
        <AxisRow 
          labelLeft="科学" labelRight="空想" 
          scoreLeft={data.scientific.leftScore} scoreRight={data.scientific.rightScore} status={data.scientific.label} 
        />
        <AxisRow 
          labelLeft="集权" labelRight="分权" 
          scoreLeft={data.central.leftScore} scoreRight={data.central.rightScore} status={data.central.label} 
        />
        <AxisRow 
          labelLeft="国际" labelRight="民族" 
          scoreLeft={data.international.leftScore} scoreRight={data.international.rightScore} status={data.international.label} 
        />
        <AxisRow 
          labelLeft="党派" labelRight="工会" 
          scoreLeft={data.party.leftScore} scoreRight={data.party.rightScore} status={data.party.label} 
        />
        <AxisRow 
          labelLeft="生产" labelRight="生态" 
          scoreLeft={data.production.leftScore} scoreRight={data.production.rightScore} status={data.production.label} 
        />
        <AxisRow 
          labelLeft="保守" labelRight="进步" 
          scoreLeft={data.conservative.leftScore} scoreRight={data.conservative.rightScore} status={data.conservative.label} 
        />
      </div>
    </div>
  );
};

export default ExtendedPoliticalCompass;