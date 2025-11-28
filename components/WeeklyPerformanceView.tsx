import React, { useMemo } from 'react';
import { TestResult } from '../types';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
} from 'recharts';
import TopicAnalysisView from './TopicAnalysisView';
import NoTestsView from './NoTestsView';

interface WeeklyPerformanceViewProps {
    history: TestResult[];
    onGoBack: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (data['Tests Taken'] === 0) {
            return (
                <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-white/20 shadow-lg">
                    <p className="text-sm font-bold text-white">{data.fullDate}</p>
                    <p className="text-xs text-gray-400">No tests taken</p>
                </div>
            );
        }
        return (
            <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-white/20 shadow-lg">
                <p className="text-sm font-bold text-white">{data.fullDate} ({label})</p>
                <p className="text-xs text-purple-300">Avg Score: {data['Avg Score'].toFixed(0)}%</p>
                <p className="text-xs text-gray-400">Tests: {data['Tests Taken']}</p>
            </div>
        );
    }

    return null;
};

const GaugeChart: React.FC<{
    value: number;
    maxValue: number;
    label: string;
    unit: string;
    gradientId: string;
    colorStops: { offset: string; color: string }[];
}> = ({ value, maxValue, label, unit, gradientId, colorStops }) => {
    const data = [{ name: label, value }];
    const displayValue = Number.isFinite(value) ? value.toFixed(unit === 's' ? 1 : 0) : '0';

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="80%"
                        outerRadius="100%"
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                        barSize={12}
                    >
                        <defs>
                            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                {colorStops.map((stop, i) => <stop key={i} offset={stop.offset} stopColor={stop.color} />)}
                            </radialGradient>
                        </defs>
                        <PolarAngleAxis type="number" domain={[0, maxValue]} tick={false} />
                        <RadialBar
                            background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            dataKey="value"
                            cornerRadius={6}
                            fill={`url(#${gradientId})`}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl sm:text-5xl font-bold text-white">{displayValue}</span>
                    <span className="text-sm text-gray-400">{unit}</span>
                </div>
            </div>
            <p className="mt-4 text-base font-semibold text-gray-300 text-center">{label}</p>
        </div>
    );
};


const WeeklyPerformanceView: React.FC<WeeklyPerformanceViewProps> = ({ history, onGoBack }) => {

    const weeklyHistory = useMemo(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 6);
        last7Days.setHours(0, 0, 0, 0);

        return history.filter(result => {
            const resultDate = new Date(result.date);
            return resultDate >= last7Days && resultDate <= today;
        });
    }, [history]);

    const performanceData = useMemo(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 6);
        last7Days.setHours(0, 0, 0, 0);

        const dataByDay: { [key: string]: { scores: number[], count: number, date: Date } } = {};
        const dayNames: string[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(last7Days);
            date.setDate(date.getDate() + i);
            const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
            dayNames.push(dayKey);
            dataByDay[dayKey] = { scores: [], count: 0, date };
        }

        weeklyHistory.forEach(result => {
            const dayKey = new Date(result.date).toLocaleDateString('en-US', { weekday: 'short' });
            if (dataByDay[dayKey]) {
                dataByDay[dayKey].scores.push(result.score);
                dataByDay[dayKey].count++;
            }
        });

        return dayNames.map(day => {
             const data = dataByDay[day];
             return {
                name: day,
                'Avg Score': data.count > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.count : 0,
                'Tests Taken': data.count,
                fullDate: data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
        });
    }, [weeklyHistory]);
    
    const { totalTestsThisWeek, avgScoreThisWeek, avgTimePerQuestion } = useMemo(() => {
        const totalTests = weeklyHistory.length;
        if (totalTests === 0) {
            return { totalTestsThisWeek: 0, avgScoreThisWeek: 0, avgTimePerQuestion: 0 };
        }
        
        const totalScorePoints = weeklyHistory.reduce((sum, day) => sum + day.score, 0);
        const avgScore = totalScorePoints / totalTests;

        const totalTime = weeklyHistory.reduce((sum, r) => sum + (r.timeTakenInSeconds || 0), 0);
        const totalQuestions = weeklyHistory.reduce((sum, r) => sum + r.totalCount, 0);
        const avgTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;

        return { 
            totalTestsThisWeek: totalTests, 
            avgScoreThisWeek: avgScore,
            avgTimePerQuestion: avgTime,
        };
    }, [weeklyHistory]);
    
    if (weeklyHistory.length === 0) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <NoTestsView onGoBack={onGoBack} />
             </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">Weekly Performance Report</h1>
                    <p className="mt-2 text-lg text-gray-400">An overview of your test performance over the last 7 days.</p>
                </div>
                <button onClick={onGoBack} className="btn btn-secondary flex-shrink-0">
                    &larr; Back to History
                </button>
            </div>
            
            <div className="item-animated-entry">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1e1a3b] to-[#0d0c15] p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10">
                  <div className="relative h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.0)" />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="Avg Score" stroke="url(#line-grad)" strokeWidth={3} fill="url(#area-grad)" activeDot={{ r: 6, strokeWidth: 2, fill: '#a855f7', stroke: '#fff' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div title="Average score across all tests taken in the last 7 days.">
                      <GaugeChart value={avgScoreThisWeek} maxValue={100} label="Weekly Accuracy" unit="%" gradientId="avg-score-grad" colorStops={[{ offset: '0%', color: '#f472b6' }, { offset: '100%', color: '#a855f7' }]} />
                    </div>
                    <div title="Total number of tests completed in the last 7 days.">
                      <GaugeChart value={totalTestsThisWeek} maxValue={Math.max(20, totalTestsThisWeek)} label="Tests This Week" unit="Tests" gradientId="tests-taken-grad" colorStops={[{ offset: '0%', color: '#38bdf8' }, { offset: '100%', color: '#3b82f6' }]} />
                    </div>
                    <div title="Average time spent per question in the last 7 days.">
                      <GaugeChart value={avgTimePerQuestion} maxValue={120} label="Avg. Time / Question" unit="s" gradientId="avg-time-grad" colorStops={[{ offset: '0%', color: '#f59e0b' }, { offset: '100%', color: '#facc15' }]} />
                    </div>
                  </div>
                </div>
                <TopicAnalysisView history={weeklyHistory} />
            </div>
        </div>
    );
};

export default WeeklyPerformanceView;