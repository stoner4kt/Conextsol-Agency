import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Terminal, 
  Bot, 
  Compass, 
  Sparkles,
  LogOut,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { AppState, Client, Project, Retainer, DocumentAndNote, WebhookAlert } from './types';
import { getInitialState, saveState, CURRENT_DATE_STR } from './mockData';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import OnboardingWizard from './components/OnboardingWizard';
import ClientsList from './components/ClientsList';
import ClientDetail from './components/ClientDetail';
import DocumentEditor from './components/DocumentEditor';
import DevCenter from './components/DevCenter';

export default function App() {
  // Load state from localStorage or load seed data
  const [state, setState] = useState<AppState>(getInitialState);
  
  // Tab Routing: 'dashboard' | 'wizard' | 'clients' | 'devcenter'
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Drill-down Detail States
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Authentication State Simulation
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('conextsol_auth_logged_in') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('reeqieric41@gmail.com');
  const [loginPassword, setLoginPassword] = useState('conextsol2026');
  const [authError, setAuthError] = useState('');

  // Persist AppState to localStorage on change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Handle Simulated Supabase Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please fill in both email and password fields.');
      return;
    }
    
    // Simulate Supabase login
    localStorage.setItem('conextsol_auth_logged_in', 'true');
    setIsLoggedIn(true);
    setAuthError('');

    // Dynamically adjust permissions based on email structure
    const adminMode = loginEmail.endsWith('@conextsol.com') || loginEmail === 'reeqieric41@gmail.com';
    setState(prev => ({
      ...prev,
      isAdmin: adminMode,
      userEmail: loginEmail
    }));
  };

  const handleSignOut = () => {
    localStorage.removeItem('conextsol_auth_logged_in');
    setIsLoggedIn(false);
    // Return tab to default
    setCurrentTab('dashboard');
    setSelectedClientId(null);
    setSelectedDocumentId(null);
  };

  // Onboarding Wizard complete callback (chains Client + Project + Specs)
  const handleOnboardingComplete = (newClient: Client, newProject: Project, newDoc: DocumentAndNote) => {
    setState(prev => {
      const updatedClients = [...prev.clients, newClient];
      const updatedProjects = [...prev.projects, newProject];
      const updatedDocs = [...prev.documents, newDoc];
      
      // Auto-append simulated ledger of this operation
      const newAlert: WebhookAlert = {
        id: 'wizard-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'deadline',
        title: `Wizard Transaction for ${newClient.company_name}`,
        message: `⚡ Relational Pipeline Fired: Ingested and linked Client Profile (${newClient.company_name}), associated Project (${newProject.project_name}), and initial Markdown Specs in a unified PostgreSQL cascading transaction.`,
        recipient: 'Backoffice DB ledger',
        status: 'sent'
      };

      return {
        ...prev,
        clients: updatedClients,
        projects: updatedProjects,
        documents: updatedDocs,
        alertsLog: [newAlert, ...prev.alertsLog]
      };
    });

    // Take the user to the newly created client details page
    setTimeout(() => {
      setSelectedClientId(newClient.id);
      setCurrentTab('clients');
    }, 1500);
  };

  // Simulate Deno Edge Function: Scan Projects Due in exactly 2 Days
  const handleRunDeadlineAlerts = () => {
    // Current anchored date is '2026-07-15'. 2 Days away is '2026-07-17'.
    const targetDate = '2026-07-17';
    
    // Find matching projects
    const matchingProjects = state.projects.filter(p => p.end_date === targetDate);
    
    if (matchingProjects.length > 0) {
      const newAlerts: WebhookAlert[] = matchingProjects.map(project => {
        const client = state.clients.find(c => c.id === project.client_id);
        const clientName = client ? client.company_name : 'Unknown Client';
        
        return {
          id: `deadline-alert-${project.id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'deadline',
          title: `Deadline Alert: ${project.project_name}`,
          message: `⚠️ Telegram Alert Sent: Project "${project.project_name}" for client "${clientName}" is completing on ${project.end_date} (In 2 Days). Flat rate: $${project.invoiced_amount.toLocaleString()}. Webhook forwarded to Bot API.`,
          recipient: 'Telegram Admin Feed (@conextsol_ops)',
          status: 'sent'
        };
      });

      setState(prev => ({
        ...prev,
        alertsLog: [...newAlerts, ...prev.alertsLog]
      }));
    } else {
      // Log negative search outcome
      const dryAlert: WebhookAlert = {
        id: `deadline-dry-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'deadline',
        title: 'Daily Deadline Scanner Executed',
        message: '🔍 Scan complete: Checked all projects due on 2026-07-17. Zero matches found in database backlog.',
        recipient: 'System Console',
        status: 'sent'
      };
      setState(prev => ({
        ...prev,
        alertsLog: [dryAlert, ...prev.alertsLog]
      }));
    }
  };

  // Simulate Deno Edge Function: Scan Active Retainers Due Today (Cycle Day === 15)
  const handleRunRetainerAlerts = () => {
    // Current anchored date is July 15, so billing day is 15
    const todayDayNum = 15;

    const matchingRetainers = state.retainers.filter(r => r.is_active && r.billing_cycle_day === todayDayNum);

    if (matchingRetainers.length > 0) {
      const newAlerts: WebhookAlert[] = matchingRetainers.map(ret => {
        const client = state.clients.find(c => c.id === ret.client_id);
        const clientName = client ? client.company_name : 'Unknown Client';

        return {
          id: `retainer-alert-${ret.id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'retainer',
          title: `Retainer Billing Due: ${clientName}`,
          message: `💰 Telegram Alert Sent: Active "${ret.service_type.toUpperCase()}" retainer is due for billing today (Day ${ret.billing_cycle_day}). Amount: $${ret.billing_amount.toLocaleString()}. Generating QuickBooks invoice.`,
          recipient: 'Telegram Admin Billing Feed',
          status: 'sent'
        };
      });

      setState(prev => ({
        ...prev,
        alertsLog: [...newAlerts, ...prev.alertsLog]
      }));
    } else {
      const dryAlert: WebhookAlert = {
        id: `retainer-dry-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'retainer',
        title: 'Billing Scanner Executed',
        message: `🔍 Scan complete: Checked active retainers billed on Day ${todayDayNum}. Zero active entries matched.`,
        recipient: 'System Console',
        status: 'sent'
      };
      setState(prev => ({
        ...prev,
        alertsLog: [dryAlert, ...prev.alertsLog]
      }));
    }
  };

  // Insert a new retainer contract for a specific client
  const handleAddRetainer = (clientId: string, serviceType: string, amount: number, cycleDay: number) => {
    const newRetainer: Retainer = {
      id: 'ret-' + Math.random().toString(36).substring(2, 9),
      client_id: clientId,
      service_type: serviceType,
      billing_amount: amount,
      billing_cycle_day: cycleDay,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      retainers: [...prev.retainers, newRetainer]
    }));
  };

  // Insert documentation tied to a project
  const handleAddDoc = (projectId: string, title: string, content: string, files: string) => {
    const parsedFiles = files ? files.split(',').map(f => f.trim()).filter(Boolean) : [];
    
    const newDoc: DocumentAndNote = {
      id: 'doc-' + Math.random().toString(36).substring(2, 9),
      project_id: projectId,
      title: title,
      content: content,
      file_references: parsedFiles,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));

    // Auto-open this newly created document
    setSelectedDocumentId(newDoc.id);
  };

  // Edit / Save document (Restricted to Admin inside the component)
  const handleSaveDocument = (id: string, title: string, content: string, fileRefs: string[]) => {
    setState(prev => {
      const updatedDocs = prev.documents.map(d => {
        if (d.id === id) {
          return {
            ...d,
            title,
            content,
            file_references: fileRefs,
            updated_at: new Date().toISOString()
          };
        }
        return d;
      });

      return {
        ...prev,
        documents: updatedDocs
      };
    });
  };

  // Render Login Frame if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0514] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        {/* Abstract decorative purplish ambient blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#4c1d95]/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#064e3b]/25 rounded-full blur-[120px]" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#581c87] to-emerald-400 p-0.5 shadow-lg shadow-purple-950/40">
            <div className="h-full w-full bg-[#140C24] rounded-[14px] flex items-center justify-center font-display font-black text-emerald-400 text-xl tracking-tight">
              CX
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-white">
            Conextsol Agency Portal
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Secure client, project, retainer management, and automated notifications ledger.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-[#1B122B] border border-purple-900/30 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 space-y-6">
            <div className="border-b border-purple-900/20 pb-3">
              <span className="text-[10px] bg-purple-900/40 text-emerald-400 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                Supabase Auth Mode
              </span>
              <h3 className="text-sm font-semibold text-white mt-1.5">Sign in with Email & Password</h3>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-300 text-xs rounded-xl">
                {authError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F081C] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    placeholder="e.g. admin@conextsol.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Secret Password</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Lock size={14} />
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F081C] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-[#0F081C] font-sans text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer text-center"
              >
                Sign In & Synchronize Portal
              </button>
            </form>

            <div className="border-t border-purple-900/20 pt-4 space-y-3">
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-semibold">
                Quick Simulation Logins
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('reeqieric41@gmail.com');
                    setLoginPassword('conextsol2026');
                  }}
                  className="p-3 bg-[#0F081C] border border-purple-900/20 rounded-xl text-left text-[10px] hover:bg-white/5 transition-colors cursor-pointer text-gray-300 space-y-1"
                >
                  <p className="font-semibold text-emerald-400 flex items-center space-x-1">
                    <ShieldCheck size={11} />
                    <span>Agency Admin</span>
                  </p>
                  <p className="text-gray-400 font-mono truncate">reeqieric41@gmail.com</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('client@zenithretail.co');
                    setLoginPassword('zenithretail2026');
                  }}
                  className="p-3 bg-[#0F081C] border border-purple-900/20 rounded-xl text-left text-[10px] hover:bg-white/5 transition-colors cursor-pointer text-gray-300 space-y-1"
                >
                  <p className="font-semibold text-amber-400 flex items-center space-x-1">
                    <ShieldAlert size={11} />
                    <span>Client Guest</span>
                  </p>
                  <p className="text-gray-400 font-mono truncate">client@zenithretail.co</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper title bar maps
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Operational Control Dashboard';
      case 'wizard': return 'Linked Client Pipeline';
      case 'clients': return 'Accounts & Contract registries';
      case 'devcenter': return 'Supabase & Next.js Download Hub';
      default: return 'Backoffice';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0514] flex overflow-hidden font-sans text-gray-300">
      
      {/* Brand Sidebar Left Frame */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedClientId(null);
          setSelectedDocumentId(null);
        }}
        isAdmin={state.isAdmin}
        setIsAdmin={(admin) => setState(prev => ({ ...prev, isAdmin: admin }))}
        userEmail={state.userEmail}
        setUserEmail={(email) => setState(prev => ({ ...prev, userEmail: email }))}
      />

      {/* Main content viewport */}
      <main className="flex-1 overflow-y-auto lg:pl-64 min-h-screen flex flex-col justify-between">
        
        {/* Dynamic Nav Header Bar */}
        <header className="bg-[#0F081C] border-b border-purple-900/30 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-display font-extrabold tracking-tight text-white text-base md:text-lg">
              {selectedDocumentId 
                ? 'System Specifications Sheets' 
                : selectedClientId 
                  ? 'Client Profile Registry' 
                  : getTabTitle()
              }
            </h1>
            <p className="text-[10px] text-gray-400 font-mono font-semibold tracking-wider uppercase mt-0.5">
              Conextsol Backoffice • Active Context
            </p>
          </div>

          <button
            id="signout-btn"
            onClick={handleSignOut}
            className="flex items-center space-x-1 text-gray-400 hover:text-red-400 font-sans text-xs transition-colors font-semibold cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        {/* Primary Page Grid */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* RENDER SPECIFIC SUB-FLOWS */}
          {selectedDocumentId ? (
            <DocumentEditor 
              documentId={selectedDocumentId}
              state={state}
              onBack={() => setSelectedDocumentId(null)}
              onSaveDocument={handleSaveDocument}
            />
          ) : selectedClientId ? (
            <ClientDetail 
              clientId={selectedClientId}
              state={state}
              onBack={() => setSelectedClientId(null)}
              onAddRetainer={handleAddRetainer}
              onAddDoc={handleAddDoc}
              onSelectProject={(projectId) => {
                // Find matching document for this project
                const doc = state.documents.find(d => d.project_id === projectId);
                if (doc) {
                  setSelectedDocumentId(doc.id);
                } else {
                  // Fallback to creating a doc if none exists
                  handleAddDoc(projectId, 'Initial Spec Sheet', '### Project Guidelines\n\nAdd technical documentation here.', '');
                }
              }}
            />
          ) : (
            /* RENDER THE ACTIVE TAB CONTENT */
            <>
              {currentTab === 'dashboard' && (
                <DashboardStats 
                  state={state}
                  onRunDeadlineAlerts={handleRunDeadlineAlerts}
                  onRunRetainerAlerts={handleRunRetainerAlerts}
                  onSelectClient={(id) => {
                    setSelectedClientId(id);
                    setCurrentTab('clients');
                  }}
                  onOpenWizard={() => setCurrentTab('wizard')}
                />
              )}

              {currentTab === 'wizard' && (
                <OnboardingWizard 
                  onComplete={handleOnboardingComplete}
                  onCancel={() => setCurrentTab('dashboard')}
                />
              )}

              {currentTab === 'clients' && (
                <ClientsList 
                  state={state}
                  onSelectClient={setSelectedClientId}
                  onOpenWizard={() => setCurrentTab('wizard')}
                />
              )}

              {currentTab === 'devcenter' && (
                <DevCenter />
              )}
            </>
          )}

        </div>

        {/* Footer Credit & Status Line */}
        <footer className="bg-[#0F081C]/40 border-t border-purple-900/20 py-3.5 px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="font-mono">Local Sandbox synchronized with localStorage database</span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Conextsol Internal Backoffice</span> v1.4.0
          </div>
        </footer>
      </main>
    </div>
  );
}
