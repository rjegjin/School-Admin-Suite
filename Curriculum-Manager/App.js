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

// 재사용 가능한 모달 컴포넌트
const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          <LucideIcon name="x" className="w-6 h-6" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('preview'); 

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
    const saved = localStorage.getItem('science_progress_2026');
    if (saved) return JSON.parse(saved);
    const initial = {};
    CLASSES_3.forEach(c => initial[c] = 1); 
    return initial;
  });

  const updateProgress = (cls, delta) => {
    setProgress(prev => {
      const current = prev[cls] || 1;
      const next = Math.min(Math.max(current + delta, 1), LESSONS.length);
      const newState = { ...prev, [cls]: next };
      localStorage.setItem('science_progress_2026', JSON.stringify(newState));
      return newState;
    });
  };

  const COLORS = {
     topic: 'bg-green-100 text-green-800 border-green-300',
     sciA: 'bg-blue-100 text-blue-800 border-blue-300',
     sciB: 'bg-indigo-100 text-indigo-800 border-indigo-300',
     sci: 'bg-sky-100 text-sky-800 border-sky-300',
     cr: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  const INITIAL_TEACHERS = [
    { id: 1, name: '이채현', class: '1-8', targetHours: 18, sign: '이채현', schedules: [{ grade: 1, start: 1, end: 14, text: '주제선택(6)', style: COLORS.topic }, { grade: 1, start: 7, end: 8, text: '과학(4)', style: COLORS.sci }, { grade: 1, start: 11, end: 14, text: '과학(8)', style: COLORS.sci }] },
    { id: 2, name: '박주현', class: '부장', targetHours: 12, sign: '', schedules: [{ grade: 1, start: 1, end: 6, text: '과학(12)', style: COLORS.sci }] },
    { id: 3, name: '박혜은', class: '', targetHours: 18, sign: '박혜은', schedules: [{ grade: 2, start: 1, end: 4, text: '과학B(8)', style: COLORS.sciB }, { grade: 3, start: 10, end: 14, text: '과학B(10)', style: COLORS.sciB }] },
    { id: 4, name: '고혜정', class: '2-11', targetHours: 18, sign: '고혜정', schedules: [{ grade: 2, start: 5, end: 13, text: '과학B(18)', style: COLORS.sciB }] },
    { id: 5, name: '정연주', class: '부장', targetHours: 16, sign: '정연주', schedules: [{ grade: 2, start: 10, end: 12, text: '과학A(6)', style: COLORS.sciA }, { grade: 3, start: 10, end: 14, text: '과학A(10)', style: COLORS.sciA }] },
    { id: 6, name: '조규상', class: '창체', targetHours: 18, sign: '조규상', schedules: [{ grade: 1, start: 1, end: 14, text: '주제선택(6)', style: COLORS.topic }, { grade: 2, start: 13, end: 15, text: '과학A(6)', style: COLORS.sciA }, { grade: 2, start: 14, end: 15, text: '과학B(4)', style: COLORS.sciB, offsetY: 22 }, { grade: 3, start: 1, end: 14, text: '창체(2)', style: COLORS.cr }] },
    { id: 10, name: '정명현', class: '3-5', targetHours: 19, sign: '정명현', schedules: [{ grade: 3, start: 1, end: 9, text: '과학A(18)', style: COLORS.sciA }, { grade: 3, start: 1, end: 14, text: '창체(1)', style: COLORS.cr, offsetY: 22 }] },
    { id: 7, name: '신규1', class: '2-1', targetHours: 18, sign: '', schedules: [{ grade: 2, start: 1, end: 9, text: '과학A(18)', style: COLORS.sciA }] },
    { id: 8, name: '신규2', class: '3-10', targetHours: 19, sign: '', schedules: [{ grade: 3, start: 1, end: 9, text: '과학B(18)', style: COLORS.sciB }, { grade: 3, start: 1, end: 14, text: '창체(1)', style: COLORS.cr, offsetY: 22 }] },
    { id: 9, name: '강사', class: '', targetHours: 10, sign: '', schedules: [{ grade: 1, start: 1, end: 14, text: '주제선택(6)', style: COLORS.topic }, { grade: 1, start: 9, end: 10, text: '과학(4)', style: COLORS.sci, offsetY: 22 }] }
  ];

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('science_teachers_2026');
    if (saved) return JSON.parse(saved);
    return INITIAL_TEACHERS;
  });

  useEffect(() => {
    localStorage.setItem('science_teachers_2026', JSON.stringify(teachers));
  }, [teachers]);

  const GRADES = [
    { grade: 1, classes: 14, label: '1학년', unit: '2+(1)' },
    { grade: 2, classes: 15, label: '2학년', unit: '4' },
    { grade: 3, classes: 14, label: '3학년', unit: '4' }
  ];

  // 계산된 교사 데이터 (현재 시수 자동 계산)
  const computedTeachers = teachers.map(t => {
      let currentTotal = 0;
      t.schedules.forEach(s => {
          const match = s.text.match(/\((\d+)\)/);
          if (match) currentTotal += parseInt(match[1]);
      });
      return { ...t, total: currentTotal };
  });

  // 상태: 모달
  const [editingTeacher, setEditingTeacher] = useState(null); // 교사 정보 수정 모달
  const [editingSchedule, setEditingSchedule] = useState(null); // 시수 배정 수정 모달 { teacherId, scheduleId, schedule }

  const handleSaveTeacher = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const newTeacher = {
          id: editingTeacher.id || Date.now(),
          name: fd.get('name'),
          class: fd.get('class'),
          targetHours: parseInt(fd.get('targetHours')),
          schedules: editingTeacher.schedules || []
      };

      if (teachers.find(t => t.id === newTeacher.id)) {
          setTeachers(teachers.map(t => t.id === newTeacher.id ? newTeacher : t));
      } else {
          setTeachers([...teachers, newTeacher]);
      }
      setEditingTeacher(null);
  };

  const handleDeleteTeacher = (id) => {
      if(confirm('이 교사를 삭제하시겠습니까?')) {
          setTeachers(teachers.filter(t => t.id !== id));
      }
  };

  const handleSaveSchedule = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const grade = parseInt(fd.get('grade'));
      const start = parseInt(fd.get('start'));
      const end = parseInt(fd.get('end'));
      const subject = fd.get('subject');
      const hoursPerClass = parseFloat(fd.get('hoursPerClass'));
      const styleKey = fd.get('style');
      const offsetY = parseInt(fd.get('offsetY')) || 0;

      const totalHours = Math.round((end - start + 1) * hoursPerClass);
      const text = `${subject}(${totalHours})`;

      const newSchedule = { grade, start, end, text, style: COLORS[styleKey], offsetY: offsetY > 0 ? offsetY : undefined };

      setTeachers(teachers.map(t => {
          if (t.id === editingSchedule.teacherId) {
              const newSchedules = [...t.schedules];
              if (editingSchedule.scheduleId !== null) {
                  newSchedules[editingSchedule.scheduleId] = newSchedule;
              } else {
                  newSchedules.push(newSchedule);
              }
              return { ...t, schedules: newSchedules };
          }
          return t;
      }));
      setEditingSchedule(null);
  };

  const handleDeleteSchedule = () => {
      setTeachers(teachers.map(t => {
          if (t.id === editingSchedule.teacherId) {
              const newSchedules = [...t.schedules];
              newSchedules.splice(editingSchedule.scheduleId, 1);
              return { ...t, schedules: newSchedules };
          }
          return t;
      }));
      setEditingSchedule(null);
  };

  // 자동 시수 배정 (초기화 및 백트래킹 모의 실행)
  const runAutoAlgorithm = () => {
      if(confirm('현재 배정된 모든 시수를 초기화하고 기본 규칙에 따라 자동 배정하시겠습니까? (이 기능은 데모입니다)')) {
          alert('자동 배정 알고리즘이 성공적으로 실행되었습니다. (데모)');
          setTeachers(INITIAL_TEACHERS);
      }
  };

  const renderSchedules = (teacher, gradeConfig) => {
    return teacher.schedules
      .map((s, idx) => ({ ...s, idx }))
      .filter(s => s.grade === gradeConfig.grade)
      .map((s) => {
        const startCol = s.start;
        const endCol = s.end;
        const width = `calc(${(endCol - startCol + 1) * 100}% / ${gradeConfig.classes})`;
        const left = `calc(${(startCol - 1) * 100}% / ${gradeConfig.classes})`;
        const topPos = s.offsetY ? `${s.offsetY}px` : '4px';
        const height = '18px'; 

        return (
          <div 
            key={s.idx}
            onClick={() => setEditingSchedule({ teacherId: teacher.id, scheduleId: s.idx, schedule: s })}
            className={`absolute flex items-center justify-center text-[10px] font-bold border rounded-sm overflow-hidden z-10 shadow-sm cursor-pointer hover:ring-2 hover:ring-black hover:z-30 transition-all ${s.style}`}
            style={{ left, width, top: topPos, height }}
            title={`${teacher.name} - ${s.text} (클릭하여 수정)`}
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

  const importJSON = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
          try {
              const data = JSON.parse(evt.target.result);
              setTeachers(data);
              alert('데이터를 성공적으로 불러왔습니다.');
          } catch(err) {
              alert('유효하지 않은 파일입니다.');
          }
      };
      reader.readAsText(file);
  };

  const stats = {
      totalSci: computedTeachers.reduce((acc, t) => acc + t.total, 0),
      count: computedTeachers.length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-[1400px] mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        
        {/* Top Bar */}
        <div className="bg-slate-800 text-white p-3 flex justify-between items-center print:hidden flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <LucideIcon name="layout" className="w-5 h-5 text-blue-400" />
            <span className="font-bold">2026 과학과 시수 배정 시스템</span>
          </div>
          <div className="flex space-x-2 flex-wrap">
            <button onClick={() => setActiveTab('preview')} className={`px-3 py-1 rounded text-sm ${activeTab === 'preview' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
              <LucideIcon name="eye" className="w-4 h-4 inline mr-1" /> 배정표 (스캔뷰)
            </button>
            <button onClick={() => setActiveTab('data')} className={`px-3 py-1 rounded text-sm ${activeTab === 'data' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
              <LucideIcon name="layout-dashboard" className="w-4 h-4 inline mr-1" /> 교사/시수 관리
            </button>
            <button onClick={() => setActiveTab('progress')} className={`px-3 py-1 rounded text-sm ${activeTab === 'progress' ? 'bg-cyan-600' : 'hover:bg-slate-700'}`}>
              <LucideIcon name="bar-chart-2" className="w-4 h-4 inline mr-1" /> 진도표
            </button>
            
            <span className="w-px h-6 bg-slate-600 mx-2"></span>

            <button onClick={runAutoAlgorithm} className="px-3 py-1 bg-purple-600 rounded text-sm hover:bg-purple-700">
              <LucideIcon name="cpu" className="w-4 h-4 inline mr-1" /> 자동 배정
            </button>
            
            <button onClick={() => document.getElementById('importFile').click()} className="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-700">
              <LucideIcon name="upload" className="w-4 h-4 inline mr-1" /> 로드
            </button>
            <input type="file" id="importFile" accept=".json" className="hidden" onChange={importJSON} />

            <button onClick={exportJSON} className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-700">
              <LucideIcon name="save" className="w-4 h-4 inline mr-1" /> 저장
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto print:p-0">
          {activeTab === 'preview' ? (
            <div className="min-w-[1000px] bg-white text-black font-sans select-none relative">
              <div className="flex justify-between items-end mb-6 border-b-2 border-black pb-4">
                 <h1 className="text-3xl font-serif font-bold tracking-widest">2026학년도 과학과 수업 배정표</h1>
                 <div className="text-right">
                     <p className="font-bold">과목: 과학</p>
                     <p className="text-sm text-gray-500">지능형 시수 시뮬레이터 적용</p>
                 </div>
              </div>
              
              <div className="mb-2 text-sm text-blue-600 font-bold print:hidden flex items-center bg-blue-50 p-2 rounded">
                  <LucideIcon name="info" className="w-4 h-4 mr-2" />
                  <span>배정 블록을 클릭하여 <b>수정/삭제</b>하세요. 빈 공간(점선)을 클릭하면 <b>새 배정</b>을 추가할 수 있습니다. 이름 클릭시 <b>교사 정보 수정</b>이 가능합니다.</span>
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
                  <div className="w-16 border-l border-black flex items-center justify-center">현재/목표</div>
                </div>
                {computedTeachers.map((t, rowIdx) => (
                  <div key={t.id} className="flex text-xs border-b border-gray-300 h-12 hover:bg-blue-50 relative group">
                    <div 
                      className="w-24 border-r border-black flex flex-col justify-center px-2 bg-white z-20 group-hover:bg-blue-50 cursor-pointer hover:underline text-blue-600"
                      onClick={() => setEditingTeacher(t)}
                      title="교사 정보 수정"
                    >
                      <div className="flex items-center justify-between">
                         <span className="font-bold text-sm text-slate-800">{t.name}</span>
                         {t.class && <span className="text-[10px] bg-slate-200 px-1 rounded text-black">{t.class}</span>}
                      </div>
                    </div>
                    {GRADES.map((g) => (
                      <div 
                        key={g.grade} 
                        className="flex-1 relative border-r border-black last:border-r-0 cursor-crosshair hover:bg-gray-100/50"
                        onClick={(e) => {
                            if (e.target === e.currentTarget || e.target.classList.contains('bg-transparent')) {
                                setEditingSchedule({ teacherId: t.id, scheduleId: null, schedule: { grade: g.grade, start: 1, end: 1, text: '', style: COLORS.sciA } });
                            }
                        }}
                      >
                        <div className="absolute inset-0 flex pointer-events-none">
                          {Array.from({length: g.classes}).map((_, idx) => (
                            <div key={idx} className="flex-1 border-r border-dashed border-gray-200 last:border-r-0 bg-transparent pointer-events-auto"></div>
                          ))}
                        </div>
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                           <div className="pointer-events-auto w-full h-full relative">
                             {renderSchedules(t, g)}
                           </div>
                        </div>
                      </div>
                    ))}
                    <div className={`w-16 border-l border-black flex flex-col items-center justify-center font-bold bg-slate-50 z-20 ${t.total > t.targetHours ? 'text-red-600' : t.total < t.targetHours ? 'text-orange-500' : 'text-green-600'}`}>
                      <span className="text-sm">{t.total}</span>
                      <span className="text-[9px] text-gray-500 font-normal">/ {t.targetHours}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-xs">
                 <div className="flex items-center"><span className="w-3 h-3 bg-blue-100 border border-blue-300 mr-1"></span> 과학A</div>
                 <div className="flex items-center"><span className="w-3 h-3 bg-indigo-100 border border-indigo-300 mr-1"></span> 과학B</div>
                 <div className="flex items-center"><span className="w-3 h-3 bg-sky-100 border border-sky-300 mr-1"></span> 과학 (통합)</div>
                 <div className="flex items-center"><span className="w-3 h-3 bg-green-100 border border-green-300 mr-1"></span> 주제선택</div>
                 <div className="flex items-center"><span className="w-3 h-3 bg-orange-100 border border-orange-300 mr-1"></span> 창체</div>
              </div>
            </div>
          ) : activeTab === 'data' ? (
            <div className="space-y-6">
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold text-slate-800">교사 및 시수 관리</h2>
                     <button onClick={() => setEditingTeacher({ name: '', class: '', targetHours: 18, schedules: [] })} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
                         <LucideIcon name="plus" className="w-4 h-4 inline mr-1" /> 새 교사 추가
                     </button>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-100">
                        <div className="text-gray-500 text-sm">전체 교사 수</div>
                        <div className="text-2xl font-bold text-blue-600">{stats.count}명</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-indigo-100">
                        <div className="text-gray-500 text-sm">전체 배정 시수</div>
                        <div className="text-2xl font-bold text-indigo-600">{stats.totalSci}시간</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-green-100">
                        <div className="text-gray-500 text-sm">평균 시수</div>
                        <div className="text-2xl font-bold text-green-600">{(stats.totalSci / stats.count).toFixed(1)}시간</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {computedTeachers.map((t) => (
                     <div key={t.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition border-l-4 border-l-blue-500 relative">
                       <div className="absolute top-2 right-2 flex space-x-1">
                           <button onClick={() => setEditingTeacher(t)} className="p-1 text-gray-400 hover:text-blue-600"><LucideIcon name="edit" className="w-4 h-4" /></button>
                           <button onClick={() => handleDeleteTeacher(t.id)} className="p-1 text-gray-400 hover:text-red-600"><LucideIcon name="trash-2" className="w-4 h-4" /></button>
                       </div>
                       <div className="flex justify-between items-start mb-3 mt-2">
                         <h3 className="text-lg font-bold flex items-center">
                           <LucideIcon name="user" className="w-4 h-4 mr-2 text-blue-500" /> {t.name}
                         </h3>
                         <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded font-bold uppercase">
                           {t.class || '교과전담'}
                         </span>
                       </div>
                       <div className="space-y-2 mb-3">
                          {t.schedules.length === 0 && <p className="text-xs text-gray-400">배정된 시수가 없습니다.</p>}
                          {t.schedules.map((s, i) => (
                              <div key={i} className={`text-xs px-2 py-1 rounded border flex justify-between ${s.style}`}>
                                  <span>{s.grade}학년 {s.start === s.end ? `${s.start}반` : `${s.start}~${s.end}반`}</span>
                                  <span className="font-bold">{s.text}</span>
                              </div>
                          ))}
                       </div>
                       <div className="flex justify-between items-center pt-3 border-t">
                           <span className="text-sm text-gray-500">배정/목표 시수</span>
                           <span className="text-lg font-bold text-slate-800">
                               <span className={t.total > t.targetHours ? 'text-red-600' : t.total < t.targetHours ? 'text-orange-500' : 'text-green-600'}>{t.total}</span>
                               <span className="text-xs font-normal text-gray-500 ml-1">/ {t.targetHours}</span>
                           </span>
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

      {/* 교사 추가/수정 모달 */}
      {editingTeacher && (
          <Modal title={editingTeacher.id ? '교사 정보 수정' : '새 교사 추가'} onClose={() => setEditingTeacher(null)}>
              <form onSubmit={handleSaveTeacher} className="space-y-4">
                  <div>
                      <label className="block text-sm font-bold mb-1">이름</label>
                      <input name="name" defaultValue={editingTeacher.name} required className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold mb-1">담당 학급 / 보직 (선택)</label>
                      <input name="class" defaultValue={editingTeacher.class} className="w-full border rounded p-2" placeholder="예: 3-5, 부장" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold mb-1">목표 주당 시수</label>
                      <input name="targetHours" type="number" defaultValue={editingTeacher.targetHours} required className="w-full border rounded p-2" />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                      <button type="button" onClick={() => setEditingTeacher(null)} className="px-4 py-2 border rounded hover:bg-gray-100">취소</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                  </div>
              </form>
          </Modal>
      )}

      {/* 시수 배정 추가/수정 모달 */}
      {editingSchedule && (
          <Modal title={editingSchedule.scheduleId !== null ? '배정 시수 수정' : '새 배정 시수 추가'} onClose={() => setEditingSchedule(null)}>
              <form onSubmit={handleSaveSchedule} className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                      <div>
                          <label className="block text-sm font-bold mb-1">학년</label>
                          <select name="grade" defaultValue={editingSchedule.schedule.grade} className="w-full border rounded p-2">
                              <option value="1">1학년</option>
                              <option value="2">2학년</option>
                              <option value="3">3학년</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1">시작 반</label>
                          <input name="start" type="number" min="1" max="15" defaultValue={editingSchedule.schedule.start} required className="w-full border rounded p-2" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1">끝 반</label>
                          <input name="end" type="number" min="1" max="15" defaultValue={editingSchedule.schedule.end} required className="w-full border rounded p-2" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <div>
                          <label className="block text-sm font-bold mb-1">과목명 (표시용)</label>
                          <input name="subject" defaultValue={editingSchedule.schedule.text ? editingSchedule.schedule.text.split('(')[0] : '과학A'} required className="w-full border rounded p-2" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1">반당 시수</label>
                          <input name="hoursPerClass" type="number" step="0.5" defaultValue="2" required className="w-full border rounded p-2" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <div>
                          <label className="block text-sm font-bold mb-1">스타일 (색상)</label>
                          <select name="style" defaultValue={Object.keys(COLORS).find(k => COLORS[k] === editingSchedule.schedule.style) || 'sciA'} className="w-full border rounded p-2">
                              <option value="sciA">과학A (파랑)</option>
                              <option value="sciB">과학B (남색)</option>
                              <option value="sci">과학통합 (하늘)</option>
                              <option value="topic">주제선택 (초록)</option>
                              <option value="cr">창체 (주황)</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1">세로 오프셋 (Y)</label>
                          <input name="offsetY" type="number" defaultValue={editingSchedule.schedule.offsetY || 0} placeholder="겹칠 경우 22" className="w-full border rounded p-2" />
                      </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                      {editingSchedule.scheduleId !== null ? (
                          <button type="button" onClick={handleDeleteSchedule} className="px-3 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">삭제</button>
                      ) : <div></div>}
                      <div className="flex gap-2">
                          <button type="button" onClick={() => setEditingSchedule(null)} className="px-4 py-2 border rounded hover:bg-gray-100">취소</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                      </div>
                  </div>
              </form>
          </Modal>
      )}

    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
