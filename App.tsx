import React, { useState } from 'react';
import { analyzeTextSentiment } from './services/geminiService';
import { SentimentAnalysisResult, AnalysisStatus } from './types';
import SentimentChart from './components/SentimentChart';
import PoliticalCompass from './components/PoliticalCompass';
import ExtendedPoliticalCompass from './components/ExtendedPoliticalCompass';
import { 
  Loader2, 
  Search, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  User,
  Target,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';

const ROCFlag = () => (
  <svg viewBox="0 0 240 160" className="w-8 h-8 sm:w-10 sm:h-10 shadow-sm rounded-sm">
    <rect width="240" height="160" fill="#FE0000"/>
    <rect width="120" height="80" fill="#000095"/>
    {/* Simplified White Sun */}
    <g transform="translate(60, 40) scale(0.7)">
      <circle r="17" fill="#FFF" />
      <path fill="#FFF" d="M0,-35 L5,-19 L0,-19 L-5,-19 Z" />
      <path fill="#FFF" d="M0,35 L5,19 L0,19 L-5,19 Z" />
      <path fill="#FFF" d="M35,0 L19,5 L19,0 L19,-5 Z" />
      <path fill="#FFF" d="M-35,0 L-19,5 L-19,0 L-19,-5 Z" />
      
      <path fill="#FFF" d="M24.7,-24.7 L13.4,-13.4 L16,-10 L19,-10 Z" transform="rotate(0)" />
      <path fill="#FFF" d="M24.7,24.7 L13.4,13.4 L10,16 L10,19 Z" />
      <path fill="#FFF" d="M-24.7,24.7 L-13.4,13.4 L-16,10 L-19,10 Z" />
      <path fill="#FFF" d="M-24.7,-24.7 L-13.4,-13.4 L-10,-16 L-10,-19 Z" />

      {/* Adding rays to approximate the 12-ray sun */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
         <path key={deg} fill="#FFF" d="M0,-38 L6,-22 L-6,-22 Z" transform={`rotate(${deg})`} />
      ))}
    </g>
  </svg>
);

export const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<SentimentAnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setStatus(AnalysisStatus.LOADING);
    setErrorMsg(null);
    setResult(null);
    setCopied(false);

    try {
      const data = await analyzeTextSentiment(inputText);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("无法分析文本。请检查您的 API 密钥或网络连接，然后重试。");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const copyResponse = () => {
    if (result?.suggestedResponse) {
      navigator.clipboard.writeText(result.suggestedResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 30) return 'text-emerald-500';
    if (score <= -30) return 'text-rose-500';
    return 'text-slate-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 30) return 'bg-emerald-50';
    if (score <= -30) return 'bg-rose-50';
    return 'bg-slate-50';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ROCFlag />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">political stand by <span className="text-indigo-600">FCP</span></h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block font-medium">
            由 Gemini 3 Flash 模型驱动
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">智能文本情绪分析与回复</h2>
          <p className="text-slate-600 max-w-2xl">
            粘贴评论、邮件或文章。AI 将分析情绪趋势、识别作者立场与政治倾向，并为您自动起草得体的中文回复。
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300">
          <div className="p-1">
            <textarea
              className="w-full min-h-[150px] p-6 text-slate-700 text-lg placeholder:text-slate-300 focus:outline-none resize-y bg-transparent"
              placeholder="在此处粘贴文本进行分析..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {inputText.length} 字符
            </span>
            <button
              onClick={handleAnalyze}
              disabled={status === AnalysisStatus.LOADING || inputText.length === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all transform active:scale-95 ${
                status === AnalysisStatus.LOADING || inputText.length === 0
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {status === AnalysisStatus.LOADING ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  深度分析中...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  生成分析报告
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {status === AnalysisStatus.ERROR && errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Results Dashboard - GRID LAYOUT */}
        {result && status === AnalysisStatus.SUCCESS && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Row 1: High Level Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              
              {/* Card 1: Overall Score */}
              <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                <div className={`absolute inset-0 opacity-10 ${getScoreBg(result.overallScore)}`}></div>
                <h3 className="text-slate-500 font-medium mb-2 relative z-10 text-sm uppercase tracking-wide">综合情绪得分</h3>
                <div className={`text-6xl font-black mb-2 ${getScoreColor(result.overallScore)} relative z-10`}>
                  {result.overallScore}
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getScoreBg(result.overallScore)} ${getScoreColor(result.overallScore)} relative z-10`}>
                  {result.sentimentLabel}
                </span>
              </div>

              {/* Card 2: Tone & Stance */}
              <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                   <Target className="w-32 h-32" />
                 </div>
                 
                 <div className="mb-4 relative z-10">
                   <div className="flex items-center gap-2 mb-1 text-slate-500">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wide">情绪基调</span>
                   </div>
                   <p className="text-xl font-bold text-slate-800">{result.emotionalTone}</p>
                 </div>

                 <div className="relative z-10 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wide">作者立场</span>
                   </div>
                   <p className="text-lg font-bold text-indigo-900">{result.authorStance}</p>
                   <p className="text-sm text-slate-500 mt-1 line-clamp-2">意图: {result.coreIntent}</p>
                 </div>
              </div>

              {/* Card 3: Summary (Spans 2 cols on Large screens) */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg">AI 智能摘要</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-base flex-grow">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Row 2: Political Compass (8values) & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Political Analysis (8values) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <PoliticalCompass data={result.politicalAnalysis} />
              </div>

              {/* Timeline Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">情绪波动时间轴</h3>
                      <p className="text-xs text-slate-400">情绪随时间的变化</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 积极
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 消极
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                   <SentimentChart data={result.timeline} />
                </div>
              </div>
            </div>

            {/* Row 3: Extended Political Analysis (LeftValues) */}
            <div className="grid grid-cols-1">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                  <ExtendedPoliticalCompass data={result.extendedPoliticalAnalysis} />
               </div>
            </div>

            {/* Row 4: Analysis Grid (Key Points) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Positive Points */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <h3 className="text-emerald-700 font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
                  <ThumbsUp className="w-5 h-5" />
                  积极关键点
                </h3>
                <ul className="space-y-3 relative z-10">
                  {result.positiveKeyPoints.length > 0 ? (
                    result.positiveKeyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                        <span className="text-slate-700 text-sm font-medium">{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic text-sm p-2">未检测到显著的积极点。</li>
                  )}
                </ul>
              </div>

              {/* Negative Points */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <h3 className="text-rose-700 font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
                  <ThumbsDown className="w-5 h-5" />
                  消极关键点
                </h3>
                <ul className="space-y-3 relative z-10">
                  {result.negativeKeyPoints.length > 0 ? (
                    result.negativeKeyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-rose-50/50 p-3 rounded-lg border border-rose-100/50">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                        <span className="text-slate-700 text-sm font-medium">{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic text-sm p-2">未检测到显著的消极点。</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Row 5: Suggested Response */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-sm p-1">
              <div className="bg-white/60 p-6 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">AI 建议回复</h3>
                      <p className="text-xs text-slate-500">基于情绪得分 ({result.overallScore}) 的智能拟态回复</p>
                    </div>
                  </div>
                  <button 
                    onClick={copyResponse}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制内容'}
                  </button>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed font-mono text-sm shadow-inner whitespace-pre-wrap">
                  {result.suggestedResponse}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};