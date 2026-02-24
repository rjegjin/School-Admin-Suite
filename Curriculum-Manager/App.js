const { useState, useEffect } = React;

// Lucide 아이콘 컴포넌트
const LucideIcon = ({ name, className }) => {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [name]);
    return <i data-lucide={name} className={className}></i>;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('preview'); 

  // --- 진도 관리 데이터 (Grade 3 Science - 2026-mid3-Chem Ref) ---
  const LESSONS = [
    { id: 1, title: '물리 변화와 화학 변화', desc: '물질의 성질은 변하지 않음' },
    { id: 2, title: '화학 반응식 만들기', desc: '화학 반응을 기호로 표현' },
    { id: 3, title: '질량 보존 법칙', desc: '반응 전후 질량은 같다' },
    { id: 4, title: '일정 성분비 법칙', desc: '화합물 구성 비율 일정' },
    { id: 5, title: '기체 반응 법칙', desc: '기체 사이의 부피비' },
    { id: 6, title: '에너지 출입', desc: '발열 반응과 흡열 반응' }
  ];
  
  const CLASSES_3 = Array.from({length: 14}, (_, i) => `3-${i+1}`);
  
  const [progress, setProgress] = useState(() => {
    // 로컬 스토리지에서 불러오기 시도, 없으면 기본값
    const saved = localStorage.getItem('science_progress_2026');
    if (saved) return JSON.parse(saved);
    
    const initial = {};
    CLASSES_3.forEach(c => initial[c] = 1); 
    return initial;
  });

  // 진도 변경 핸들러
  const updateProgress = (cls, delta) => {
    setProgress(prev => {
      const current = prev[cls] || 1;
      const next = Math.min(Math.max(current + delta, 1), LESSONS.length);
      const newState = { ...prev, [cls]: next };
      localStorage.setItem('science_progress_2026', JSON.stringify(newState)); // 저장
      return newState;
    });
  };

  // --- 기존 시수 배정 데이터 ---
  const COLORS = {
     topic: 'bg-green-100 text-green-800 border-green-300',
     sciA: 'bg-blue-100 text-blue-800 border-blue-300',
     sciB: 'bg-indigo-100 text-indigo-800 border-indigo-300',
     sci: 'bg-sky-100 text-sky-800 border-sky-300',
     cr: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  const teachers = [
    { 
      id: 1, name: '이채현', class: '1-8', total: 18, sign: '이채현',
      schedules: [
        { grade: 1, start: 1, end: 14, text: '주제선택(6)', style: COLORS.topic },
        { grade: 1, start: 7, end: 8, text: '과학(4)', style: COLORS.sci },
        { grade: 1, start: 11, end: 14, text: '과학(8)', style: COLORS.sci }
      ]
    },
    { 
      id: 2, name: '박주현', class: '부장', total: 12, sign: '',
      schedules: [
        { grade: 1, start: 1, end: 6, text: '과학(12)', style: COLORS.sci }
      ]
    },
    { 
      id: 3, name: '박혜은', class: '', total: 18, sign: '박혜은',
      schedules: [
        { grade: 2, start: 1, end: 4, text: '과학B(8)', style: COLORS.sciB },
        { grade: 3, start: 10, end: 14, text: '과학B(10)', style: COLORS.sciB }
      ]
    },
    { 
      id: 4, name: '고혜정', class: '2-11', total: 18, sign: '고혜정',
      schedules: [
        { grade: 2, start: 5, end: 13, text: '과학B(18)', style: COLORS.sciB }
      ]
    },
    { 
      id: 5, name: '정연주', class: '부장', total: 16, sign: '정연주',
      schedules: [
        { grade: 2, start: 10, end: 12, text: '과학A(6)', style: COLORS.sciA },
        { grade: 3, start: 10, end: 14, text: '과학A(10)', style: COLORS.sciA }
      ]
    },
    { 
      id: 6, name: '조규상', class: '창체', total: 18, sign: '조규상',
      schedules: [
        { grade: 1, start: 1, end: 14, text: '주제선택(6)', style: COLORS.topic },
        { grade: 2, start: 13, end: 15, text: '과학A(6)', style: COLORS.sciA },
        { grade: 2, start: 14, end: 15, text: '과학B(4)', style: COLORS.sciB, offsetY: 22 },
        { grade: 3, start: 1, end: 14, text: '창체(2)', style: COLORS.cr }
      ]
    },
    { 
      id: 10, name: '정명현', class: '3-5', total: 19, sign: '정명현',
      schedules: [
        { grade: 3, start: 1, end: 9, text: '과학A(18)', style: COLORS.sciA },
        { grade: 3, start: 1, end: 14, text: '창체(1)', style: COLORS.cr, offsetY: 22 }
      ]
    },
    { 
      id: 7, name: '신규1', class: '2-1', total: 18, sign: '',
      schedules: [
        { grade: 2, start: 1, end: 9, text: '과학A(18)', style: COLORS.sciA }
      ]
    },
    { 
      id: 8, name: '신규2', class: '3-10', total: 19, sign: '',
      schedules: [
        { grade: 3, start: 1, end: 9, text: '과학B(18)', style: COLORS.sciB },
        { grade: 3, start: 1, end: 14, text: '창체(1)', style: COLORS.cr, offsetY: 22 }
      ]
    },
    { 
      id: 9, name: '강사', class: '', total: 10, sign: '',
      schedules: [
        { grade: 1, start: 1, end: 14, text: '주제선택(6)', style: COLORS.topic },
        { grade: 1, start: 9, end: 10, text: '과학(4)', style: COLORS.sci, offsetY: 22 }
      ]
    }
  ];

  const GRADES = [
    { grade: 1, classes: 14, label: '1학년', unit: '2+(1)' },
    { grade: 2, classes: 15, label: '2학년', unit: '4' },
    { grade: 3, classes: 14, label: '3학년', unit: '4' }
  ];

  const renderSchedules = (teacher, gradeConfig) => {
    return teacher.schedules
      .filter(s => s.grade === gradeConfig.grade)
      .map((s, idx) => {
        const startCol = s.start;
        const endCol = s.end;
        const width = `calc(${(endCol - startCol + 1) * 100}% / ${gradeConfig.classes})`;
        const left = `calc(${(startCol - 1) * 100}% / ${gradeConfig.classes})`;
        const topPos = s.offsetY ? `${s.offsetY}px` : '4px';
        const height = '18px'; 

        return (
          <div 
            key={idx}
            className={`absolute flex items-center justify-center text-[10px] font-bold border rounded-sm overflow-hidden z-10 shadow-sm ${s.style}`}
            style={{ left, width, top: topPos, height }}
            title={`${teacher.name} - ${s.text}`}
          >
            {s.text}
          </div>
        );
      });
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(teachers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', '2026_science_hours.json');
    linkElement.click();
  };

  const stats = {
      totalSci: teachers.reduce((acc, t) => acc + t.total, 0),
      count: teachers.length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        
        {/* Top Bar */}
        <div className="bg-slate-800 text-white p-3 flex justify-between items-center print:hidden">
          <div className="flex items-center space-x-2">
            <LucideIcon name="layout" className="w-5 h-5 text-blue-400" />
            <span className="font-bold">2026 과학과 시수 배정 & 진도</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('preview')} className={`px-3 py-1 rounded text-sm ${activeTab === 'preview' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
              <LucideIcon name="eye" className="w-4 h-4 inline mr-1" /> 스캔뷰
            </button>
            <button onClick={() => setActiveTab('data')} className={`px-3 py-1 rounded text-sm ${activeTab === 'data' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
              <LucideIcon name="layout-dashboard" className="w-4 h-4 inline mr-1" /> 대시보드
            </button>
            <button onClick={() => setActiveTab('progress')} className={`px-3 py-1 rounded text-sm ${activeTab === 'progress' ? 'bg-cyan-600' : 'hover:bg-slate-700'}`}>
              <LucideIcon name="bar-chart-2" className="w-4 h-4 inline mr-1" /> 진도표
            </button>
            <button onClick={exportJSON} className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-700">
              <LucideIcon name="save" className="w-4 h-4 inline mr-1" /> 저장
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto print:p-0">
          {activeTab === 'preview' ? (
            <div className="min-w-[1000px] bg-white text-black font-sans select-none">
              <div className="flex justify-between items-end mb-6 border-b-2 border-black pb-4">
                 <h1 className="text-3xl font-serif font-bold tracking-widest">2026학년도 과학과 수업 배정표</h1>
                 <div className="text-right">
                     <p className="font-bold">과목: 과학</p>
                     <p className="text-sm text-gray-500">2026.02.10 기준</p>
                 </div>
              </div>
              <div className="border border-black shadow-lg">
                <div className="flex text-center text-xs border-b border-black bg-slate-100 font-bold">
                  <div className="w-24 border-r border-black flex items-center justify-center h-12">성명 (반)</div>
                  {GRADES.map((g, i) => (
                    <div key={g.grade} className={`flex-1 flex flex-col border-r border-black last:border-r-0`}>
                      <div className="border-b border-gray-300 py-1 bg-slate-200">{g.label} ({g.unit})</div>
                      <div className="flex h-6">
                        {Array.from({length: g.classes}).map((_, idx) => (
                          <div key={idx} className="flex-1 border-r border-gray-300 last:border-r-0 flex items-center justify-center text-[9px] text-gray-500">
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="w-12 border-l border-black flex items-center justify-center">계</div>
                </div>
                {teachers.map((t, rowIdx) => (
                  <div key={t.id} className="flex text-xs border-b border-gray-300 h-12 hover:bg-blue-50 relative group">
                    <div className="w-24 border-r border-black flex flex-col justify-center px-2 bg-white z-20 group-hover:bg-blue-50">
                      <div className="flex items-center justify-between">
                         <span className="font-bold text-sm text-slate-800">{t.name}</span>
                         {t.class && <span className="text-[10px] bg-slate-200 px-1 rounded">{t.class}</span>}
                      </div>
                    </div>
                    {GRADES.map((g) => (
                      <div key={g.grade} className="flex-1 relative border-r border-black last:border-r-0">
                        <div className="absolute inset-0 flex">
                          {Array.from({length: g.classes}).map((_, idx) => (
                            <div key={idx} className="flex-1 border-r border-dashed border-gray-200 last:border-r-0"></div>
                          ))}
                        </div>
                        <div className="absolute inset-0 w-full h-full">
                           {renderSchedules(t, g)}
                        </div>
                      </div>
                    ))}
                    <div className="w-12 border-l border-black flex items-center justify-center font-bold bg-slate-50 text-slate-700 z-20">
                      {t.total}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-xs">
                 <div className="flex items-center"><span className="w-3 h-3 bg-blue-100 border border-blue-300 mr-1"></span> 과학A</div>
                 <div className="flex items-center"><span className="w-3 h-3 bg-indigo-100 border border-indigo-300 mr-1"></span> 과학B</div>
                 <div className="flex items-center"><span className="w-3 h-3 bg-green-100 border border-green-300 mr-1"></span> 주제선택</div>
                 <div className="flex items-center"><span className="w-3 h-3 bg-orange-100 border border-orange-300 mr-1"></span> 창체</div>
              </div>
            </div>
          ) : activeTab === 'data' ? (
            <div className="space-y-6">
                 <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-100">
                        <div className="text-gray-500 text-sm">전체 교사</div>
                        <div className="text-2xl font-bold text-blue-600">{stats.count}명</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-indigo-100">
                        <div className="text-gray-500 text-sm">전체 배정 시수</div>
                        <div className="text-2xl font-bold text-indigo-600">{stats.totalSci}시간</div>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {teachers.map((t) => (
                     <div key={t.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition border-l-4 border-l-blue-500">
                       <div className="flex justify-between items-start mb-3">
                         <h3 className="text-lg font-bold flex items-center">
                           <LucideIcon name="user" className="w-4 h-4 mr-2 text-blue-500" /> {t.name}
                         </h3>
                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold uppercase">
                           {t.class || '교과'}
                         </span>
                       </div>
                       <div className="space-y-2 mb-3">
                          {t.schedules.map((s, i) => (
                              <div key={i} className={`text-xs px-2 py-1 rounded border flex justify-between ${s.style}`}>
                                  <span>{s.grade}학년 {s.text}</span>
                                  <span className="font-bold">{s.end - s.start + 1}반</span>
                              </div>
                          ))}
                       </div>
                       <div className="flex justify-between items-center pt-3 border-t">
                           <span className="text-sm text-gray-500">주당 총 수업</span>
                           <span className="text-xl font-bold text-slate-800">{t.total}<span className="text-xs font-normal ml-1">시간</span></span>
                       </div>
                     </div>
                   ))}
                 </div>
            </div>
          ) : (
             /* --- Progress Tab (진도표) --- */
             <div className="space-y-8">
                 <div className="bg-cyan-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                     <div className="relative z-10">
                         <h2 className="text-3xl font-black mb-2">3학년 과학 진도 현황</h2>
                         <p className="text-cyan-200">화학 반응의 규칙 (Lesson 1 ~ 6)</p>
                     </div>
                     <div className="absolute right-0 top-0 h-full w-1/3 bg-cyan-800 transform skew-x-12 opacity-50"></div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                     {CLASSES_3.map((cls) => {
                         const currentLessonId = progress[cls] || 1;
                         const lesson = LESSONS.find(l => l.id === currentLessonId) || LESSONS[0];
                         return (
                             <div key={cls} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                                 <div className="bg-slate-50 border-b p-3 flex justify-between items-center">
                                     <span className="font-black text-slate-700 text-lg">{cls}반</span>
                                     <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">Lesson {lesson.id}</span>
                                 </div>
                                 <div className="p-4 h-32 flex flex-col justify-center items-center text-center">
                                     <h3 className="font-bold text-slate-800 mb-1">{lesson.title}</h3>
                                     <p className="text-xs text-slate-500 line-clamp-2">{lesson.desc}</p>
                                 </div>
                                 <div className="bg-slate-50 p-2 border-t flex justify-between gap-2">
                                     <button 
                                         onClick={() => updateProgress(cls, -1)}
                                         className="flex-1 py-2 bg-white border rounded hover:bg-slate-100 text-slate-500 disabled:opacity-50"
                                         disabled={currentLessonId <= 1}
                                     >
                                         <LucideIcon name="chevron-left" className="w-4 h-4 mx-auto" />
                                     </button>
                                     <button 
                                         onClick={() => updateProgress(cls, 1)}
                                         className="flex-1 py-2 bg-cyan-600 border border-cyan-600 rounded text-white hover:bg-cyan-700 disabled:opacity-50 font-bold"
                                         disabled={currentLessonId >= LESSONS.length}
                                     >
                                         <LucideIcon name="chevron-right" className="w-4 h-4 mx-auto" />
                                     </button>
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
