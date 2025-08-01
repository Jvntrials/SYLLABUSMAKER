import React from 'react';

interface PilosDisplayProps {
  pilos: string[];
  onPiloChange: (index: number, value: string) => void;
}

export const PilosDisplay: React.FC<PilosDisplayProps> = ({ pilos, onPiloChange }) => {
  return (
    <div className="bg-white dark:bg-dark-gray p-6 md:p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-4">Program Intended Learning Outcomes (PILOs)</h2>
      <ul className="space-y-3 list-disc list-inside text-slate-600 dark:text-slate-400">
        {pilos.map((pilo, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 mt-1.5 text-electric-blue">•</span>
            <textarea
                value={pilo}
                onChange={(e) => onPiloChange(index, e.target.value)}
                className="w-full p-1 bg-transparent text-slate-800 dark:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-electric-blue rounded-md focus:ring-1 focus:ring-electric-blue focus:outline-none transition-colors"
                rows={1}
                style={{ resize: 'none', overflow: 'hidden' }}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
                onFocus={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};