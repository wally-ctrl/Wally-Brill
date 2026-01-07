import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { QuestionDetail } from './components/QuestionDetail';
import { QUESTIONS } from './constants';

const App = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const activeQuestion = QUESTIONS.find(q => q.id === selectedId) || QUESTIONS[0];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />
      <QuestionDetail question={activeQuestion} />
    </div>
  );
};

export default App;