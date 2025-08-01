import React from 'react';
import type { ReferenceItem } from '../types';
import { ReferencesIcon } from './icons';

interface ReferencesDisplayProps {
  references: ReferenceItem[];
}

export const ReferencesDisplay: React.FC<ReferencesDisplayProps> = ({ references }) => {
  if (!references || references.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-dark-gray p-6 md:p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <ReferencesIcon />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">Extended Readings / References</h2>
      </div>
      <ul className="space-y-5">
        {references.map((ref, index) => (
          <li key={index}>
            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-electric-blue hover:underline transition-colors">
              {ref.title}
            </a>
            <div className="pl-4 mt-1.5 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Authors:</span> {ref.authors}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Publication:</span>{' '}
                  <span className="italic">{ref.journal}</span> ({ref.year})
                </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};