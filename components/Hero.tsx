

import React, { useState, useEffect, useRef } from 'react';
import { ExamType } from '../types';

interface HeroProps {
    onResumeTest?: () => void;
    onShowExams: () => void;
    onShowWeeklyPerformance: () => void;
    activeExamType: ExamType | null;
}

const AnimatedStat: React.FC<{ endValue: number; suffix?: string; label: string; duration?: number }> = ({ endValue, suffix = '', label, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const statRef = useRef<HTMLDivElement>(null);
    const animationTriggered = useRef(false);
    const animationFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        const currentRef = statRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !animationTriggered.current) {
                    animationTriggered.current = true;
                    let startTimestamp: number | null = null;

                    const step = (timestamp: number) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
                        const currentValue = Math.floor(easedProgress * endValue);
                        
                        setCount(currentValue);

                        if (progress < 1) {
                            animationFrameIdRef.current = requestAnimationFrame(step);
                        } else {
                            setCount(endValue);
                        }
                    };
                    animationFrameIdRef.current = requestAnimationFrame(step);
                    observer.unobserve(currentRef);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [endValue, duration]);
    
    const formatNumber = (num: number) => {
        return num.toLocaleString('en-IN');
    };

    return (
        <div ref={statRef} className="text-center">
            <p className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                {formatNumber(count)}{suffix}
            </p>
            <p className="mt-2 text-base text-purple-300/90">{label}</p>
        </div>
    );
};


const Hero: React.FC<HeroProps> = ({ onResumeTest, onShowExams, onShowWeeklyPerformance, activeExamType }) => {
    const heroTitle = 'Seamless AI Integration for Your Exam Preparation';
    const heroSubtitle = 'We help you practice with AI models integrated into your exam preparation process.';

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: 'AI-Powered Questions',
            description: 'Get fresh, unique questions for every practice session, tailored to the exam pattern.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18M5.468 12.001l13.064 0M8.27 3.001l7.46 0M8.27 21.001l7.46 0" />
                </svg>
            ),
            title: 'Syllabus Aligned',
            description: 'Content is generated based on the latest official exam syllabus for all supported exams.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
            ),
            title: 'Detailed Analytics',
            description: 'Track your performance, identify weak areas, and get personalized study plans to improve.',
        },
    ];
    
    const stats = [
        { value: 10000, label: 'AI Questions Generated', suffix: '+' },
        { value: 95, label: 'Syllabus Coverage', suffix: '%' },
        { value: 4, label: 'Major Exams Supported' },
    ];

    return (
        <div className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col items-center justify-center min-h-screen">
             <div 
                className="absolute inset-0" 
                style={{ backgroundImage: 'radial-gradient(ellipse at top, #3a256a, #0A0910 70%)' }}
            />
            
            <div className="ai-grid-container" aria-hidden="true">
                <div className="ai-grid"></div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl text-center mx-auto">
                    <div className="mb-6 stagger-animated-entry stagger-1">
                        <div className="relative inline-block ai-exams-button-container">
                             {/* Left Wires */}
                            <div className="wire-svg-container wire-svg-left" aria-hidden="true">
                                <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                                    {/* Background Wires */}
                                    <path d="M200,50 C100,50 100,0 0,0" className="wire-path-bg" />
                                    <path d="M200,50 L0,50" className="wire-path-bg" />
                                    <path d="M200,50 C100,50 100,100 0,100" className="wire-path-bg" />
                                    {/* Animated Data Flow */}
                                    <path d="M200,50 C100,50 100,0 0,0" className="wire-path wire-path-1" />
                                    <path d="M200,50 L0,50" className="wire-path wire-path-2" />
                                    <path d="M200,50 C100,50 100,100 0,100" className="wire-path wire-path-3" />
                                </svg>
                            </div>
                            <span className="relative z-10 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-purple-300 backdrop-blur-sm">
                               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a10 10 0 0 0-3.54 19.54M12 2a10 10 0 0 1 3.54 19.54M12 2V6"/>
                                    <path d="M12 18v4"/>
                                    <path d="M4.93 4.93l2.12 2.12"/>
                                    <path d="M16.95 16.95l2.12 2.12"/>
                                    <path d="M2 12h4"/>
                                    <path d="M18 12h4"/>
                                    <path d="M4.93 19.07l2.12-2.12"/>
                                    <path d="M16.95 7.05l2.12-2.12"/>
                                    <circle cx="12" cy="12" r="4"/>
                                </svg>
                               AI + EXAMS
                            </span>
                             {/* Right Wires */}
                            <div className="wire-svg-container wire-svg-right" aria-hidden="true">
                                <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                                    {/* Background Wires */}
                                    <path d="M0,50 C100,50 100,0 200,0" className="wire-path-bg" />
                                    <path d="M0,50 L200,50" className="wire-path-bg" />
                                    <path d="M0,50 C100,50 100,100 200,100" className="wire-path-bg" />
                                    {/* Animated Data Flow */}
                                    <path d="M0,50 C100,50 100,0 200,0" className="wire-path wire-path-1" />
                                    <path d="M0,50 L200,50" className="wire-path wire-path-2" />
                                    <path d="M0,50 C100,50 100,100 200,100" className="wire-path wire-path-3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter leading-tight stagger-animated-entry stagger-2">
                        {heroTitle}
                    </h1>
                    <p className="mt-6 max-w-xl mx-auto text-lg text-gray-400 stagger-animated-entry stagger-3">
                        {heroSubtitle}
                    </p>
                     <p className="mt-4 max-w-2xl mx-auto text-base text-purple-300/90 stagger-animated-entry stagger-4">
                        Questions are prepared based on real exam standards for TNPSC, Bank, Railway, and SSC exams, covering all major stages.
                    </p>
                    
                    {/* NEW FEATURES SECTION */}
                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <div 
                                key={feature.title} 
                                className="bg-white/5 p-6 rounded-2xl border border-white/10 stagger-animated-entry"
                                style={{ animationDelay: `${400 + (index + 1) * 150}ms` }}
                            >
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500/10 mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    <div 
                        className="mt-16 flex justify-center items-center gap-4 flex-wrap stagger-animated-entry"
                        style={{ animationDelay: '1000ms' }}
                    >
                        <button onClick={onShowExams} className="btn btn-primary">
                           Get Started
                           <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </button>
                         {onResumeTest && (
                            <button 
                                onClick={onResumeTest}
                                className="btn btn-secondary"
                            >
                                Resume Last Test
                            </button>
                        )}
                    </div>
                </div>
                
                 {/* STATS SECTION */}
                <div 
                    className="mt-20 max-w-5xl mx-auto stagger-animated-entry"
                    style={{ animationDelay: '1100ms' }}
                >
                    <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-8 sm:divide-x sm:divide-white/10">
                        {stats.map((stat) => (
                            <AnimatedStat
                                key={stat.label}
                                endValue={stat.value}
                                suffix={stat.suffix}
                                label={stat.label}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;