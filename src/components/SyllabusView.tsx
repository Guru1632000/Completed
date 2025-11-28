
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SyllabusUnit, Topic, Difficulty, Marks, ExamType, TestMode } from '../types';
import TestConfigModal from './TestConfigModal';
import SearchBar from './SearchBar';

interface EditTopicsModalProps {
    unit: SyllabusUnit;
    onClose: () => void;
    onSave: (updatedUnit: SyllabusUnit) => void;
}

const EditTopicsModal: React.FC<EditTopicsModalProps> = ({ unit, onClose, onSave }) => {
    const [unitTitle, setUnitTitle] = useState(unit.title);
    const [topics, setTopics] = useState<Topic[]>(() => [...unit.topics]);
    const [newTopicName, setNewTopicName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
    }, []);

    const hasChanges = useMemo(() => {
        if(unit.title !== unitTitle) return true;
        if (unit.topics.length !== topics.length) return true;
        const originalTopicNames = new Set(unit.topics.map(t => t.name));
        for (const topic of topics) {
            if (!originalTopicNames.has(topic.name)) return true;
        }
        return false;
    }, [topics, unit.topics, unitTitle, unit.title]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 300);
    };
    
    const handleAddTopic = () => {
        const trimmedName = newTopicName.trim();
        if (!trimmedName) {
            setError("Topic name cannot be empty.");
            return;
        }
        if (topics.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) {
            setError("This topic already exists in this unit.");
            return;
        }
        setError(null);
        const newTopic: Topic = { name: trimmedName, unit: unitTitle };
        setTopics(prev => [...prev, newTopic].sort((a,b) => a.name.localeCompare(b.name)));
        setNewTopicName('');
    };

    const handleDeleteTopic = (topicNameToDelete: string) => {
        setTopics(prev => prev.filter(t => t.name !== topicNameToDelete));
    };

    const handleSave = () => {
        const finalTopics = topics.map(t => ({...t, unit: unitTitle }));
        onSave({ ...unit, title: unitTitle, topics: finalTopics });
    };

    if (!modalRoot) return null;

    const modalJsx = (
        <div
            className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 ${isClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
        >
            <div
                className={`bg-[#13111c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-white/10 flex-shrink-0">
                    <label htmlFor="edit-modal-title" className="text-sm font-medium text-purple-400">Section Title</label>
                    <input
                        id="edit-modal-title"
                        type="text"
                        value={unitTitle}
                        onChange={(e) => setUnitTitle(e.target.value)}
                        className="w-full bg-transparent text-xl font-bold text-white mt-1 focus:outline-none focus:bg-white/5 p-2 -ml-2 rounded-lg"
                        placeholder="Enter section title"
                    />
                </header>
                <main className="p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Add New Topic</h3>
                        <div className="flex items-start gap-3">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={newTopicName}
                                    onChange={(e) => setNewTopicName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                                    className="w-full p-3 bg-slate-900/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter new topic name"
                                />
                                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                            </div>
                            <button onClick={handleAddTopic} className="btn btn-secondary !py-3">Add</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Existing Topics ({topics.length})</h3>
                        <div className="space-y-2">
                            {topics.length > 0 ? topics.map(topic => (
                                <div key={topic.name} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                    <span className="text-gray-300">{topic.name}</span>
                                    <button
                                        onClick={() => handleDeleteTopic(topic.name)}
                                        className="p-1 text-gray-500 hover:text-red-400 rounded-full"
                                        aria-label={`Delete topic ${topic.name}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )) : <p className="text-gray-500 text-center py-4">No topics in this unit.</p>}
                        </div>
                    </div>
                </main>
                <footer className="p-6 border-t border-white/10 flex-shrink-0 flex justify-end gap-4">
                    <button onClick={handleClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleSave} disabled={!hasChanges} className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
                </footer>
            </div>
        </div>
    );
    return ReactDOM.createPortal(modalJsx, modalRoot);
};


interface SyllabusViewProps {
  syllabus: SyllabusUnit[];
  onStartMCQTest: (topic: Topic | Topic[], numQuestions: number, difficulty: Difficulty, mode: TestMode, examType: ExamType, durationInMinutes?: number) => void;
  onStartMainsTest: (topic: Topic, marks: Marks) => void;
  activeExamType: ExamType;
  onUpdateSyllabus: (newSyllabus: SyllabusUnit[]) => void;
}

const SyllabusView: React.FC<SyllabusViewProps> = ({ syllabus, onStartMCQTest, onStartMainsTest, activeExamType, onUpdateSyllabus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState<Topic | Topic[] | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUnit, setEditingUnit] = useState<SyllabusUnit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<SyllabusUnit | null>(null);
  const [isDeleteModalClosing, setIsDeleteModalClosing] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);
  
  const isMultiSelectMode = useMemo(() => {
    if (activeExamType === 'TNPSC') return !syllabus.some(unit => unit.id.startsWith('mains'));
    if (activeExamType === 'Bank Exam') return true; 
    if (activeExamType === 'Railway') return true;
    if (activeExamType === 'SSC') return true;
    return false;
  }, [activeExamType, syllabus]);

  const filteredSyllabus = useMemo(() => {
    if (!searchQuery) return syllabus;
    
    const lowercasedQuery = searchQuery.toLowerCase();
    
    return syllabus.map(unit => {
      const filteredTopics = unit.topics.filter(topic =>
        topic.name.toLowerCase().includes(lowercasedQuery)
      );
      return { ...unit, topics: filteredTopics };
    }).filter(unit => unit.topics.length > 0);
  }, [syllabus, searchQuery]);


  const handleCardMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { width, height } = rect;

    const rotateX = (y / height - 0.5) * -20;
    const rotateY = (x / width - 0.5) * 20;

    const glowX = (x / width) * 100;
    const glowY = (y / height) * 100;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    card.style.setProperty('--glow-x', `${glowX}%`);
    card.style.setProperty('--glow-y', `${glowY}%`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const handleTopicClick = (topic: Topic) => {
    if (isMultiSelectMode) {
      setSelectedTopics(prevSelected => {
        const isAlreadySelected = prevSelected.some(t => t.name === topic.name && t.unit === topic.unit);
        if (isAlreadySelected) {
          return prevSelected.filter(t => !(t.name === topic.name && t.unit === topic.unit));
        } else {
          return [...prevSelected, topic];
        }
      });
    } else {
      setModalSubject(topic);
      setIsModalOpen(true);
    }
  };
  
  const handleStartCombinedTest = () => {
    if (selectedTopics.length > 0) {
      setModalSubject(selectedTopics);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalSubject(null);
  };

  const handleAddNewSection = () => {
    const newUnit: SyllabusUnit = {
        id: `custom-unit-${Date.now()}`,
        title: 'New Section (Click Edit to Rename)',
        topics: [],
    };
    onUpdateSyllabus([...syllabus, newUnit]);
  };

  const handleConfirmDelete = () => {
      if (!deletingUnit) return;
      onUpdateSyllabus(syllabus.filter(u => u.id !== deletingUnit.id));
      handleCloseDeleteModal();
  };

  const handleCloseDeleteModal = () => {
      setIsDeleteModalClosing(true);
      setTimeout(() => {
          setDeletingUnit(null);
          setIsDeleteModalClosing(false);
      }, 300);
  };
  
  const handleStartAllTopicsTest = () => {
    const allTopics = syllabus.flatMap(unit => unit.topics);
    if (allTopics.length > 0) {
      onStartMCQTest(allTopics, 10, 'Medium', 'practice', activeExamType);
    }
  };

  const theme = {
    focus: 'focus:ring-purple-500',
    selected: 'border-purple-500 bg-purple-500/10 shadow-purple-900/50',
    icon: 'text-purple-400',
    iconSelected: 'text-purple-300',
    textSelected: 'text-purple-100',
    fabButton: 'bg-white hover:bg-gray-200 text-black',
    fabCount: 'bg-purple-600',
  };

  return (
    <>
      <div id="syllabus" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Choose Your Topic</h2>
           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            {isMultiSelectMode 
                ? "Select one or more topics to start a combined practice test. To use your own documents, please use the 'Upload Files' tab." 
                : "Select a topic to start a descriptive (Mains) test."
            }
          </p>
          {isMultiSelectMode && (
            <div className="mt-6">
              <button onClick={handleStartAllTopicsTest} className="btn btn-secondary">
                Practice All Topics (10 Qs)
              </button>
            </div>
          )}
        </div>
        
        <div className="max-w-2xl mx-auto mb-10">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for a topic..."
          />
        </div>

        <div className="overflow-y-auto no-scrollbar pr-4" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            <div className="space-y-12 pb-16">
            {filteredSyllabus.length > 0 ? filteredSyllabus.map((unit, unitIndex) => (
                <div key={unit.id} className="bg-black/20 p-6 md:p-8 rounded-2xl border border-white/10 item-animated-entry" style={{ animationDelay: `${unitIndex * 100}ms` }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">{unit.title}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setEditingUnit(unit)}
                        className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        aria-label={`Edit section and topics for ${unit.title}`}
                        title="Edit Section Title & Topics"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                     <button
                        onClick={() => setDeletingUnit(unit)}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        aria-label={`Delete section ${unit.title}`}
                        title="Delete Section"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unit.topics.map((topic, index) => {
                    const isSelected = isMultiSelectMode && selectedTopics.some(t => t.name === topic.name && t.unit === topic.unit);
                    const cardClasses = `
                        w-full h-full text-left rounded-xl group 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 border 
                        ${
                        isSelected 
                            ? `${theme.selected} shadow-md`
                            : `bg-white/5 border-white/10 hover:border-purple-500/70`
                        }
                        ${theme.focus}`;

                    return (
                        <button
                        key={`${topic.unit}-${index}`}
                        onClick={() => handleTopicClick(topic)}
                        onMouseMove={handleCardMouseMove}
                        onMouseLeave={handleCardMouseLeave}
                        className={`${cardClasses} interactive-card item-animated-entry`}
                        style={{ animationDelay: `${Math.min(index * 40, 600)}ms`, willChange: 'transform' }}
                        aria-pressed={isSelected}
                        >
                        <div className="inner-card-content w-full h-full flex items-center justify-between p-4">
                            <span className={`font-semibold pr-2 ${isSelected ? theme.textSelected : 'text-gray-200'}`}>{topic.name}</span>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <div className="flex-shrink-0">
                                {isMultiSelectMode ? (
                                    isSelected ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme.iconSelected}`} viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-500 group-hover:scale-110 group-hover:text-purple-400`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    )
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 group-hover:translate-x-1 group-hover:text-purple-400`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                )}
                              </div>
                            </div>
                        </div>
                        </button>
                    );
                    })}
                </div>
                </div>
            )) : (
                <div className="text-center py-10">
                    <p className="text-lg text-gray-400">No topics found matching your search.</p>
                </div>
            )}
            </div>
        </div>

        <div className="mt-12 text-center">
            <button
                onClick={handleAddNewSection}
                className="btn btn-secondary inline-flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Section
            </button>
        </div>
      </div>

      {isMultiSelectMode && selectedTopics.length > 0 && (
         <div className="sticky bottom-4 inset-x-4 max-w-3xl mx-auto z-30">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-4 flex justify-between items-center border border-white/10">
                <p className="text-base sm:text-lg font-semibold text-white">
                    <span className={`text-white rounded-full h-8 w-8 inline-flex items-center justify-center mr-3 ${theme.fabCount}`}>{selectedTopics.length}</span>
                    {selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center space-x-2">
                     <button
                        onClick={() => setSelectedTopics([])}
                        className="text-gray-300 font-semibold px-4 sm:px-6 py-3 rounded-xl hover:bg-white/10"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleStartCombinedTest}
                        className="btn btn-primary shadow-lg"
                    >
                        Start Test
                    </button>
                </div>
            </div>
        </div>
      )}

      <TestConfigModal
        isOpen={isModalOpen}
        testSubject={modalSubject}
        onClose={handleModalClose}
        onStartMCQTest={(subject, numQuestions, difficulty, mode, duration) => {
            onStartMCQTest(subject, numQuestions, difficulty, mode, activeExamType, duration);
            setSelectedTopics([]);
            handleModalClose();
        }}
        onStartMainsTest={(topic, marks) => {
            onStartMainsTest(topic, marks);
            handleModalClose();
        }}
        activeExamType={activeExamType}
      />

      {editingUnit && (
        <EditTopicsModal
            unit={editingUnit}
            onClose={() => setEditingUnit(null)}
            onSave={(updatedUnit) => {
                const newSyllabus = syllabus.map(u => u.id === updatedUnit.id ? updatedUnit : u);
                onUpdateSyllabus(newSyllabus);
                setEditingUnit(null);
            }}
        />
      )}
      
      {deletingUnit && modalRoot && ReactDOM.createPortal(
        <div
            className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 ${isDeleteModalClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
            onClick={handleCloseDeleteModal}
        >
            <div
                className={`bg-[#13111c] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md ${isDeleteModalClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                <p className="text-gray-300 mt-2">
                    Are you sure you want to delete the section <strong className="text-red-400">{deletingUnit.title}</strong>? This will also delete all topics within it. This action cannot be undone.
                </p>
                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={handleCloseDeleteModal} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={handleConfirmDelete} className="btn bg-red-600 hover:bg-red-700 text-white border-transparent shadow-lg shadow-red-600/30 hover:shadow-red-600/40">
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        modalRoot
      )}
    </>
  );
};

export default SyllabusView;
