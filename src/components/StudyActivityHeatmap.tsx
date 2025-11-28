

import React, { useMemo } from 'react';
import { TestResult } from '../types';

interface StudyActivityHeatmapProps {
    history: TestResult[];
}

const StudyActivityHeatmap: React.FC<StudyActivityHeatmapProps> = ({ history }) => {
    const { dataGrid, daysInMonth, hasActivity } = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const grid: { [day: number]: { [bucket: string]: number } } = {};
        for (let i = 1; i <= daysInMonth; i++) {
            grid[i] = { '0-30': 0, '30-60': 0, '60-120': 0, '120+': 0 };
        }

        const relevantHistory = history.filter(r => {
            const d = new Date(r.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });

        relevantHistory.forEach(result => {
            if (result.timeTakenInSeconds === undefined) return;
            const day = new Date(result.date).getDate();
            const durationMinutes = result.timeTakenInSeconds / 60;
            
            let bucket: string;
            if (durationMinutes < 30) bucket = '0-30';
            else if (durationMinutes < 60) bucket = '30-60';
            else if (durationMinutes < 120) bucket = '60-120';
            else bucket = '120+';
            
            grid[day][bucket] += result.totalCount;
        });
        
        const hasActivity = relevantHistory.length > 0;
        
        return { dataGrid: grid, daysInMonth, hasActivity };
    }, [history]);

    if (!hasActivity) {
        return null;
    }

    const getColorClass = (count: number): string => {
        if (count === 0) return 'bg-slate-800/30';
        if (count <= 10) return 'bg-purple-900/80';
        if (count <= 25) return 'bg-purple-700';
        if (count <= 50) return 'bg-purple-500';
        return 'bg-purple-400';
    };

    const legendItems = [
        { color: 'bg-purple-900/80' },
        { color: 'bg-purple-700' },
        { color: 'bg-purple-500' },
        { color: 'bg-purple-400' },
    ];

    const durationLabels = ['2h+', '1-2h', '30-60m', '0-30m'];
    const durationBucketsReverse = ['120+', '60-120', '30-60', '0-30'];

    return (
        <div className="bg-slate-900/70 p-6 rounded-2xl border border-white/10 item-animated-entry">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Study Activity
                    {/* FIX: Replaced invalid `title` prop with a nested <title> element. */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <title>Shows questions practiced per session duration each day of the current month.</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 sm:mt-0">
                    <span className="mr-2">Less</span>
                    {legendItems.map((item, index) => (
                        <div key={index} className={`w-4 h-4 rounded-sm ${item.color}`}></div>
                    ))}
                     <span className="ml-2">More</span>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex flex-col justify-between text-xs text-gray-500 font-semibold pt-1 pb-6 shrink-0 w-12 text-right">
                    {durationLabels.map(label => <div key={label} className="h-5 flex items-center">{label}</div>)}
                </div>

                <div className="grid grid-flow-col auto-cols-auto gap-1 w-full overflow-x-auto no-scrollbar pb-4 -ml-1">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                        <div key={day} className="flex flex-col items-center">
                            <div className="flex flex-col gap-1">
                                {durationBucketsReverse.map(bucket => {
                                    const count = dataGrid[day]?.[bucket] || 0;
                                    return (
                                        <div
                                            key={`${day}-${bucket}`}
                                            className={`w-5 h-5 rounded-sm ${getColorClass(count)} transition-colors`}
                                            title={count > 0 ? `${count} questions on day ${day}` : `No activity on day ${day}`}
                                        />
                                    );
                                })}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">{day}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudyActivityHeatmap;
