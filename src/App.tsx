import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, ChevronLeft, CheckCircle2, RotateCcw, ShieldCheck, Info, FileText, RefreshCw, Lock } from 'lucide-react';

// --- 비밀번호 설정 (공유할 분들에게 알려주세요) ---
const SITE_PASSWORD = "0817"; 

// 1. 상황제시형 발표 주제 데이터베이스
const PRESENTATION_TOPICS = [
  { id: 1, title: "아동학대 의심 신고 및 부모의 거부 상황", content: "아파트 인근 주민으로부터 아이의 비명소리가 들린다는 신고를 받고 출동했습니다. 현장 도착 시 부모는 '내 자식 교육하는 데 왜 간섭이냐'며 집 안으로 들어오는 것을 강력히 거부하고 있습니다. 아이의 모습은 보이지 않으나 문틈으로 집 안의 가재도구가 어지럽게 널려 있는 것이 확인됩니다. 경찰관으로서 법적 근거와 함께 현장 조치 방안을 발표하시오." },
  { id: 2, title: "스토킹 가해자의 피해자 주거지 침입 시도", content: "잠정 조치(접근금지) 명령이 내려진 스토킹 가해자가 피해자의 집 앞 복도에서 문을 두드리며 고함을 지르고 있다는 신고가 접수되었습니다. 피해자는 공포에 질려 집 안에서 나오지 못하고 있으며, 가해자는 술에 취해 대화가 불가능한 상태입니다. 주변 이웃들이 나와서 구경을 하고 있는 가운데, 가해자 검거 및 피해자 보호 방안에 대해 발표하시오." },
  { id: 3, title: "대규모 집회 중 긴급차량 통행로 확보", content: "도심 내 대규모 집회로 인해 왕복 6차선 도로가 모두 점거된 상황입니다. 이때 인근 병원으로 이송 중인 응급 환자가 탄 구급차가 집회 대열에 막혀 이동하지 못하고 있다는 지원 요청이 들어왔습니다. 집회 주최 측은 도로 점거의 정당성을 주장하며 비켜주지 않고 있습니다. 시민의 생명권과 집회의 자유가 충돌하는 현장에서 어떻게 대처할지 발표하시오." },
  { id: 4, title: "보이스피싱 현장 검거 및 증거 인멸 저지", content: "은행 직원의 신고로 현금 수거책으로 의심되는 인물을 은행 앞에서 대면했습니다. 경찰관을 확인한 피의자가 가지고 있던 가방을 던지고 도주하며 자신의 휴대전화를 바닥에 던져 파손하려고 시도합니다. 주변에 행인들이 많아 물리력 행사가 제한적인 상황에서 피의자 검거와 증거물 확보를 위한 조치 과정을 발표하시오." },
  { id: 5, title: "자살 암시자가 흉기를 들고 대치하는 상황", content: "생활고를 비관한 30대 남성이 옥상 난간에 걸터앉아 흉기를 자신의 목에 대고 투신하겠다고 위협 중입니다. 현장에는 이미 가족들이 도착해 오열하고 있어 남성의 흥분도가 매우 높습니다. 에어매트 설치가 어려운 지형적 특성이 있는 경우, 남성을 진정시키고 안전하게 구조하기 위한 경찰관으로서의 대화 전략과 조치 방안을 발표하시오." }
];

// 2. 꼬리질문 풀 (10개 중 5개 랜덤 추출됨)
const FOLLOWUP_POOL = [
  "현장 조치 중 본인의 안전과 시민의 안전 중 무엇을 최우선으로 하겠습니까?",
  "만약 상사가 법적 근거가 부족한 강제 수사를 지시한다면 어떻게 하시겠습니까?",
  "현장에서 흥분한 시민이 경찰관의 뺨을 때린다면 법적 조치를 하시겠습니까?",
  "조치 과정에서 발생할 수 있는 '과잉 진압' 논란에 대해 어떻게 방어하시겠습니까?",
  "피해자가 처벌을 원치 않는다고 할 경우, 경찰관으로서 어떻게 설득하시겠습니까?",
  "현장 상황이 언론에 보도되어 비난을 받는다면 본인의 사명감에 변화가 생기겠습니까?",
  "동료 경찰관이 현장에서 극심한 공포를 느껴 소극적으로 대처한다면 어떻게 하시겠습니까?",
  "조치 이후 결과가 좋지 않아 소송에 휘말린다면 경찰직을 계속 수행하실 수 있습니까?",
  "시민들이 경찰의 조치를 방해하며 촬영을 지속할 때 인권 보호 측면에서 어떻게 대처하겠습니까?",
  "이 사건을 처리하면서 가장 중요하게 지켜야 할 경찰 헌장의 가치는 무엇입니까?"
];

type ViewMode = 'overview' | 'presentation' | 'followup' | 'review';

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isError, setIsError] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(PRESENTATION_TOPICS[0]);
  const [selectedFollowups, setSelectedFollowups] = useState<string[]>([]);
  const [currentFollowupIdx, setCurrentFollowupIdx] = useState(0);
  const [presentationAudio, setPresentationAudio] = useState<string | null>(null);
  const [followupAudios, setFollowupAudios] = useState<{question: string, url: string}[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => { setupRandomInterview(); }, []);

  const setupRandomInterview = () => {
    const randomTopic = PRESENTATION_TOPICS[Math.floor(Math.random() * PRESENTATION_TOPICS.length)];
    setCurrentTopic(randomTopic);
    const shuffled = [...FOLLOWUP_POOL].sort(() => 0.5 - Math.random());
    setSelectedFollowups(shuffled.slice(0, 5));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SITE_PASSWORD) {
      setIsAuthorized(true);
    } else {
      setIsError(true);
      setPasswordInput('');
      setTimeout(() => setIsError(false), 2000);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      handleCompleteStep();
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isTimerRunning, secondsLeft]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const stopRecording = (type: 'main' | 'followup') => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        if (type === 'main') setPresentationAudio(url);
        else setFollowupAudios(prev => [...prev, { question: selectedFollowups[currentFollowupIdx], url }]);
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  const handleCompleteStep = () => {
    if (viewMode === 'presentation') {
      stopRecording('main');
      setIsTimerRunning(false);
      setTimeout(() => {
        setViewMode('followup');
        setCurrentFollowupIdx(0);
        setSecondsLeft(60);
        setIsTimerRunning(true);
        startRecording();
      }, 500);
    } else if (viewMode === 'followup') {
      stopRecording('followup');
      if (currentFollowupIdx < selectedFollowups.length - 1) {
        setTimeout(() => {
          setCurrentFollowupIdx(prev => prev + 1);
          setSecondsLeft(60);
          setIsTimerRunning(true);
          startRecording();
        }, 500);
      } else {
        setIsTimerRunning(false);
        setViewMode('review');
      }
    }
  };

  const startInterview = () => {
    setPresentationAudio(null);
    setFollowupAudios([]);
    setSecondsLeft(180);
    setViewMode('presentation');
    setIsTimerRunning(true);
    startRecording();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 antialiased">
        <div className="max-w-sm w-full space-y-8 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
              <Lock className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tighter uppercase">Authorized Access</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">면접 시스템 접속을 위해 비밀번호를 입력하세요.</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••"
              className={`w-full px-5 py-4 bg-slate-50 border ${isError ? 'border-red-500 animate-shake' : 'border-slate-200'} rounded-2xl text-center text-3xl font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-200`}
            />
            {isError && <p className="text-red-500 text-xs font-bold">비밀번호가 일치하지 않습니다.</p>}
            <button className="w-full bg-slate-950 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">접속하기</button>
          </form>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Security Checkpoint</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100">
      {viewMode === 'overview' && (
        <main className="max-w-lg mx-auto px-6 py-10 flex flex-col min-h-screen bg-white">
          <header className="mb-12 flex justify-between items-center border-b border-slate-100 pb-8 text-slate-950 font-black text-2xl tracking-tighter">
            <h1>경찰 면접 시뮬레이터</h1>
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </header>
          <div className="bg-blue-50 border border-blue-200 p-8 rounded-3xl mb-12 relative overflow-hidden">
             <div className="relative">
                <div className="text-blue-700 font-bold text-sm mb-2 uppercase tracking-widest font-mono">Status: Ready</div>
                <div className="font-bold text-2xl text-blue-900 tracking-tight">상황제시형 발표면접</div>
                <p className="text-xs mt-2 text-blue-700/60 font-medium leading-relaxed">3분 발표와 5개의 랜덤 꼬리질문으로 실전을 대비하세요.</p>
             </div>
          </div>
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <FileText className="w-4 h-4" /> <span>Topic Preview</span>
            </div>
            <button onClick={setupRandomInterview} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors active:scale-95">
              <RefreshCw className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">주제 재설정</span>
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-100/50 flex-grow mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
            <div className="pl-3">
              <h2 className="text-lg font-bold text-slate-950 mb-5 leading-snug">{currentTopic.title}</h2>
              <div className="bg-slate-50 rounded-2xl p-5 text-slate-700 leading-relaxed text-sm h-[320px] overflow-y-auto border border-slate-100 italic">
                {currentTopic.content}
              </div>
            </div>
          </div>
          <button onClick={startInterview} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">면접 시작하기</button>
        </main>
      )}

      {viewMode === 'presentation' && (
        <main className="max-w-lg mx-auto min-h-screen bg-white p-8 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest animate-pulse">
              <div className="w-2 h-2 bg-red-600 rounded-full" /> Recording
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">Phase 01</span>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-950 mb-4">{currentTopic.title}</h2>
            <p className="text-sm text-slate-700 leading-relaxed max-h-[220px] overflow-y-auto pr-2">{currentTopic.content}</p>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center">
             <div className="text-[110px] font-mono font-bold text-blue-600 tracking-tighter leading-none tabular-nums">{formatTime(secondsLeft)}</div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full mt-12 overflow-hidden max-w-[280px] mx-auto">
                <div className="h-full bg-blue-600 transition-all duration-1000 ease-linear" style={{width: `${(secondsLeft/180)*100}%`}}></div>
             </div>
          </div>
          <button onClick={handleCompleteStep} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg mt-6">답변 완료</button>
        </main>
      )}

      {viewMode === 'followup' && (
        <main className="max-w-md mx-auto min-h-screen bg-white p-10 flex flex-col justify-center shadow-2xl">
          <div className="mb-12 text-blue-700 font-bold text-sm tracking-widest uppercase font-mono">Follow-up {currentFollowupIdx + 1} / 5</div>
          <h2 className="text-2xl font-bold mb-20 leading-snug text-slate-950">"{selectedFollowups[currentFollowupIdx]}"</h2>
          <div className="flex items-center gap-6 mb-24">
            <span className="text-6xl font-mono font-bold text-blue-600 tabular-nums">{formatTime(secondsLeft)}</span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{width: `${(secondsLeft/60)*100}%`}}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <button onClick={handleCompleteStep} className="bg-slate-100 text-slate-500 py-4 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">건너뛰기</button>
            <button onClick={handleCompleteStep} className="bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100">답변 완료</button>
          </div>
        </main>
      )}

      {viewMode === 'review' && (
        <main className="max-w-2xl mx-auto px-6 py-12 space-y-10 bg-white min-h-screen">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-block p-4 bg-blue-50 rounded-full border border-blue-100"><ShieldCheck className="w-10 h-10 text-blue-600" /></div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Interview Review</h1>
          </div>
          <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-4 shadow-sm">
            <div className="font-bold text-slate-900 text-lg leading-tight">{currentTopic.title}</div>
            <audio src={presentationAudio || ''} controls className="w-full h-12" />
          </div>
          <div className="space-y-4 pt-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Follow-up Records</div>
            {followupAudios.map((audio, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 hover:border-blue-200 transition-all">
                <div className="text-sm font-bold flex gap-4 text-slate-950 leading-relaxed">
                  <span className="text-blue-600 shrink-0 font-black">Q{i+1}.</span>
                  <span>{audio.question}</span>
                </div>
                <audio src={audio.url} controls className="w-full h-10 opacity-90" />
              </div>
            ))}
          </div>
          <button onClick={() => setViewMode('overview')} className="w-full bg-slate-950 text-white py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all mt-12 shadow-xl shadow-slate-200">
            <RotateCcw className="w-5 h-5" /> 처음 화면으로 이동
          </button>
        </main>
      )}
    </div>
  );
}