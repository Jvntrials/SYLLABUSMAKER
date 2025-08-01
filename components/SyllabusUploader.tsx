import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface SyllabusUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const SyllabusUploader: React.FC<SyllabusUploaderProps> = ({ onFileUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File | null | undefined) => {
    if (file) {
      if (['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        setFileName(file.name);
        onFileUpload(file);
      } else {
        alert("Invalid file type. Please upload a .pdf, .docx, or .txt file.");
      }
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = ''; // Reset to allow re-uploading the same file
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center" onDragEnter={handleDrag}>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-1">Upload Existing Syllabus</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-4">Get a head start by uploading a .pdf, .docx, or .txt file.</p>
      
      <div 
        className={`relative p-8 border-2 border-dashed rounded-lg transition-colors ${dragActive ? 'border-electric-blue bg-blue-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'}`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleChange}
          disabled={isLoading}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <UploadIcon />
          <p className="text-slate-500 dark:text-slate-400">
            <button
              type="button"
              className="font-semibold text-electric-blue hover:underline focus:outline-none"
              onClick={onButtonClick}
              disabled={isLoading}
            >
              Click to upload
            </button>
            {' '}or drag and drop
          </p>
          {fileName && !isLoading ? (
            <p className="text-sm text-green-600 dark:text-green-400">Selected: {fileName}</p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500">PDF, DOCX, or TXT</p>
          )}
        </div>
      </div>
    </div>
  );
};
