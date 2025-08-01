import React from 'react';
import type { SyllabusWeek } from '../types';

interface SyllabusTableProps {
  syllabus: SyllabusWeek[];
  onSyllabusChange: (index: number, field: keyof SyllabusWeek, value: string | number) => void;
}

const ResizableTextarea: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ value, onChange }) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            className="w-full p-2 bg-transparent text-sm text-slate-800 dark:text-slate-200 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-electric-blue rounded-md focus:ring-1 focus:ring-electric-blue focus:outline-none transition-colors"
            rows={1}
        />
    );
};

export const SyllabusTable: React.FC<SyllabusTableProps> = ({ syllabus, onSyllabusChange }) => {
  const columnConfig: { key: keyof SyllabusWeek; label: string }[] = [
    { key: 'week', label: 'Week' },
    { key: 'content', label: 'Content' },
    { key: 'ilo', label: 'Intended Learning Outcomes (ILO)' },
    { key: 'ats', label: 'Assessment Tasks (ATs)' },
    { key: 'tlas', label: 'Teaching/Learning Activities (TLAs)' },
    { key: 'synchronous', label: 'Synchronous' },
    { key: 'asynchronous', label: 'Asynchronous' },
    { key: 'ltsm', label: 'Support Materials (LTSM)' },
    { key: 'outputMaterials', label: 'Output Materials' },
  ];

  const handleInputChange = (index: number, field: keyof SyllabusWeek, value: string) => {
    onSyllabusChange(index, field, value);
  };
  
  const thBaseClass = "px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider";

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-900">
          <tr>
            <th scope="col" rowSpan={2} className={`${thBaseClass} align-middle`} style={{ minWidth: '60px' }}>Week</th>
            <th scope="col" rowSpan={2} className={`${thBaseClass} align-middle`} style={{ minWidth: '200px' }}>Content</th>
            <th scope="col" rowSpan={2} className={`${thBaseClass} align-middle`} style={{ minWidth: '200px' }}>Intended Learning Outcomes (ILO)</th>
            <th scope="col" rowSpan={2} className={`${thBaseClass} align-middle`} style={{ minWidth: '200px' }}>Assessment Tasks (ATs)</th>
            <th scope="col" rowSpan={2} className={`${thBaseClass} align-middle`} style={{ minWidth: '200px' }}>Teaching/Learning Activities (TLAs)</th>
            <th scope="colgroup" colSpan={2} className={`${thBaseClass} text-center`}>Methodology</th>
            <th scope="col" rowSpan={2} className={`${thBaseClass} align-middle`} style={{ minWidth: '200px' }}>Support Materials (LTSM)</th>
            <th scope="col" rowSpan={2} className={`${thBaseClass} align-middle`} style={{ minWidth: '200px' }}>Output Materials</th>
          </tr>
          <tr>
            <th scope="col" className={`${thBaseClass}`} style={{ minWidth: '200px' }}>Synchronous</th>
            <th scope="col" className={`${thBaseClass}`} style={{ minWidth: '200px' }}>Asynchronous</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {syllabus.map((weekData, index) => (
            <tr key={weekData.week} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              {columnConfig.map(header => (
                <td key={header.key} className="px-4 py-2 align-top">
                  {header.key === 'week' ? (
                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm p-2 text-center">{weekData.week}</div>
                  ) : (
                    <ResizableTextarea
                      value={weekData[header.key] as string}
                      onChange={(e) => handleInputChange(index, header.key, e.target.value)}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};