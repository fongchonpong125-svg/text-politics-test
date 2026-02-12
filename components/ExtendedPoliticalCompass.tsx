import React from 'react';
import { ExtendedPoliticalAnalysis } from '../types';

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
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full">
      <div className="text-center mb-6 border-b border-slate-200 pb-4">
        <h4 className="text-xl font-black text-slate-800 tracking-tight">深度政治光谱 (LeftValues)</h4>
        <div className="mt-2 flex flex-col items-center">
             <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">匹配现实政党</p>
             <p className="text-lg font-bold text-indigo-700 bg-indigo-50 px-4 py-1 rounded-lg border border-indigo-100">
               {data.closestWorldParty}
             </p>
             <p className="text-xs text-slate-500 mt-2 italic max-w-md">"{data.closestWorldPartyReason}"</p>
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