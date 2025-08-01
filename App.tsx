import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { PilosDisplay } from './components/PilosDisplay';
import { SyllabusTable } from './components/SyllabusTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateSyllabus, parseSyllabusFromFile } from './services/geminiService';
import { exportToXLSX } from './utils/exportToXLSX';
import type { SyllabusData, SyllabusWeek, ParsedSyllabusResponse } from './types';
import { DownloadIcon } from './components/icons';
import { ReferencesDisplay } from './components/ReferencesDisplay';
import { SyllabusUploader } from './components/SyllabusUploader';

const App: React.FC = () => {
  const [subjectTitle, setSubjectTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [numWeeks, setNumWeeks] = useState<number>(12);
  const [syllabusData, setSyllabusData] = useState<SyllabusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating Syllabus...');
  const [error, setError] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('syllabusGeneratorData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSubjectTitle(parsedData.subjectTitle || '');
        setCourseDescription(parsedData.courseDescription || '');
        setNumWeeks(parsedData.numWeeks || 12);
        setSyllabusData(parsedData.syllabusData || null);
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
      localStorage.removeItem('syllabusGeneratorData');
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      subjectTitle,
      courseDescription,
      numWeeks,
      syllabusData,
    };
    localStorage.setItem('syllabusGeneratorData', JSON.stringify(dataToSave));
  }, [subjectTitle, courseDescription, numWeeks, syllabusData]);
  
  const handleGenerate = async () => {
    if (!subjectTitle || !courseDescription || numWeeks <= 0) {
      setError('Please fill in all fields.');
      return;
    }
    setLoadingMessage('Generating Syllabus...');
    setIsLoading(true);
    setError(null);
    setSyllabusData(null);

    try {
      const result = await generateSyllabus(subjectTitle, courseDescription, numWeeks);
      setSyllabusData(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate syllabus. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoadingMessage('Parsing Syllabus...');
    setIsLoading(true);
    setError(null);
    setSyllabusData(null);

    try {
        const result: ParsedSyllabusResponse = await parseSyllabusFromFile(file);
        setSubjectTitle(result.subjectTitle || '');
        setCourseDescription(result.courseDescription || '');
        setNumWeeks(result.numWeeks || 12);
        setSyllabusData({
            pilos: result.pilos || [],
            syllabus: result.syllabus || [],
            references: result.references || []
        });
    } catch (err) {
        console.error(err);
        setError('Failed to parse syllabus file. It might be corrupted or in an unsupported format.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSyllabusChange = useCallback((index: number, field: keyof SyllabusWeek, value: string | number) => {
    setSyllabusData(prevData => {
      if (!prevData) return null;
      const newSyllabus = [...prevData.syllabus];
      const updatedWeek = { ...newSyllabus[index], [field]: value };
      newSyllabus[index] = updatedWeek;
      return { ...prevData, syllabus: newSyllabus };
    });
  }, []);
  
  const handlePilosChange = useCallback((index: number, value: string) => {
    setSyllabusData(prevData => {
        if (!prevData) return null;
        const newPilos = [...prevData.pilos];
        newPilos[index] = value;
        return { ...prevData, pilos: newPilos };
    });
  }, []);

  const handleExport = () => {
    if (syllabusData) {
      exportToXLSX(syllabusData, subjectTitle);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-white">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-dark-gray p-6 md:p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
            
            {!isLoading && <SyllabusUploader onFileUpload={handleFileUpload} isLoading={isLoading} />}
            
            {!isLoading && (
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-dark-gray px-3 text-base font-medium text-slate-500 dark:text-slate-400">
                    Or fill manually
                  </span>
                </div>
              </div>
            )}

            {!isLoading && (
               <InputForm
                subjectTitle={subjectTitle}
                setSubjectTitle={setSubjectTitle}
                courseDescription={courseDescription}
                setCourseDescription={setCourseDescription}
                numWeeks={numWeeks}
                setNumWeeks={setNumWeeks}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            )}
          </div>

          {isLoading && <LoadingSpinner message={loadingMessage} />}

          {error && (
            <div className="mt-6 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {syllabusData && !isLoading && (
            <div className="mt-8 space-y-8">
              <PilosDisplay pilos={syllabusData.pilos} onPiloChange={handlePilosChange} />
              
              <div className="bg-white dark:bg-dark-gray p-6 md:p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">Weekly Syllabus</h2>
                  <button
                    onClick={handleExport}
                    className="mt-4 sm:mt-0 flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <DownloadIcon />
                    Export to .xlsx
                  </button>
                </div>
                <SyllabusTable
                  syllabus={syllabusData.syllabus}
                  onSyllabusChange={handleSyllabusChange}
                />
              </div>

              <ReferencesDisplay references={syllabusData.references} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;