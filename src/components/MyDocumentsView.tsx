
import React from 'react';
import { Difficulty, ExamType, FileInfo, TestTopic, TestMode } from '../types';

interface MyDocumentsViewProps {
    testTopics: TestTopic[];
    allTopicNames: string[];
    onUpdateTopics: (updater: React.SetStateAction<TestTopic[]>) => void;
    onStartGeneration: (topicId: string, numQuestions: number, difficulty: Difficulty, mode: TestMode) => void;
    activeExamType: ExamType;
    onGoBack?: () => void;
}

// This component is no longer used and has been deprecated.
// The logic has been moved into other components like FileUploadView.
const MyDocumentsView: React.FC<MyDocumentsViewProps> = () => {
    return null;
};

export default MyDocumentsView;
