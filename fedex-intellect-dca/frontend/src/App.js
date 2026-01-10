import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, BarChart3, Users, Clock, TrendingUp, Lock, ArrowRight, LayoutDashboard, AlertTriangle, CheckCircle, BellRing, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const MOCK_API_DATA = [
  { case_id: "FED-10042", priority_score: 98, audit_trail: { audit_hash: "0x8f2e...9a12" } },
  { case_id: "FED-10045", priority_score: 85, audit_trail: { audit_hash: "0x7a3b...1c4d" } },
  { case_id: "FED-10088", priority_score: 42, audit_trail: { audit_hash: "0x1d9e...2f5a" } },
  { case_id: "FED-10102", priority_score: 76, audit_trail: { audit_hash: "0x4c8f...3e1b" } },
  { case_id: "FED-10115", priority_score: 91, audit_trail: { audit_hash: "0x9b2a...8d4c" } }
];

const NEW_BATCH_DATA = [
  { case_id: "FED-20001", priority_score: 99, audit_trail: { audit_hash: "0x3f5e...b2a1" } },
  { case_id: "FED-20042", priority_score: 96, audit_trail: { audit_hash: "0x9c8d...e4f3" } },
  { case_id: "FED-20110", priority_score: 88, audit_trail: { audit_hash: "0x1a2b...3c4d" } }
];

const recoveryData = [
  { name: 'Mon', recovered: 4000 },
  { name: 'Tue', recovered: 3000 },
  { name: 'Wed', recovered: 2000 },
  { name: 'Thu', recovered: 2780 },
  { name: 'Fri', recovered: 1890 },
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
    <div className="min-h-screen bg-fedexPurple flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative">
        <div className="h-2 bg-fedexOrange w-full absolute top-0"></div>
        <div className="p-8 pt-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-50 p-4 rounded-full ring-4 ring-purple-100">
               <Shield size={40} className="text-fedexPurple" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">FedEx Intellect</h2>
          <p className="text-gray-500 text-sm mb-8">Secure Debt Governance Gateway</p>
          <button onClick={handleSignIn} disabled={isLoading} className="w-full bg-fedexOrange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg flex items-center justify-center gap-2">
              {isLoading ? "Processing..." : <>Sign In to Console <ArrowRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- HELPER: FORMAT SECONDS ---
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
};

// --- MAIN APP COMPONENT ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAllocating, setIsAllocating] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null); 
  
  // --- SLA TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState({
    case1: 2532, // 42 mins
    case2: 11700, // 3h 15m
    case3: 79845  // 22h
  });

  // --- BUTTON STATES ---
  const [escalated, setEscalated] = useState(false);
  const [notified, setNotified] = useState(false);

  // --- TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => ({
        case1: prev.case1 > 0 ? prev.case1 - 1 : 0,
        case2: prev.case2 > 0 ? prev.case2 - 1 : 0,
        case3: prev.case3 > 0 ? prev.case3 - 1 : 0,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAllocateBatch = () => {
    setIsAllocating(true);
    setTimeout(() => {
      setCaseData(prevData => [...NEW_BATCH_DATA, ...prevData]); 
      alert("✅ AI Batch Allocation Complete: 3 New Critical Cases Added");
      setIsAllocating(false);
    }, 1500);
  };

  const handleEscalate = () => {
    setEscalated(true);
    alert("⚖️ LEGAL ESCALATION TRIGGERED\n\nCase FED-9901 has been digitally signed and transferred to the Legal Recovery Team.");
  };

  const handleNotify = () => {
    setNotified(true);
    alert("📧 AGENCY NOTIFIED\n\nAutomated warning email sent to 'Northwind Collections' regarding imminent SLA breach.");
  };

  // --- NEW: DOWNLOAD CSV REPORT ---
  const handleDownloadReport = () => {
    const headers = ["Case ID", "Time Remaining", "Status", "Action Taken"];
    const rows = [
      ["FED-9901", formatTime(timeLeft.case1), "CRITICAL", escalated ? "ESCALATED TO LEGAL" : "Pending"],
      ["FED-9945", formatTime(timeLeft.case2), "AT RISK", notified ? "DCA NOTIFIED" : "Pending"],
      ["FED-8821", formatTime(timeLeft.case3), "SAFE", "Monitoring"]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FEDEX_SLA_REPORT_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/process_debt');
        setCaseData(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (error) {
        setCaseData(MOCK_API_DATA);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 bg-fedexPurple text-white p-6 flex flex-col justify-between shadow-2xl flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold mb-10 flex items-center gap-2">
            <Shield size={24} className="text-fedexOrange" />
            FedEx Intellect
          </h1>
          <div className="text-xs text-purple-200 uppercase font-bold tracking-wider mb-2">Module Active</div>
          <div className="bg-white/10 p-3 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 text-white bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all w-full font-bold">
            <Lock size={18} /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">GOVERNANCE COMMAND CENTER</h2>
            <p className="text-gray-500">Real-time AI Prioritization & Audit Logs</p>
          </div>
          <button 
            onClick={handleAllocateBatch}
            disabled={isAllocating}
            className={`px-6 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 ${
              isAllocating ? "bg-gray-400 cursor-not-allowed" : "bg-fedexOrange text-white active:scale-95"
            }`}
          >
            {isAllocating ? "Processing..." : "Allocate New Batch"}
          </button>
        </header>

        {/* --- TABS --- */}
        <div className="flex gap-6 mb-8 border-b border-gray-200 pb-1">
          <button onClick={() => setActiveTab('dashboard')} className={`pb-3 px-2 font-bold flex items-center gap-2 transition-all text-lg ${activeTab === 'dashboard' ? 'text-fedexPurple border-b-4 border-fedexPurple' : 'text-gray-400 hover:text-gray-600'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('allocations')} className={`pb-3 px-2 font-bold flex items-center gap-2 transition-all text-lg ${activeTab === 'allocations' ? 'text-fedexPurple border-b-4 border-fedexPurple' : 'text-gray-400 hover:text-gray-600'}`}>
            <Users size={20} /> Smart Allocations
          </button>
          <button onClick={() => setActiveTab('sla')} className={`pb-3 px-2 font-bold flex items-center gap-2 transition-all text-lg ${activeTab === 'sla' ? 'text-fedexPurple border-b-4 border-fedexPurple' : 'text-gray-400 hover:text-gray-600'}`}>
            <Clock size={20} /> SLA Monitor
          </button>
        </div>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-fedexPurple">
                <p className="text-gray-500 text-sm font-medium">Recovery Predictability</p>
                <h3 className="text-4xl font-bold text-gray-800 mt-2">92.4%</h3>
                <span className="text-green-500 text-sm font-bold block mt-1">+2.4% vs last month</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-fedexOrange">
                <p className="text-gray-500 text-sm font-medium">Active SLA Breaches</p>
                <h3 className="text-4xl font-bold text-red-600 mt-2">12</h3>
                <span className="text-red-400 text-sm font-bold block mt-1">Requires Attention</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-gray-500 text-sm font-medium">Total Recovered (MTD)</p>
                <h3 className="text-4xl font-bold text-gray-800 mt-2">$1.2M</h3>
                <span className="text-green-500 text-sm font-bold block mt-1">On Target</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recoveryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="recovered" stroke="#4D148C" strokeWidth={5} dot={{ r: 6, fill: "#4D148C" }} />
                  </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* --- ALLOCATIONS TAB --- */}
        {activeTab === 'allocations' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-700">AI Priority Queue</h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                <Shield size={12} /> Verified
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Case ID</th>
                    <th className="p-4 font-semibold text-center">Score</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Audit Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="4" className="p-10 text-center text-gray-400">Loading...</td></tr>
                  ) : caseData.map((item, index) => (
                    <tr key={index} onClick={() => setSelectedCase(item)} className="hover:bg-purple-50 transition-colors cursor-pointer group">
                      <td className="p-4 font-bold text-fedexPurple">{item.case_id}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${item.priority_score > 70 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.priority_score > 70 ? 'CRIT' : 'ELEV'} ({item.priority_score})
                        </span>
                      </td>
                      <td className="p-4 text-green-600 font-bold text-xs">Compliant</td>
                      <td className="p-4 text-gray-400 font-mono text-[10px] italic">{item.audit_trail?.audit_hash || '0x7f...'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SLA MONITOR TAB --- */}
        {activeTab === 'sla' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-xs font-bold uppercase tracking-wider">Critical Breaches</p>
                    <h3 className="text-2xl font-bold text-gray-800">3 Cases</h3>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm text-red-500"><Clock size={20} /></div>
               </div>
               <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-xs font-bold uppercase tracking-wider">At Risk ({'<'} 4h)</p>
                    <h3 className="text-2xl font-bold text-gray-800">8 Cases</h3>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm text-yellow-600"><Clock size={20} /></div>
               </div>
               <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-xs font-bold uppercase tracking-wider">Avg Resolution</p>
                    <h3 className="text-2xl font-bold text-gray-800">14h 30m</h3>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm text-green-600"><Shield size={20} /></div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Live SLA Countdown
                  </h3>
                  <button onClick={handleDownloadReport} className="text-xs font-bold text-fedexPurple hover:underline flex items-center gap-1">
                      <FileText size={14} /> Download Report
                  </button>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="p-4">Case ID</th>
                      <th className="p-4">Time Remaining</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     <tr className="hover:bg-red-50 transition-colors">
                        <td className="p-4 font-bold text-gray-800">FED-9901</td>
                        <td className="p-4 font-mono text-red-600 font-bold">{formatTime(timeLeft.case1)}</td>
                        <td className="p-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">CRITICAL</span></td>
                        <td className="p-4">
                            {escalated ? (
                                <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><CheckCircle size={14}/> ESCALATED</span>
                            ) : (
                                <button onClick={handleEscalate} className="text-xs bg-gray-900 text-white px-3 py-1 rounded hover:bg-black flex items-center gap-1">
                                    <AlertTriangle size={12}/> Auto-Escalate
                                </button>
                            )}
                        </td>
                     </tr>
                     <tr className="hover:bg-yellow-50 transition-colors">
                        <td className="p-4 font-bold text-gray-800">FED-9945</td>
                        <td className="p-4 font-mono text-yellow-700 font-bold">{formatTime(timeLeft.case2)}</td>
                        <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">AT RISK</span></td>
                        <td className="p-4">
                            {notified ? (
                                <span className="flex items-center gap-1 text-blue-600 font-bold text-xs"><CheckCircle size={14}/> NOTIFIED</span>
                            ) : (
                                <button onClick={handleNotify} className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
                                    <BellRing size={12}/> Notify DCA
                                </button>
                            )}
                        </td>
                     </tr>
                     <tr>
                        <td className="p-4 font-bold text-gray-800">FED-8821</td>
                        <td className="p-4 font-mono text-gray-500">{formatTime(timeLeft.case3)}</td>
                        <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">SAFE</span></td>
                        <td className="p-4"><button className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">View Details</button></td>
                     </tr>
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* --- MODAL --- */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCase(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="bg-fedexPurple text-white p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{selectedCase.case_id}</h3>
                  <p className="text-xs opacity-80 font-mono mt-1">IMMUTABLE LEDGER RECORD</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="hover:bg-white/20 p-1 rounded-full">✕</button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs text-gray-600 break-all border border-gray-200">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 font-bold uppercase">Hash Signature</div>
                    {selectedCase.audit_trail?.audit_hash || "0x8f2e...9a12"}
                 </div>
                 <button onClick={() => setSelectedCase(null)} className="w-full bg-fedexOrange text-white py-3 rounded-xl font-bold">Close Audit</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;