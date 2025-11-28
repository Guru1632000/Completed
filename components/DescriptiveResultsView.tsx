
import React from 'react';
import { DescriptiveQuestion, UserAnswer, Evaluation, ExamType } from '../types';

interface DescriptiveResultsViewProps {
  question: DescriptiveQuestion;
  answer: UserAnswer;
  evaluation: Evaluation;
  onTryAgain: () => void;
  activeExamType: ExamType;
}

const DescriptiveResultsView: React.FC<DescriptiveResultsViewProps> = ({ question, answer, evaluation, onTryAgain, activeExamType }) => {
    const scorePercentage = (evaluation.score / question.marks) * 100;
    const scoreColorClass = scorePercentage >= 75 ? 'text-green-400' : scorePercentage >= 40 ? 'text-amber-400' : 'text-red-400';

    const renderFormattedAnswer = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactElement[] = [];
        let inBox = false;
        let boxContent: string[] = [];
        let keyCounter = 0;

        const boxClasses = "my-4 p-4 bg-purple-900/50 text-purple-100 rounded-lg shadow-md border border-purple-500/30";
        const boxTextClasses = "text-purple-200 leading-relaxed";

        const renderLineWithBold = (line: string) => {
            const segments = line.split(/(\*\*.*?\*\*)/g);
            return (
                <>
                    {segments.map((segment, index) => {
                        if (segment.startsWith('**') && segment.endsWith('**')) {
                            return <strong key={index}>{segment.substring(2, segment.length - 2)}</strong>;
                        }
                        return segment;
                    })}
                </>
            );
        };

        lines.forEach(line => {
            keyCounter++;

            if (line.trim().toUpperCase() === '[BOX]') {
                inBox = true;
                return;
            }

            if (line.trim().toUpperCase() === '[/BOX]') {
                inBox = false;
                if (boxContent.length > 0) {
                    elements.push(
                        <div key={`box-${keyCounter}`} className={boxClasses}>
                            {boxContent.map((boxLine, index) => (
                                <p key={index} className={boxTextClasses}>
                                    {renderLineWithBold(boxLine)}
                                </p>
                            ))}
                        </div>
                    );
                }
                boxContent = [];
                return;
            }

            if (inBox) {
                boxContent.push(line);
                return;
            }

            if (line.startsWith('## ')) {
                elements.push(
                    <h4 key={`h4-${keyCounter}`} className="text-lg font-bold text-white mt-6 mb-2">
                        {renderLineWithBold(line.substring(3))}
                    </h4>
                );
            } else if (line.trim() !== '') {
                elements.push(
                    <p key={`p-${keyCounter}`} className="text-gray-300 my-2 leading-relaxed">
                        {renderLineWithBold(line)}
                    </p>
                );
            }
        });
        
        if (boxContent.length > 0) {
             elements.push(
                <div key={`box-final-${keyCounter}`} className={boxClasses}>
                    {boxContent.map((boxLine, index) => (
                        <p key={index} className={boxTextClasses}>
                            {renderLineWithBold(boxLine)}
                        </p>
                    ))}
                </div>
            );
        }

        return elements;
    };


    return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/20 p-6 md:p-8 rounded-2xl shadow-xl border border-white/10 mb-8">
            <h2 className="text-3xl font-extrabold text-white text-center">Evaluation Complete!</h2>
            <p className="mt-2 text-gray-400 text-center">Here's the AI examiner's feedback on your answer.</p>
            <div className="mt-8 text-center">
                <p className="text-lg text-gray-300">You scored</p>
                <p className={`text-7xl font-bold my-2 ${scoreColorClass}`}>
                    {evaluation.score}
                    <span className="text-4xl text-gray-400">/{question.marks}</span>
                </p>
            </div>
        </div>

        <div className="space-y-8">
          {/* Question */}
          <div className="bg-black/20 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">Question Asked:</h3>
            <p className="text-gray-300 leading-relaxed">{question.questionText}</p>
          </div>

          {/* Your Answer */}
          <div className="bg-black/20 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">Your Answer:</h3>
            {answer.text && <p className="text-gray-300 whitespace-pre-wrap">{answer.text}</p>}
            {answer.fileBase64 && (
                answer.fileBase64.startsWith('data:image/')
                ? <img src={answer.fileBase64} alt="Your handwritten answer" className="max-w-full h-auto rounded-md border border-white/10" />
                : <div className="p-4 bg-black/30 rounded-lg flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-300">Uploaded File:</p>
                        <p className="text-purple-400 font-medium">{answer.fileName}</p>
                    </div>
                  </div>
            )}
          </div>

          {/* Feedback */}
          <div className="bg-green-500/10 p-6 rounded-xl border border-green-500/20">
            <h3 className="text-xl font-bold text-green-300 mb-3">Feedback from AI Examiner:</h3>
            <p className="text-green-200 whitespace-pre-wrap">{evaluation.feedback}</p>
          </div>

          {/* Suggestions */}
          <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/20">
            <h3 className="text-xl font-bold text-amber-300 mb-3">Suggestions for Improvement:</h3>
            <p className="text-amber-200 whitespace-pre-wrap">{evaluation.suggestions}</p>
          </div>

          {/* Model Answer */}
          {evaluation.modelAnswer && (
             <div className="bg-black/20 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Model Answer:</h3>
                <div>
                    {renderFormattedAnswer(evaluation.modelAnswer)}
                </div>
             </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
            <button
              onClick={onTryAgain}
              className="btn btn-primary text-base"
            >
              Take Another Test
            </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptiveResultsView;
