import React from 'react';
import { ChecklistState, Question } from '../types';
import { PhotoUpload } from './PhotoUpload';

interface EvaluationFormProps {
  questions: Question[];
  checklist: ChecklistState;
  photos: string[];
  onChange: (id: string, value: 'SI' | 'NO') => void;
  onPhotosChange: (photos: string[]) => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ 
  questions, 
  checklist, 
  photos, 
  onChange, 
  onPhotosChange 
}) => {
  // Group questions by section
  const sections = Array.from(new Set(questions.map(q => q.section)));

  return (
    <div className="space-y-8">
      {sections.map(section => (
        <div key={section} className="border-l-4 border-indigo-600 bg-white shadow-sm rounded-r-md overflow-hidden">
          {/* Section Header */}
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
             <h3 className="font-bold text-indigo-800 text-sm uppercase">{section}</h3>
             <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Evaluación Técnica</span>
          </div>

          <div className="p-4 space-y-6">
            {questions.filter(q => q.section === section).map(q => (
              <div key={q.id} className="space-y-2">
                <div className="flex gap-2 text-slate-800 text-sm font-medium">
                   <span className="text-slate-500 min-w-[30px]">{q.id}</span>
                   <p>{q.text}</p>
                </div>
                
                {/* Reference */}
                {q.referenceArt && (
                    <div className="ml-9 text-xs text-slate-400 italic mb-2">Ref: {q.referenceArt}</div>
                )}

                {/* Radio Buttons */}
                <div className="ml-9 flex gap-4">
                  <label className={`
                    flex items-center gap-2 px-4 py-2 border rounded cursor-pointer transition-all
                    ${checklist[q.id] === 'SI' 
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}
                  `}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      className="accent-emerald-600"
                      checked={checklist[q.id] === 'SI'}
                      onChange={() => onChange(q.id, 'SI')}
                    />
                    <span className="font-bold text-xs">SI</span>
                  </label>

                  <label className={`
                    flex items-center gap-2 px-4 py-2 border rounded cursor-pointer transition-all
                    ${checklist[q.id] === 'NO' 
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-1 ring-rose-400' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}
                  `}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      className="accent-rose-600"
                      checked={checklist[q.id] === 'NO'}
                      onChange={() => onChange(q.id, 'NO')}
                    />
                    <span className="font-bold text-xs">NO</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <PhotoUpload photos={photos} onPhotosChange={onPhotosChange} />
    </div>
  );
};
