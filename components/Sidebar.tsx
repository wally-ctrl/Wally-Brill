import React from 'react';
import { Smartphone, Terminal, Clapperboard, MapPin, Glasses, Brain } from 'lucide-react';
import { Question, Category } from '../types';
import { QUESTIONS } from '../constants';

interface SidebarProps {
  selectedId: number;
  onSelect: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedId, onSelect }) => {
  // Group questions by category
  const categories = Array.from(new Set(QUESTIONS.map(q => q.category))) as Category[];

  const getCategoryIcon = (cat: Category) => {
    switch(cat) {
      case 'NPC Traps': return <Terminal className="w-4 h-4" />;
      case 'The Letterboxd Test': return <Clapperboard className="w-4 h-4" />;
      case 'Brooklyn Reality': return <MapPin className="w-4 h-4" />;
      case 'Emotional Lore': return <Glasses className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden shrink-0">
      <div className="p-5 border-b border-slate-200 bg-violet-50">
        <h1 className="text-xl font-bold flex items-center gap-2 text-violet-700">
          <Smartphone className="w-6 h-6" />
          Vibe Check
        </h1>
        <p className="text-xs text-violet-500 mt-1 font-medium">Target: Ashley (Zillennial Creator)</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {categories.map(cat => (
          <div key={cat}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
              {getCategoryIcon(cat)}
              {cat}
            </h3>
            <div className="space-y-1">
              {QUESTIONS.filter(q => q.category === cat).map(q => (
                <button
                  key={q.id}
                  onClick={() => onSelect(q.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                    selectedId === q.id
                      ? 'bg-violet-100 text-violet-700 font-semibold shadow-sm'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="opacity-40 w-5 text-xs font-mono">{q.id.toString().padStart(2, '0')}.</span>
                  <span className="truncate">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};