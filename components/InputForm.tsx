import React from 'react';
import { GenerateIcon } from './icons';

interface InputFormProps {
  subjectTitle: string;
  setSubjectTitle: (value: string) => void;
  courseDescription: string;
  setCourseDescription: (value: string) => void;
  numWeeks: number;
  setNumWeeks: (value: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  subjectTitle,
  setSubjectTitle,
  courseDescription,
  setCourseDescription,
  numWeeks,
  setNumWeeks,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-1">Course Details</h2>
        <p className="text-slate-500 dark:text-slate-400">Provide the course information below to generate your syllabus.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="subjectTitle" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Subject Title
          </label>
          <input
            type="text"
            id="subjectTitle"
            value={subjectTitle}
            onChange={(e) => setSubjectTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
            placeholder="e.g., Introduction to Artificial Intelligence"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="numWeeks" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Number of Weeks
          </label>
          <input
            type="number"
            id="numWeeks"
            value={numWeeks}
            onChange={(e) => setNumWeeks(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
            min="1"
            max="20"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="courseDescription" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          Course Description
        </label>
        <textarea
          id="courseDescription"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
          placeholder="Describe the main topics, goals, and objectives of the course."
          disabled={isLoading}
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isLoading || !subjectTitle || !courseDescription}
          className="flex items-center justify-center gap-2 w-full md:w-auto bg-electric-blue text-black font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 dark:focus:ring-offset-dark-gray focus:ring-opacity-75 disabled:bg-electric-blue/40 disabled:text-black/40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <GenerateIcon />
              Generate Syllabus
            </>
          )}
        </button>
      </div>
    </div>
  );
};