import React, { useState } from 'react';

interface HexagonProps {
    x: number;
    y: number;
    size: number;
    color: string;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
}

const Hexagon: React.FC<HexagonProps> = ({ x, y, size, color, onMouseEnter, onMouseLeave }) => {
    const points = Array.from({ length: 6 }).map((_, i) => {
        const angleDeg = 60 * i;
        const angleRad = Math.PI / 180 * angleDeg;
        return `${x + size * Math.cos(angleRad)},${y + size * Math.sin(angleRad)}`;
    }).join(' ');

    return (
        <g 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ cursor: 'pointer', transition: 'transform 0.2s ease-out' }}
        >
            <polygon 
                points={points} 
                fill={color} 
                stroke="rgba(10, 9, 16, 0.5)" 
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
            />
        </g>
    );
};

interface TooltipData {
    x: number;
    y: number;
    name: string;
    score: number;
    attempts: number;
    visible: boolean;
}

interface HexagonPerformanceChartProps {
    data: { name: string; score: number; size: number }[];
}

const getColorForScore = (score: number) => {
    const s = Math.max(0, Math.min(100, score)) / 100; // Normalize score to 0-1
    // Dark Indigo (#312e81) -> Mid Violet (#6d28d9) -> Light Lavender (#a78bfa)
    let r, g, b;
    if (s < 0.5) {
        const t = s * 2; // Interpolate between dark and mid
        r = 49 * (1 - t) + 109 * t;
        g = 46 * (1 - t) + 40 * t;
        b = 129 * (1 - t) + 217 * t;
    } else {
        const t = (s - 0.5) * 2; // Interpolate between mid and light
        r = 109 * (1 - t) + 167 * t;
        g = 40 * (1 - t) + 139 * t;
        b = 217 * (1 - t) + 250 * t;
    }
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

const HexagonPerformanceChart: React.FC<HexagonPerformanceChartProps> = ({ data }) => {
    const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, name: '', score: 0, attempts: 0, visible: false });

    if (data.length < 3) {
         return (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    <p className="mt-2 font-semibold">Not enough data for hotspots</p>
                    <p className="text-xs">Attempt more questions across different topics.</p>
                </div>
            </div>
        );
    }
    
    const size = 35;
    const width = 500;
    const height = 350;
    
    // Hardcoded positions for a pleasing honeycomb cluster
    const positions = [
        { q: 0, r: 0 }, // Center
        { q: 1, r: -1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, 
        { q: -1, r: 1 }, { q: -1, r: 0 }, { q: 0, r: -1 }, // Ring 1
        { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 },
        { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 2 },
        { q: -2, r: 2 }, { q: -2, r: 1 }, { q: -2, r: 0 },
        { q: -1, r: -1 }, { q: 0, r: -2 }, { q: 1, r: -2 }, // Ring 2
    ].slice(0, data.length);

    const hexagons = data.map((item, i) => {
        const pos = positions[i];
        if (!pos) return null;
        
        // Axial to pixel conversion
        const cx = width / 2 + size * 3/2 * pos.q;
        const cy = height / 2 + size * Math.sqrt(3) * (pos.r + pos.q / 2);
        
        return { x: cx, y: cy, ...item };
    }).filter(Boolean);

    const handleMouseEnter = (hex: any, e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top,
            name: hex.name,
            score: hex.score,
            attempts: hex.size,
            visible: true
        });
    };

    return (
        <div className="relative w-full h-full flex flex-col">
            {tooltip.visible && (
                <div 
                    className="absolute z-10 p-3 bg-slate-800/90 backdrop-blur-sm text-white rounded-lg border border-white/20 shadow-lg text-sm pointer-events-none"
                    style={{ 
                        left: tooltip.x, 
                        top: tooltip.y, 
                        transform: 'translate(-50%, -110%)',
                        transition: 'opacity 0.2s',
                        opacity: tooltip.visible ? 1 : 0
                    }}
                >
                    <p className="font-bold">{tooltip.name}</p>
                    <p>Score: <span className="font-semibold" style={{color: getColorForScore(tooltip.score)}}>{tooltip.score.toFixed(0)}%</span></p>
                    <p>Attempts: <span className="font-semibold">{tooltip.attempts}</span></p>
                </div>
            )}
            <div className="flex-grow min-h-0">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {hexagons.map((hex, i) => (
                        <Hexagon
                            key={i}
                            x={hex.x}
                            y={hex.y}
                            size={size}
                            color={getColorForScore(hex.score)}
                            onMouseEnter={(e) => handleMouseEnter(hex, e)}
                            onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                        />
                    ))}
                </svg>
            </div>
             <div className="flex-shrink-0 flex items-center justify-center gap-8 text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{backgroundColor: getColorForScore(10)}}></div> Low
                </div>
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{backgroundColor: getColorForScore(50)}}></div> Medium
                </div>
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{backgroundColor: getColorForScore(90)}}></div> High
                </div>
            </div>
        </div>
    );
};

export default HexagonPerformanceChart;
