import React, { useMemo } from 'react';
import { TopicQuestion } from '../types';
import { renderTextWithMarkdown } from './utils';

interface TopicQuestionsViewProps {
  topicQuestions: TopicQuestion[];
  onBack: () => void;
}

const TopicQuestionsView: React.FC<TopicQuestionsViewProps> = ({ topicQuestions, onBack }) => {

  const questionsByUnit = useMemo(() => {
    const grouped: { [unitTitle: string]: TopicQuestion[] } = {};
    topicQuestions.forEach(tq => {
      const unitTitle = tq.topic.unit;
      if (!grouped[unitTitle]) {
        grouped[unitTitle] = [];
      }
      grouped[unitTitle].push(tq);
    });
    return Object.entries(grouped);
  }, [topicQuestions]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Sample Questions by Topic</h1>
          <p className="mt-4 text-lg text-gray-400">
            Here is one AI-generated question for each topic in the selected syllabus, with varied difficulty.
          </p>
        </div>

        <div className="space-y-12">
          {questionsByUnit.map(([unitTitle, questions], unitIndex) => (
            <div key={unitTitle}>
              <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b-2 border-purple-500/30 pb-3">{unitTitle}</h2>
              <div className="space-y-8">
                {questions.map((item, itemIndex) => (
                  <div key={`${item.topic.name}-${itemIndex}`} className="bg-black/20 p-6 rounded-2xl border border-white/10 item-animated-entry" style={{ animationDelay: `${itemIndex * 70}ms` }}>
                    <h3 className="text-xl font-bold text-white mb-1">{item.topic.name}</h3>
                    
                    {item.error ? (
                      <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                        <p><strong className="font-bold">Error:</strong> Failed to generate question. {item.error}</p>
                      </div>
                    ) : !item.question ? (
                      <div className="mt-4 text-gray-500">
                        <p>Could not generate a sample question for this topic.</p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="font-semibold text-gray-200 mb-4">{renderTextWithMarkdown(item.question.questionText)}</div>
                        <div className="space-y-2">
                          {Object.entries(item.question.options).map(([key, value]) => {
                            const isCorrect = item.question?.correctOption === key;
                            const optionStyle = isCorrect
                              ? 'bg-green-500/10 text-green-200 border-green-500/30 font-semibold'
                              : 'bg-black/20 text-gray-400 border-transparent';
                            
                            return (
                              <div key={key} className={`p-3 rounded-lg flex items-start gap-3 border ${optionStyle}`}>
                                <span className="font-bold text-sm">{key}.</span>
                                <span className="text-base flex-grow">{renderTextWithMarkdown(value as string)}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-6">
                            <div className="p-4 rounded-lg bg-purple-500/10">
                                <h5 className="font-bold text-white mb-2">Explanation</h5>
                                {item.question.explanationDiagramSvg && (
                                    <div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: item.question.explanationDiagramSvg }} />
                                )}
                                <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed">
                                    {renderTextWithMarkdown(item.question.explanation)}
                                </div>
                            </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <button onClick={onBack} className="btn btn-primary text-base">
              Back to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default TopicQuestionsView;