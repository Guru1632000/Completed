import * as React from 'react';
import { ExamType, BankFilterType, BankExamFilterType, RailwayExamFilterType, RailwayStageFilterType, SSCExamFilterType, SSCStageFilterType, TNPSCGroupFilterType, TNPSCStageFilterType } from '../types';
import { TNPSC_GROUP_FILTERS, TNPSC_STAGE_FILTERS, BANK_FILTERS, BANK_EXAM_FILTERS, RAILWAY_EXAM_FILTERS, SSC_EXAM_FILTERS, SSC_STAGE_FILTERS } from '../constants';

// TabGroup component with sliding indicator animation
const TabGroup: React.FC<{
  items: { id: string; label: string; disabled?: boolean }[];
  activeItem: string;
  onItemChange: (id: string) => void;
  sliderClass: string;
  activeButtonClass: string;
  inactiveButtonClass: string;
  ringClass: string;
}> = ({ items, activeItem, onItemChange, sliderClass, activeButtonClass, inactiveButtonClass, ringClass }) => {
    const [sliderStyle, setSliderStyle] = React.useState({ left: 0, width: 0, opacity: 0 });
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    React.useEffect(() => {
        const activeTabIndex = items.findIndex(item => item.id === activeItem);
        const activeTabElement = tabRefs.current[activeTabIndex];
        
        if (activeTabElement) {
            setSliderStyle({
                left: activeTabElement.offsetLeft,
                width: activeTabElement.offsetWidth,
                opacity: 1,
            });
        }
    }, [activeItem, items]);

    return (
        <div className="relative bg-black/20 p-1 rounded-xl inline-flex items-center space-x-1 overflow-x-auto no-scrollbar">
            <div 
                className={`absolute top-1 bottom-1 rounded-lg apple-like-transition ${sliderClass}`}
                style={{ left: sliderStyle.left, width: sliderStyle.width, opacity: sliderStyle.opacity }}
            />
            {items.map((item, index) => (
                <button
                    ref={el => { tabRefs.current[index] = el; }}
                    key={item.id}
                    onClick={() => onItemChange(item.id)}
                    disabled={item.disabled}
                    className={`relative z-10 py-2 px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 ${activeItem === item.id ? activeButtonClass : inactiveButtonClass} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${ringClass}`}
                    aria-current={activeItem === item.id ? 'page' : undefined}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

interface FilterNavProps {
    activeExamType: ExamType;
    onExamTypeChange: (exam: ExamType) => void;
    activeTNPSCGroupFilter: TNPSCGroupFilterType;
    onTNPSCGroupFilterChange: (filter: TNPSCGroupFilterType) => void;
    activeTNPSCStageFilter: TNPSCStageFilterType;
    onTNPSCStageFilterChange: (filter: TNPSCStageFilterType) => void;
    activeBankFilter: BankFilterType;
    onBankFilterChange: (filter: BankFilterType) => void;
    activeBankExamFilter: BankExamFilterType;
    onBankExamFilterChange: (filter: BankExamFilterType) => void;
    activeRailwayExamFilter: RailwayExamFilterType;
    onRailwayExamFilterChange: (filter: RailwayExamFilterType) => void;
    activeRailwayStageFilter: RailwayStageFilterType;
    onRailwayStageFilterChange: (filter: RailwayStageFilterType) => void;
    activeSSCExamFilter: SSCExamFilterType;
    onSSCExamFilterChange: (filter: SSCExamFilterType) => void;
    activeSSCStageFilter: SSCStageFilterType;
    onSSCStageFilterChange: (filter: SSCStageFilterType) => void;
}

const getRailwayStageFilters = (exam: RailwayExamFilterType): {id: RailwayStageFilterType, label: string}[] => {
    if (exam === 'RRB ALP') {
        return [{id:'PYQ', label:'PYQ'}, {id:'CBT-1', label:'CBT-1'}, {id:'CBT-2 (Part A)', label:'CBT-2 (Part A)'}, {id:'CBT-2 (Part B)', label:'CBT-2 (Part B)'}, {id:'Full Mock Test', label:'Full Mock Test'}, {id:'Upload Files', label:'Upload Files'}];
    }
    return [{id:'PYQ', label:'PYQ'}, {id:'CBT-1', label:'CBT-1'}, {id:'CBT-2', label:'CBT-2'}, {id:'Full Mock Test', label:'Full Mock Test'}, {id:'Upload Files', label:'Upload Files'}];
}

const FilterNav: React.FC<FilterNavProps> = ({ 
    activeExamType, 
    onExamTypeChange,
    activeTNPSCGroupFilter, onTNPSCGroupFilterChange,
    activeTNPSCStageFilter, onTNPSCStageFilterChange,
    activeBankFilter, onBankFilterChange,
    activeBankExamFilter, onBankExamFilterChange,
    activeRailwayExamFilter, onRailwayExamFilterChange,
    activeRailwayStageFilter, onRailwayStageFilterChange,
    activeSSCExamFilter, onSSCExamFilterChange,
    activeSSCStageFilter, onSSCStageFilterChange
 }) => {
    const isTNPSC = activeExamType === 'TNPSC';
    const isBank = activeExamType === 'Bank Exam';
    const isRailway = activeExamType === 'Railway';
    const isSSC = activeExamType === 'SSC';
    
    const railwayStageFilters = getRailwayStageFilters(activeRailwayExamFilter);
    const tnpscGroupFilters = TNPSC_GROUP_FILTERS;
    const tnpscStageFilters = TNPSC_STAGE_FILTERS;
    const bankExamFilters = BANK_EXAM_FILTERS;
    const bankFilters = BANK_FILTERS;
    const railwayExamFilters = RAILWAY_EXAM_FILTERS;
    const sscExamFilters = SSC_EXAM_FILTERS;

    const displayedSSCStageFilters = React.useMemo(() => {
        if (activeSSCExamFilter === 'JE') {
            return SSC_STAGE_FILTERS.filter(f => !['Tier-1', 'Tier-2'].includes(f.id));
        }
        // Default for CGL, CHSL
        return SSC_STAGE_FILTERS.filter(f => !['Paper-I', 'Paper-II'].includes(f.id));
    }, [activeSSCExamFilter]);

    return (
        <div className="filter-nav-container">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div key={activeExamType} className="explanation-animate flex justify-center">
                    {isTNPSC && (
                         <div className="flex flex-col items-center space-y-3">
                            <TabGroup
                                items={tnpscGroupFilters}
                                activeItem={activeTNPSCGroupFilter}
                                onItemChange={(id) => onTNPSCGroupFilterChange(id as TNPSCGroupFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                            <TabGroup
                                items={tnpscStageFilters}
                                activeItem={activeTNPSCStageFilter}
                                onItemChange={(id) => onTNPSCStageFilterChange(id as TNPSCStageFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                        </div>
                    )}

                    {isBank && (
                        <div className="flex flex-col items-center space-y-3">
                            <TabGroup
                                items={bankExamFilters}
                                activeItem={activeBankExamFilter}
                                onItemChange={(id) => onBankExamFilterChange(id as BankExamFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                            <TabGroup
                                items={bankFilters}
                                activeItem={activeBankFilter}
                                onItemChange={(id) => onBankFilterChange(id as BankFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                        </div>
                    )}

                    {isRailway && (
                        <div className="flex flex-col items-center space-y-3">
                            <TabGroup
                                items={railwayExamFilters}
                                activeItem={activeRailwayExamFilter}
                                onItemChange={(id) => onRailwayExamFilterChange(id as RailwayExamFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                            <TabGroup
                                items={railwayStageFilters}
                                activeItem={activeRailwayStageFilter}
                                onItemChange={(id) => onRailwayStageFilterChange(id as RailwayStageFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                        </div>
                    )}

                    {isSSC && (
                        <div className="flex flex-col items-center space-y-3">
                            <TabGroup
                                items={sscExamFilters}
                                activeItem={activeSSCExamFilter}
                                onItemChange={(id) => onSSCExamFilterChange(id as SSCExamFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                            <TabGroup
                                items={displayedSSCStageFilters}
                                activeItem={activeSSCStageFilter}
                                onItemChange={(id) => onSSCStageFilterChange(id as SSCStageFilterType)}
                                sliderClass="bg-white/5"
                                activeButtonClass="text-white"
                                inactiveButtonClass="text-gray-400 hover:text-white"
                                ringClass="focus:ring-purple-500"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterNav;