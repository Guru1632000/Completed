
import React, { useMemo } from 'react';
import { TestTopic, ExamType } from '../types';

interface SidebarProps {
    onGoHome: () => void;
    onShowMyTests: () => void;
    onShowDashboard: () => void;
    onShowAiNotes: () => void;
    onShowStorage: () => void;
    onShowDownloads: () => void;
    onShowTextExtractions: () => void;
    onShowWeeklyPerformance: () => void;
    onShowExams: () => void;
    testTopics: TestTopic[];
    isOpen: boolean;
    onClose: () => void;
    activeExamType: ExamType | null;
}

// Icons for the sidebar
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>;
const MyTestsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ExamsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const NotesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const StorageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <ellipse strokeLinecap="round" strokeLinejoin="round" cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
</svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const PerformanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;

const Sidebar: React.FC<SidebarProps> = ({ 
    onGoHome, onShowMyTests, onShowDashboard, onShowAiNotes, onShowStorage, onShowDownloads, onShowTextExtractions, onShowWeeklyPerformance, onShowExams, testTopics, isOpen, onClose, activeExamType
}) => {
    const isProcessing = useMemo(() => 
        testTopics.some(topic => topic.generationStatus === 'processing'), 
        [testTopics]
    );

    const handleItemClick = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-logo cursor-pointer" onClick={() => handleItemClick(onGoHome)} title="AI Exam Prep Home">
                <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                        <linearGradient id="book-cover-grad-sidebar" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#6d28d9"/></linearGradient>
                        <linearGradient id="cap-top-grad-sidebar" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient>
                    </defs>
                    <g><path d="M10 54C10 51.7909 11.7909 50 14 50H50C52.2091 50 54 51.7909 54 54V56C54 58.2091 52.2091 60 50 60H14C11.7909 60 10 58.2091 10 56V54Z" fill="url(#book-cover-grad-sidebar)"/><path d="M8 52C20 44 44 44 56 52L54 28C42 34 22 34 10 28L8 52Z" fill="#e5e7eb"/><path d="M10 28C22 34 42 34 54 28L32 20L10 28Z" fill="#ffffff"/><g transform="translate(0, -8)"><path d="M24 30C24 28.8954 27.5817 28 32 28C36.4183 28 40 28.8954 40 30V32H24V30Z" fill="#6d28d9"/><path d="M32 8L52 18L32 28L12 18L32 8Z" fill="url(#cap-top-grad-sidebar)"/></g></g>
                </svg>
            </div>
            
            <nav className="sidebar-nav flex-grow flex flex-col">
                <div className="flex-grow">
                    <button onClick={() => handleItemClick(onGoHome)} className="sidebar-nav-item"><HomeIcon /><span className="nav-text">Home</span></button>
                    <button onClick={() => handleItemClick(onShowDashboard)} className="sidebar-nav-item"><DashboardIcon /><span className="nav-text">My Dashboard</span></button>
                    <button onClick={() => handleItemClick(onShowMyTests)} className="sidebar-nav-item">
                        <MyTestsIcon />
                        <span className="nav-text">My Tests</span>
                        {isProcessing && (
                            <span className="absolute top-2 right-4 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                            </span>
                        )}
                    </button>
                    <button onClick={() => handleItemClick(onShowExams)} className="sidebar-nav-item"><ExamsIcon /><span className="nav-text">Exams</span></button>
                    <button onClick={() => handleItemClick(onShowAiNotes)} className="sidebar-nav-item"><NotesIcon /><span className="nav-text">AI Study Notes</span></button>
                    <button onClick={() => handleItemClick(onShowStorage)} className="sidebar-nav-item"><StorageIcon /><span className="nav-text">Storage</span></button>
                    <button onClick={() => handleItemClick(onShowTextExtractions)} className="sidebar-nav-item"><TextIcon /><span className="nav-text">Text Extractions</span></button>
                    <button onClick={() => handleItemClick(onShowWeeklyPerformance)} className="sidebar-nav-item"><PerformanceIcon /><span className="nav-text">Performance</span></button>
                    <button onClick={() => handleItemClick(onShowDownloads)} className="sidebar-nav-item"><DownloadIcon /><span className="nav-text">Download PDF</span></button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
