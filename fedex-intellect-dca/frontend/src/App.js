import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// CLEANED: Removed TrendingUp, Zap, and Layout to fix Vercel build errors
import { Shield, BarChart3, Users, Clock, Lock, ArrowRight, AlertTriangle, CheckCircle, BellRing, FileText, MessageSquare, Send, X, Bot, Mic, PhoneOff, Activity, AlertOctagon, Eye, EyeOff, PlayCircle, PauseCircle, Plus, Terminal, Moon, Sun } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const MOCK_API_DATA = [
  { case_id: "FED-10042", amount: "$12,500", priority_score: 98, audit_trail: { audit_hash: "0x8f2e...9a12" } },
  { case_id: "FED-10045", amount: "$8,200", priority_score: 85, audit_trail: { audit_hash: "0x7a3b...1c4d" } },
  { case_id: "FED-10088", amount: "$3,100", priority_score: 42, audit_trail: { audit_hash: "0x1d9e...2f5a" } },
  { case_id: "FED-10102", amount: "$9,800", priority_score: 76, audit_trail: { audit_hash: "0x4c8f...3e1b" } },
  { case_id: "FED-10115", amount: "$5,400", priority_score: 91, audit_trail: { audit_hash: "0x9b2a...8d4c" } }
];

const recoveryData = [
  { name: 'Mon', recovered: 4000 },
  { name: 'Tue', recovered: 3000 },
  { name: 'Wed', recovered: 2000 },
  { name: 'Thu', recovered: 2780 },
  { name: 'Fri', recovered: 1890 },
];

const CALL_SCRIPT = [
  { role: "Agent", text: "Hello, this is Northwind Collections calling regarding your FedEx account.", sentiment: "neutral" },
  { role: "Customer", text: "I already told you guys I can't pay right now! Stop calling me!", sentiment: "angry" },
  { role: "Agent", text: "Sir, if you don't pay, we will have to take legal action immediately.", sentiment: "risk" }, 
  { role: "System", text: "⚠️ COMPLIANCE ALERT: THREAT DETECTED. FDCPA VIOLATION.", sentiment: "system" },
  { role: "Customer", text: "Are you threatening me? I want to speak to your manager.", sentiment: "angry" },
  { role: "Agent", text: "I apologize. Let's look at a payment plan instead.", sentiment: "neutral" }
];

// --- LOGIN COMPONENT ---
const LoginPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => onLogin(), 1000);
  };
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative z-10 border border-white/10">
        <div className="h-1 bg-gradient-to-r from-purple-500 to-orange-500 w-full absolute top-0"></div>
        <div className="p-8 pt-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full ring-1 ring-white/20 shadow-lg">
               <Shield size={40} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">FedEx Intellect</h2>
          <p className="text-gray-400 text-sm mb-8">Next-Gen Governance Gateway</p>
          <button onClick={handleSignIn} disabled={isLoading} className="w-full bg-[#4D148C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#6020a0] shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 group">
              {isLoading ? "Authenticating..." : <>Secure Login <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
};

// --- LIVE TICKER COMPONENT ---
const LiveTicker = ({ darkMode }) => (
    <div className={`w-full text-[10px] font-mono py-1 px-4 flex items-center gap-4 overflow-hidden border-b transition-colors ${darkMode ? 'bg-black text-gray-400 border-gray-800' : 'bg-gray-900 text-gray-300 border-gray-900'}`}>
        <div className="flex items-center gap-1 text-green-400 whitespace-nowrap"><Terminal size={10}/> SYSTEM LIVE</div>
        <div className="animate-marquee whitespace-nowrap flex gap-8">
            <span>🔹 BLOCK 8921 MINED: 0x7f2...a91</span>
            <span>🔹 NEW CASE: FED-2201 (Score: 92)</span>
            <span>🔹 SLA MONITOR: 3 CASES CRITICAL</span>
            <span>🔹 AGENT 'NORTHWIND' FLAGGED FOR REVIEW</span>
        </div>
    </div>
);

// --- AI CHATBOT COMPONENT ---
const AIChatBot = ({ onClose, privacyMode, darkMode }) => {
  const [mode, setMode] = useState("chat"); 
  const [messages, setMessages] = useState([{ text: "Hello! I am the GenAI Guardian. Type 'Check FED-10042' or click the Mic to monitor a live call.", isBot: true }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [callLines, setCallLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(100); 

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(scrollToBottom, [messages, callLines]);

  useEffect(() => {
    let interval;
    if (isCalling && currentLineIndex < CALL_SCRIPT.length) {
      interval = setInterval(() => {
        const line = CALL_SCRIPT[currentLineIndex];
        setCallLines(prev => [...prev, line]);
        if (line.sentiment === "angry") setSentimentScore(30);
        if (line.sentiment === "risk") setSentimentScore(10);
        if (line.sentiment === "neutral") setSentimentScore(80);
        setCurrentLineIndex(prev => prev + 1);
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [isCalling, currentLineIndex]);

  const startCallSimulation = () => { setMode("call"); setIsCalling(true); setCallLines([]); setCurrentLineIndex(0); setSentimentScore(100); };
  const stopCallSimulation = () => { setIsCalling(false); setMode("chat"); };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput("");
    setTimeout(() => {
      let botResponse = "I can help optimize that workflow.";
      if (userMsg.match(/FED-\d+/i)) {
        botResponse = `🔍 **Analysis for ${userMsg.match(/FED-\d+/i)[0].toUpperCase()}:**\n- Priority: CRITICAL (98/100)\n- Risk: High Default Probability\n- Action: Recommend generating Legal Notice.`;
      } else if (userMsg.toLowerCase().includes("generate")) {
         botResponse = "✅ **Action Executed:**\nLevel 3 Demand Notice has been generated and downloaded.";
      }
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 1000);
  };

  return (
    <div className={`fixed bottom-24 right-6 w-80 md:w-96 rounded-2xl shadow-2xl border overflow-hidden flex flex-col animate-fade-in z-50 h-[550px] ${privacyMode ? 'blur-sm pointer-events-none opacity-50' : ''} ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className={`p-4 text-white flex justify-between items-center transition-colors ${mode === 'call' ? 'bg-gray-950' : 'bg-[#4D148C]'}`}>
        <div className="flex items-center gap-2">
          {mode === 'call' ? <Activity className="animate-pulse text-red-500" /> : <Bot size={20} />}
          <span className="font-bold">{mode === 'call' ? "Live Sentinel Mode" : "GenAI Guardian"}</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={18}/></button>
      </div>
      {mode === 'chat' && (
        <>
          <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm whitespace-pre-wrap ${msg.isBot ? (darkMode ? 'bg-slate-800 text-gray-200 border border-slate-700' : 'bg-white border border-gray-200 text-gray-700 shadow-sm') : 'bg-orange-500 text-white shadow-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={`p-3 border-t flex gap-2 items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
            <button onClick={startCallSimulation} className="text-red-500 bg-red-500/10 p-2 rounded-full hover:bg-red-500/20" title="Monitor Live Calls"><Mic size={20} /></button>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask AI..." className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C] ${darkMode ? 'bg-slate-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900'}`} />
            <button onClick={handleSend} className="bg-[#4D148C] text-white p-2 rounded-full hover:bg-purple-900"><Send size={18} /></button>
          </div>
        </>
      )}
      {mode === 'call' && (
        <div className="flex-1 bg-gray-950 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><div className="w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse"></div></div>
            <div className="h-1 w-full bg-gray-800"><div className={`h-full transition-all duration-500 ${sentimentScore < 40 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${sentimentScore}%`}}></div></div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {callLines.map((line, i) => (
                    <div key={i} className={`flex flex-col ${line.role === 'Agent' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-gray-500 mb-1">{line.role}</span>
                        {line.sentiment === 'system' ? (
                             <div className="bg-red-500/20 border border-red-500 text-red-200 p-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-bounce"><AlertOctagon size={14}/> {line.text}</div>
                        ) : (
                            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${line.role === 'Agent' ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>{line.text}</div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white text-xs"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Recording</div>
                <button onClick={stopCallSimulation} className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-red-700"><PhoneOff size={14} /> End Monitor</button>
            </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState(null); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // --- STATES ---
  const [darkMode, setDarkMode] = useState(false); 
  const [privacyMode, setPrivacyMode] = useState(false);
  const [autoPilot, setAutoPilot] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ case1: 2532, case2: 11700, case3: 79845 });
  const [escalated, setEscalated] = useState(false);
  const [notified, setNotified] = useState(false);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualAmount, setManualAmount] = useState("");
  const [manualScore, setManualScore] = useState("");
  const [manualCount, setManualCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => ({ case1: prev.case1 > 0 ? prev.case1 - 1 : 0, case2: prev.case2 > 0 ? prev.case2 - 1 : 0, case3: prev.case3 > 0 ? prev.case3 - 1 : 0 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (autoPilot) {
        interval = setInterval(() => {
            const randomId = Math.floor(10000 + Math.random() * 90000);
            const randomScore = Math.floor(50 + Math.random() * 50);
            const newCase = {
                case_id: `FED-${randomId}`,
                amount: `$${Math.floor(Math.random() * 10)},${Math.floor(Math.random() * 900)}`,
                priority_score: randomScore,
                audit_trail: { audit_hash: `0x${Math.random().toString(16).substr(2, 10)}...` }
            };
            setCaseData(prev => [newCase, ...prev]); 
        }, 2500); 
    }
    return () => clearInterval(interval);
  }, [autoPilot]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualAmount || !manualScore) return alert("Please fill in all fields");
    const newCount = manualCount + 1;
    const newCase = {
        case_id: `FED-MANUAL-${newCount}`,
        amount: `$${manualAmount}`,
        priority_score: parseInt(manualScore),
        audit_trail: { audit_hash: `0x${Math.random().toString(16).substr(2, 10)}...` }
    };
    setCaseData(prev => [newCase, ...prev]);
    setManualCount(newCount);
    setManualAmount("");
    setManualScore("");
    setIsManualModalOpen(false);
    alert(`✅ Successfully uploaded FED-MANUAL-${newCount} to the blockchain.`);
  };

  const handleEscalate = () => { setEscalated(true); alert("⚖️ LEGAL ESCALATION TRIGGERED\n\nCase FED-9901 has been digitally signed."); };
  const handleNotify = () => { setNotified(true); alert("📧 AGENCY NOTIFIED\n\nAutomated warning email sent."); };
  const handleDownloadReport = () => {
    const headers = ["Case ID", "Time Remaining", "Status", "Action Taken"];
    const rows = [ ["FED-9901", formatTime(timeLeft.case1), "CRITICAL", escalated ? "ESCALATED TO LEGAL" : "Pending"], ["FED-9945", formatTime(timeLeft.case2), "AT RISK", notified ? "DCA NOTIFIED" : "Pending"], ["FED-8821", formatTime(timeLeft.case3), "SAFE", "Monitoring"] ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", `FEDEX_SLA_REPORT.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try { const response = await axios.get('http://localhost:8000/process_debt'); setCaseData(Array.isArray(response.data) ? response.data : [response.data]); } 
      catch (error) { setCaseData(MOCK_API_DATA); } 
      finally { setLoading(false); }
    };
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  // --- THEME CLASSES ---
  const bgClass = darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800';
  const cardClass = darkMode ? 'bg-slate-900 border border-slate-800 shadow-xl' : 'bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
  const textClass = darkMode ? 'text-gray-100' : 'text-slate-800';
  const subTextClass = darkMode ? 'text-gray-400' : 'text-slate-500';
  const inputClass = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div className={`min-h-screen font-sans animate-fade-in relative overflow-hidden flex flex-col ${bgClass} transition-colors duration-300`}>
      <div className="flex flex-1 h-screen overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-[#1a0536] to-[#0f0321] text-white p-6 flex flex-col justify-between shadow-2xl flex-shrink-0 z-20 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={100} className="text-purple-500 rotate-12"/></div>
            <div>
                <h1 className="text-xl font-bold mb-8 flex items-center gap-2 tracking-tight relative z-10"> <Shield size={24} className="text-fedexOrange" /> FedEx Intellect </h1>
                <div className="bg-white/5 p-3 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-3 mb-6">
                    <div className={`w-2 h-2 rounded-full ${autoPilot ? 'bg-orange-400 animate-ping' : 'bg-green-400 animate-pulse'}`}></div> 
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                        <span className="text-sm font-bold text-gray-100">{autoPilot ? "AI DRIVEN" : "ONLINE"}</span>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Controls</p>
                    
                    <button onClick={() => setPrivacyMode(!privacyMode)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all border ${privacyMode ? 'bg-orange-500/20 border-orange-500/50 text-orange-200' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}>
                        {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />} {privacyMode ? "Privacy ON" : "Privacy OFF"}
                    </button>

                    <button onClick={() => setDarkMode(!darkMode)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all border ${darkMode ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}>
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/10 p-4 rounded-xl transition-all w-full font-bold"> <Lock size={18} /> Sign Out </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <LiveTicker darkMode={darkMode} />

            <div className="p-8 overflow-y-auto flex-1">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className={`text-3xl font-extrabold tracking-tight ${textClass}`}>Governance Command Center</h2>
                    <p className={`font-medium mt-1 ${subTextClass}`}>Real-time AI Prioritization & Blockchain Audit Logs</p>
                </div>
                
                <div className="flex gap-3">
                    <button onClick={() => setAutoPilot(!autoPilot)} className={`px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 border ${autoPilot ? "bg-green-600 border-green-500 text-white animate-pulse" : (darkMode ? "bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50")}`}>
                        {autoPilot ? <PauseCircle size={18}/> : <PlayCircle size={18}/>} {autoPilot ? "AI Running" : "Autopilot"}
                    </button>
                    <button onClick={() => setIsManualModalOpen(true)} className="px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 bg-[#FF6600] text-white active:scale-95 hover:bg-[#ff751a]">
                        <Plus size={18}/> Manual Entry
                    </button>
                </div>
                </header>

                <div className={`flex gap-8 mb-8 border-b pb-1 ${darkMode ? 'border-gray-800' : 'border-gray-200/60'}`}>
                    {['dashboard', 'allocations', 'sla'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 font-bold flex items-center gap-2 transition-all text-sm uppercase tracking-wide ${activeTab === tab ? 'text-[#a855f7] border-b-2 border-[#a855f7]' : (darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}`}>
                            {tab === 'dashboard' ? <BarChart3 size={18}/> : tab === 'allocations' ? <Users size={18}/> : <Clock size={18}/>} {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'dashboard' && (
                <div className="animate-fade-in space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`${cardClass} p-6 rounded-2xl relative overflow-hidden group`}>
                            <p className={`${subTextClass} text-xs font-bold uppercase tracking-wider`}>Recovery Predictability</p>
                            <h3 className={`text-4xl font-black mt-2 ${privacyMode ? 'blur-sm' : ''} ${textClass}`}>92.4%</h3>
                            <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-xs font-bold inline-block mt-3">+2.4% vs last month</span>
                        </div>
                        <div className={`${cardClass} p-6 rounded-2xl relative overflow-hidden group`}>
                            <p className={`${subTextClass} text-xs font-bold uppercase tracking-wider`}>Active SLA Breaches</p>
                            <h3 className="text-4xl font-black text-red-500 mt-2">12</h3>
                            <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-xs font-bold inline-block mt-3">Immediate Action Req.</span>
                        </div>
                        <div className={`${cardClass} p-6 rounded-2xl relative overflow-hidden group`}>
                            <p className={`${subTextClass} text-xs font-bold uppercase tracking-wider`}>Total Recovered (MTD)</p>
                            <h3 className={`text-4xl font-black mt-2 ${privacyMode ? 'blur-sm' : ''} ${textClass}`}>$1.2M</h3>
                            <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-xs font-bold inline-block mt-3">On Target</span>
                        </div>
                    </div>
                    <div className={`${cardClass} p-8 rounded-2xl h-96 ${privacyMode ? 'blur-sm' : ''}`}>
                        <h4 className={`font-bold mb-6 ${textClass}`}>Recovery Trends</h4>
                        <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={recoveryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{borderRadius:'12px', border:'none', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000', boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}} cursor={{fill: darkMode ? '#334155' : '#f8fafc'}} />
                            <Bar dataKey="recovered" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={50} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                )}

                {activeTab === 'allocations' && (
                <div className={`${cardClass} rounded-2xl overflow-hidden animate-fade-in`}>
                    <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50/50'}`}>
                    <h3 className={`font-bold flex items-center gap-2 ${textClass}`}><Users size={18}/> AI Priority Queue</h3>
                    <div className="flex gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border ${autoPilot ? 'bg-green-500/10 text-green-500 border-green-500/20 animate-pulse' : (darkMode ? 'bg-slate-800 text-gray-500 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-200')}`}>
                            <Bot size={12}/> {autoPilot ? "INGESTING..." : "AI IDLE"}
                        </span>
                    </div>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={`text-xs uppercase tracking-wider font-bold ${darkMode ? 'bg-slate-950 text-gray-500' : 'bg-slate-50 text-slate-500'}`}>
                        <tr>
                            <th className="p-4">Case ID</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4 text-center">Score</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Audit Hash</th>
                        </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {loading ? ( <tr><td colSpan="5" className="p-10 text-center text-gray-400">Loading Blockchain Data...</td></tr> ) : caseData.map((item, index) => (
                            <tr key={index} onClick={() => setSelectedCase(item)} className={`transition-colors cursor-pointer group animate-fade-in ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-purple-50/50'}`}>
                            <td className={`p-4 font-bold text-purple-500 ${privacyMode ? 'blur-sm' : ''}`}>{item.case_id}</td>
                            <td className={`p-4 text-sm font-medium ${privacyMode ? 'blur-sm' : ''} ${textClass}`}>{item.amount || "$2,500"}</td>
                            <td className="p-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.priority_score > 70 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                {item.priority_score > 70 ? 'CRITICAL' : 'ELEVATED'} ({item.priority_score})
                                </span>
                            </td>
                            <td className="p-4"><span className="text-green-500 bg-green-500/10 px-2 py-1 rounded text-[10px] font-bold border border-green-500/20">COMPLIANT</span></td>
                            <td className="p-4 text-gray-500 font-mono text-[10px]">{item.audit_trail?.audit_hash || '0x7f...'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                )}

                {activeTab === 'sla' && (
                <div className="animate-fade-in space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-sm ${darkMode ? 'bg-red-900/10 border-red-900/20' : 'bg-red-50 border-red-100'}`}>
                        <div><p className="text-red-500 text-xs font-bold uppercase tracking-wider">Critical Breaches</p><h3 className={`text-3xl font-black mt-1 ${darkMode ? 'text-red-400' : 'text-red-900'}`}>3 Cases</h3></div>
                        <div className={`p-3 rounded-full shadow-sm ${darkMode ? 'bg-red-900/20 text-red-400' : 'bg-white text-red-500'}`}><Clock size={24} /></div>
                    </div>
                    <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-sm ${darkMode ? 'bg-orange-900/10 border-orange-900/20' : 'bg-orange-50 border-orange-100'}`}>
                        <div><p className="text-orange-500 text-xs font-bold uppercase tracking-wider">At Risk ({'<'} 4h)</p><h3 className={`text-3xl font-black mt-1 ${darkMode ? 'text-orange-400' : 'text-orange-900'}`}>8 Cases</h3></div>
                        <div className={`p-3 rounded-full shadow-sm ${darkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-white text-orange-500'}`}><Clock size={24} /></div>
                    </div>
                    <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-sm ${darkMode ? 'bg-green-900/10 border-green-900/20' : 'bg-green-50 border-green-100'}`}>
                        <div><p className="text-green-500 text-xs font-bold uppercase tracking-wider">Avg Resolution</p><h3 className={`text-3xl font-black mt-1 ${darkMode ? 'text-green-400' : 'text-green-900'}`}>14h 30m</h3></div>
                        <div className={`p-3 rounded-full shadow-sm ${darkMode ? 'bg-green-900/20 text-green-400' : 'bg-white text-green-500'}`}><Shield size={24} /></div>
                    </div>
                    </div>
                    <div className={`${cardClass} rounded-2xl overflow-hidden`}>
                    <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                        <h3 className={`font-bold flex items-center gap-2 ${textClass}`}><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live SLA Countdown</h3>
                        <button onClick={handleDownloadReport} className="text-xs font-bold text-purple-500 hover:text-purple-400 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"><FileText size={14} /> Download CSV</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className={`text-xs uppercase font-bold ${darkMode ? 'bg-slate-950 text-gray-500' : 'bg-slate-50 text-slate-500'}`}><tr><th className="p-4">Case ID</th><th className="p-4">Time Remaining</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                            <tr className={`transition-colors ${darkMode ? 'hover:bg-red-900/10' : 'hover:bg-red-50/50'}`}>
                                <td className={`p-4 font-bold ${privacyMode ? 'blur-sm' : ''} ${textClass}`}>FED-9901</td>
                                <td className={`p-4 font-mono font-bold w-fit rounded-lg ${darkMode ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50/50'}`}>{formatTime(timeLeft.case1)}</td>
                                <td className="p-4"><span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-[10px] font-bold border border-red-500/20">CRITICAL</span></td>
                                <td className="p-4">{escalated ? <span className="flex items-center gap-1 text-green-500 font-bold text-xs"><CheckCircle size={14}/> ESCALATED</span> : <button onClick={handleEscalate} className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-800 text-white hover:bg-black'}`}><AlertTriangle size={12}/> Auto-Escalate</button>}</td>
                            </tr>
                            <tr className={`transition-colors ${darkMode ? 'hover:bg-orange-900/10' : 'hover:bg-orange-50/50'}`}>
                                <td className={`p-4 font-bold ${privacyMode ? 'blur-sm' : ''} ${textClass}`}>FED-9945</td>
                                <td className={`p-4 font-mono font-bold w-fit rounded-lg ${darkMode ? 'text-orange-400 bg-orange-900/20' : 'text-orange-600 bg-orange-50/50'}`}>{formatTime(timeLeft.case2)}</td>
                                <td className="p-4"><span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-[10px] font-bold border border-orange-500/20">AT RISK</span></td>
                                <td className="p-4">{notified ? <span className="flex items-center gap-1 text-blue-500 font-bold text-xs"><CheckCircle size={14}/> NOTIFIED</span> : <button onClick={handleNotify} className={`text-xs border px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700' : 'border-gray-300 bg-white hover:bg-gray-50'}`}><BellRing size={12}/> Notify DCA</button>}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                )}

                {selectedCase && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCase(null)}>
                    <div className={`rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                    <div className="bg-[#4D148C] text-white p-6 flex justify-between items-start">
                        <div><h3 className={`text-2xl font-bold ${privacyMode ? 'blur-sm' : ''}`}>{selectedCase.case_id}</h3><p className="text-xs opacity-70 font-mono mt-1 tracking-wider uppercase">Blockchain Ledger Record</p></div>
                        <button onClick={() => setSelectedCase(null)} className="hover:bg-white/20 p-1 rounded-full transition-colors">✕</button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className={`p-4 rounded-xl font-mono text-xs break-all border ${darkMode ? 'bg-slate-950 text-gray-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-[10px] opacity-60"><Lock size={10}/> Cryptographic Hash</div>
                            {selectedCase.audit_trail?.audit_hash || "0x8f2e...9a12"}
                        </div>
                        <button onClick={() => setSelectedCase(null)} className="w-full bg-[#FF6600] text-white py-3 rounded-xl font-bold hover:bg-[#ff751a] shadow-lg shadow-orange-500/20 transition-all">Close Audit Log</button>
                    </div>
                    </div>
                </div>
                )}

                {isManualModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl shadow-2xl max-w-md w-full animate-fade-in overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-white/20'}`}>
                        <div className="bg-[#4D148C] p-6 flex justify-between items-center text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2"><FileText size={20}/> Manual Case Entry</h3>
                            <button onClick={() => setIsManualModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
                            <div>
                                <label className={`block text-sm font-bold mb-1 ${textClass}`}>Debt Amount ($)</label>
                                <input type="number" className={`w-full rounded-xl p-3 focus:ring-2 focus:ring-[#4D148C] outline-none transition-all ${inputClass}`} placeholder="e.g. 5000" value={manualAmount} onChange={(e) => setManualAmount(e.target.value)} />
                            </div>
                            <div>
                                <label className={`block text-sm font-bold mb-1 ${textClass}`}>Priority Score (0-100)</label>
                                <input type="number" max="100" className={`w-full rounded-xl p-3 focus:ring-2 focus:ring-[#4D148C] outline-none transition-all ${inputClass}`} placeholder="e.g. 85" value={manualScore} onChange={(e) => setManualScore(e.target.value)} />
                            </div>
                            <div className={`p-3 rounded-xl text-xs font-bold flex gap-2 border items-center ${darkMode ? 'bg-blue-900/20 text-blue-400 border-blue-900/30' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                <Shield size={16} className="flex-shrink-0"/> <span>ID generated as: FED-MANUAL-{manualCount + 1}</span>
                            </div>
                            <button type="submit" className="w-full bg-[#FF6600] text-white py-3 rounded-xl font-bold hover:bg-[#ff751a] shadow-lg shadow-orange-500/20 transition-all">Upload to Blockchain</button>
                        </form>
                    </div>
                </div>
                )}

                <button onClick={() => setIsChatOpen(!isChatOpen)} className="fixed bottom-6 right-6 bg-[#4D148C] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40 group border-4 border-white/20">
                    {isChatOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-bounce" />}
                </button>
                {isChatOpen && <AIChatBot onClose={() => setIsChatOpen(false)} privacyMode={privacyMode} darkMode={darkMode} />}
            </div>
        </main>
      </div>
    </div>
  );
}

export default App;