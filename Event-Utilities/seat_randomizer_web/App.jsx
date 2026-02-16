import React, { useState, useEffect } from 'react';
import { Shuffle, Users, Settings, UserMinus, Monitor } from 'lucide-react';

/**
 * 3학년 3반 배치 설정 데이터 (UI용)
 */
const CLASS_CONFIG = {
  students: [
    { n: "김나현", g: "여" }, { n: "김민재", g: "남" }, { n: "김승원", g: "남" },
    { n: "김아율", g: "여" }, { n: "김지윤", g: "여" }, { n: "김채연", g: "여" },
    { n: "문도영", g: "남" }, { n: "박건우", g: "남" }, { n: "박영민", g: "남" },
    { n: "박은빈", g: "여" }, { n: "박정익", g: "남" }, { n: "배유원", g: "여" },
    { n: "송인유", g: "여" }, { n: "심민겸", g: "남" }, { n: "우혜준", g: "여" },
    { n: "이라엘", g: "여" }, { n: "이예닮", g: "여" }, { n: "이재준", g: "남" },
    { n: "이준우", g: "남" }, { n: "이지훈", g: "남" }, { n: "이초명", g: "남" },
    { n: "이태희", g: "남" }, { n: "이해승", g: "남" }, { n: "임효림", g: "여" },
    { n: "장연우", g: "여" }, { n: "전호윤", g: "남" }, { n: "정주현", g: "여" },
    { n: "정예원", g: "여" }, { n: "홍서준", g: "남" }
  ],
  forbiddenGroups: [
    ["홍서준", "송인유", "장연우"],
    ["김민재", "이재준"]
  ]
};

const App = () => {
  const [seats, setSeats] = useState(CLASS_CONFIG.students);
  const [cols, setCols] = useState(6);
  const [isShuffling, setIsShuffling] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // 알고리즘: 인접성 체크 (상하좌우)
  const isValid = (list, columns) => {
    for (let i = 0; i < list.length; i++) {
      const current = list[i].n;
      const myGroup = CLASS_CONFIG.forbiddenGroups.find(g => g.includes(current));
      if (!myGroup) continue;

      const neighbors = [];
      if (i % columns > 0) neighbors.push(i - 1); // 좌
      if (i % columns < columns - 1) neighbors.push(i + 1); // 우
      if (i >= columns) neighbors.push(i - columns); // 상
      if (i + columns < list.length) neighbors.push(i + columns); // 하

      for (let nIdx of neighbors) {
        if (myGroup.includes(list[nIdx].n)) return false;
      }
    }
    return true;
  };

  const shuffleAction = () => {
    setIsShuffling(true);
    
    setTimeout(() => {
      let finalResult = null;
      let count = 0;
      const maxAttempts = 2000;

      while (count < maxAttempts) {
        let candidate = [];
        
        if (cols === 6) {
          // 동성 짝꿍 로직
          const males = CLASS_CONFIG.students.filter(s => s.g === "남").sort(() => Math.random() - 0.5);
          const females = CLASS_CONFIG.students.filter(s => s.g === "여").sort(() => Math.random() - 0.5);
          
          let pairs = [];
          for (let i = 0; i < males.length; i += 2) {
            pairs.push(males[i+1] ? [males[i], males[i+1]] : [males[i]]);
          }
          for (let i = 0; i < females.length; i += 2) {
            pairs.push(females[i+1] ? [females[i], females[i+1]] : [females[i]]);
          }
          
          pairs.sort(() => Math.random() - 0.5);
          candidate = pairs.flat();
        } else {
          candidate = [...CLASS_CONFIG.students].sort(() => Math.random() - 0.5);
        }

        if (isValid(candidate, cols)) {
          finalResult = candidate;
          break;
        }
        count++;
      }

      if (finalResult) {
        setSeats(finalResult);
        setAttempts(count);
      } else {
        alert("조건을 만족하는 배치를 찾을 수 없습니다. 제약 조건을 완화해주세요.");
      }
      setIsShuffling(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-blue-500 font-bold tracking-widest text-sm">
              <Monitor size={16} /> 3-3 CLASSROOM ADMIN
            </div>
            <h1 className="text-5xl font-black tracking-tight">
              Seat <span className="text-blue-600 italic">Architect</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-neutral-900 p-2 rounded-2xl border border-neutral-800">
            <div className="flex flex-col px-3">
              <span className="text-[10px] text-neutral-500 font-bold uppercase">Layout Mode</span>
              <select 
                value={cols} 
                onChange={(e) => setCols(parseInt(e.target.value))}
                className="bg-transparent text-sm font-bold outline-none cursor-pointer"
              >
                <option value={5} className="bg-neutral-900">5 Columns (Individual)</option>
                <option value={6} className="bg-neutral-900">6 Columns (Gender-Pairs)</option>
              </select>
            </div>
            <button 
              onClick={shuffleAction}
              disabled={isShuffling}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isShuffling ? 'bg-neutral-800 text-neutral-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 active:scale-95'
              }`}
            >
              {isShuffling ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : <Shuffle size={18} />}
              {isShuffling ? '검증 중...' : 'SHUFFLE'}
            </button>
          </div>
        </header>

        {/* Classroom Container */}
        <div className="relative bg-neutral-900/50 rounded-[40px] border border-neutral-800 p-8 md:p-16 shadow-2xl">
          {/* Blackboard Area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-800 border-2 border-neutral-700 px-12 py-3 rounded-2xl shadow-xl">
            <span className="text-xs font-black text-neutral-500 tracking-[0.3em] uppercase">Blackboard</span>
          </div>

          {/* Seats Grid */}
          <div 
            className="grid gap-4 transition-all duration-500"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {seats.map((student, idx) => {
              // 짝꿍 여부 판단 (6열일 때 0-1, 2-3, 4-5가 한 쌍)
              const isPairStart = cols === 6 && idx % 2 === 0;
              const isPairEnd = cols === 6 && idx % 2 === 1;
              
              return (
                <div 
                  key={`${student.n}-${idx}`}
                  className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 transform
                    ${isShuffling ? 'animate-pulse scale-95 opacity-50 blur-[1px]' : 'scale-100 opacity-100'}
                    ${isPairStart ? 'rounded-r-none border-r-0' : ''}
                    ${isPairEnd ? 'rounded-l-none border-l-0' : ''}
                    ${student.g === '남' ? 'bg-blue-950/20 border-blue-900/30' : 'bg-pink-950/20 border-pink-900/30'}
                    hover:border-white/40 hover:z-20 hover:shadow-2xl
                  `}
                >
                  <div className="flex flex-col items-center justify-center min-h-[60px]">
                    <span className="text-[10px] font-bold text-neutral-600 mb-2 uppercase tracking-tighter">Seat {idx + 1}</span>
                    <span className="text-xl font-black tracking-tight">{student.n}</span>
                    <span className={`text-[10px] mt-1 font-bold ${student.g === '남' ? 'text-blue-400' : 'text-pink-400'}`}>
                      {student.g}
                    </span>
                  </div>
                  
                  {/* Pair Connection Marker */}
                  {isPairStart && idx < seats.length - 1 && (
                    <div className="absolute top-1/2 right-0 w-[2px] h-12 -translate-y-1/2 bg-neutral-800/50 z-10" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Environmental Indicators */}
          <div className="mt-16 flex justify-between items-center text-neutral-600 font-bold text-[10px] uppercase tracking-widest border-t border-neutral-800 pt-8">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Male Pairs</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div> Female Pairs</span>
            </div>
            <div className="flex gap-12">
              <span>Door Side</span>
              <span>Window Side</span>
            </div>
          </div>
        </div>

        {/* Stats & Info */}
        <div className="mt-8 flex justify-between items-center text-neutral-500 text-xs px-4">
          <p>Verified in <strong>{attempts}</strong> iterations.</p>
          <p>Current Grouping Constraints: <strong>{CLASS_CONFIG.forbiddenGroups.length}</strong> active groups.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
