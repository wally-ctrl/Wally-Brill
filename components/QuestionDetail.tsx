import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal, 
  Brain, 
  RotateCcw, 
  Glasses,
  AlertCircle,
  Coffee
} from 'lucide-react';
import { Question, EvaluationResult } from '../types';
import { evaluateWithGemini, simulateResponse } from '../services/geminiService';

interface QuestionDetailProps {
  question: Question;
}

export const QuestionDetail: React.FC<QuestionDetailProps> = ({ question }) => {
  const [inputText, setInputText] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setInputText("");
    setEvaluation(null);
  }, [question.id]);

  const handleEvaluate = async () => {
    if (!inputText) return;
    setIsEvaluating(true);
    setEvaluation(null);
    const result = await evaluateWithGemini(question, inputText);
    setEvaluation(result);
    setIsEvaluating(false);
  };

  const handleSimulate = async (type: 'good' | 'bad') => {
    setIsSimulating(true);
    setInputText("Generating...");
    const sim = await simulateResponse(question, type);
    setInputText(sim);
    setIsSimulating(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      
      {/* Header Area */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span className="bg-violet-100 px-2 py-0.5 rounded text-violet-700 text-xs font-bold uppercase tracking-wide">
            {question.category}
          </span>
          <ChevronRight className="w-3 h-3" />
          <span>Test Case #{question.id}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif">{question.text}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-orange-800 font-bold mb-1 text-xs uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4" />
              The Trap
            </div>
            <p className="text-sm text-orange-900/80 leading-relaxed">{question.trapReason}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1 text-xs uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4" />
              Ashley's Logic
            </div>
            <p className="text-sm text-emerald-900/80 leading-relaxed">{question.successCriteria}</p>
          </div>
        </div>
      </div>

      {/* Interaction Area */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        
        <div className="bg-white shadow-lg shadow-slate-200/50 border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Simulation Sandbox</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSimulate('bad')}
                disabled={isSimulating}
                className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-medium shadow-sm disabled:opacity-50"
              >
                <Terminal className="w-3 h-3" />
                Generic AI
              </button>
              <button
                onClick={() => handleSimulate('good')}
                disabled={isSimulating}
                className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-medium shadow-sm disabled:opacity-50"
              >
                <Brain className="w-3 h-3" />
                Generate Ashley
              </button>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a response here, or generate one..."
            className="w-full h-40 p-5 outline-none text-slate-700 text-base leading-relaxed resize-none bg-white placeholder:text-slate-300 focus:bg-slate-50 transition-colors"
          />
        </div>

        {/* Action Bar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleEvaluate}
            disabled={!inputText || isEvaluating}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all transform
              ${!inputText || isEvaluating
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-[1.02] active:scale-[0.98] shadow-violet-200'}
            `}
          >
            {isEvaluating ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                Judging Vibe...
              </>
            ) : (
              <>
                <Glasses className="w-5 h-5" />
                Evaluate Response
              </>
            )}
          </button>
        </div>

        {/* Evaluation Results */}
        {evaluation && (
          <div className={`mt-8 border-l-4 rounded-r-xl p-6 animate-in slide-in-from-bottom-4 duration-500 shadow-sm ${
            evaluation.passed ? 'border-emerald-500 bg-emerald-50/50' : 'border-rose-500 bg-rose-50/50'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-xl font-black flex items-center gap-2 ${
                  evaluation.passed ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  {evaluation.passed ? (
                    <><CheckCircle2 className="w-6 h-6" /> SHE'S AN ICON</>
                  ) : (
                    <><AlertCircle className="w-6 h-6" /> TOTAL FLOP</>
                  )}
                </h3>
                <p className="text-sm opacity-80 mt-1 font-medium text-slate-600">
                  Character Consistency Score
                </p>
              </div>
              <div className={`text-5xl font-black opacity-20 ${evaluation.passed ? 'text-emerald-900' : 'text-rose-900'}`}>
                {evaluation.score}/5
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${evaluation.passed ? 'text-emerald-700' : 'text-rose-700'}`}>The Verdict</h4>
                <p className={`text-sm leading-relaxed ${evaluation.passed ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {evaluation.reasoning}
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500 flex items-center gap-2">
                  <Coffee className="w-3 h-3" />
                  Director's Notes
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{evaluation.critique}"
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="h-10"></div>
      </div>
    </div>
  );
};