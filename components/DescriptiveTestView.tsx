

import React, { useState, ChangeEvent, useRef, DragEvent } from 'react';
import { DescriptiveQuestion, UserAnswer } from '../types';

interface DescriptiveTestViewProps {
  question: DescriptiveQuestion;
  onSubmit: (answer: UserAnswer) => void;
}

const getWordCountGuideline = (marks: number): string => {
    if (marks <= 5) return 'approx. 50 words';
    if (marks <= 10) return 'approx. 150 words';
    return 'approx. 250 words';
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const DescriptiveTestView: React.FC<DescriptiveTestViewProps> = ({ question, onSubmit }) => {
  const [textAnswer, setTextAnswer] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setTextAnswer(event.target.value);
  }
  
  const processFile = (file: File) => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
          setError('File is too large. Please upload a file under 10MB.');
          return;
      }
      setError(null);
      setUploadedFile(file);
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          processFile(file);
      }
      // Reset the input value to allow re-uploading the same file
      if (event.target) {
          event.target.value = '';
      }
  };

  const handleSubmit = async () => {
    if (!textAnswer && !uploadedFile) {
      setError("Please provide an answer by typing or uploading a file.");
      return;
    }
    setError(null);
    
    const answer: UserAnswer = {
        text: textAnswer || undefined
    };

    if (uploadedFile) {
        answer.fileBase64 = await fileToBase64(uploadedFile);
        answer.fileName = uploadedFile.name;
    }

    onSubmit(answer);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  const removeFile = () => setUploadedFile(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto bg-black/20 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6 border-b pb-6 border-white/10">
            <div>
              <p className="text-sm font-semibold text-purple-400">TNPSC Mains - Descriptive Question</p>
              <h2 className="text-xl font-bold text-white">{question.marks} Marks</h2>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-sm font-medium text-gray-400">Suggested Length</p>
              <p className="text-lg font-bold text-gray-200">{getWordCountGuideline(question.marks)}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xl font-semibold text-white leading-relaxed">{question.questionText}</p>
          </div>
          
          <div className="space-y-4">
             <label htmlFor="text-answer" className="block text-lg font-semibold text-gray-200">Type your answer</label>
             <textarea
                id="text-answer"
                rows={10}
                value={textAnswer}
                onChange={handleTextChange}
                className="w-full p-4 bg-black/20 text-gray-200 placeholder-gray-500 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200"
                placeholder="Start writing your detailed answer here..."
             ></textarea>
          </div>

           <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="flex-shrink mx-4 text-gray-400 font-semibold">OR</span>
              <div className="flex-grow border-t border-white/20"></div>
          </div>

           <div>
            <label className="block text-lg font-semibold text-gray-200 mb-3">Upload your answer sheet (Image or PDF)</label>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,application/pdf" 
            />
            {uploadedFile ? (
                <div className="p-4 bg-black/20 rounded-lg flex items-center justify-between border border-white/20">
                    <div className="flex items-center space-x-3 overflow-hidden">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                       <span className="font-medium text-gray-300 truncate">{uploadedFile.name}</span>
                    </div>
                    <button onClick={removeFile} className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-500" aria-label="Remove file">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div 
                    onClick={triggerFileSelect}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors group ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-400'}`}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && triggerFileSelect()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 font-semibold text-gray-300">Drag & drop file here or <span className="text-purple-400">click to browse</span></p>
                    <p className="text-xs text-gray-500 mt-1">Max file size: 10MB. Supports images and PDFs.</p>
                </div>
            )}
          </div>
           
           {error && (
             <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
           )}
        </div>

        <div className="bg-black/30 px-8 py-4 border-t border-white/10">
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!textAnswer && !uploadedFile}
          >
            Submit for Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptiveTestView;