import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Check,
  Languages,
  Zap,
  RefreshCw,
  Cpu,
  Settings,
  Key,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { AppUser, UserRole } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
  isError?: boolean;
}

interface NemotronChatDrawerProps {
  user: AppUser | null;
}

export const NemotronChatDrawer: React.FC<NemotronChatDrawerProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // NVIDIA API Key Configuration
  const [nvidiaApiKey, setNvidiaApiKey] = useState<string>(() => {
    return localStorage.getItem('migrantcare_nvidia_key') || '';
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return (
      localStorage.getItem('migrantcare_nvidia_model') ||
      'nvidia/llama-3.1-nemotron-70b-instruct'
    );
  });

  // Health / Key Status
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [serverKeyDetected, setServerKeyDetected] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello${user ? `, ${user.name}` : ''}! I am your **MigrantCare AI Health & Safety Assistant**, powered by **NVIDIA Nemotron (Llama 3.1 70B)**.

How can I assist you with your health pass, clinical notes, workplace heat guidelines, or medical translations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'nvidia-api',
      model: selectedModel,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Check server health on mount to see if server environment key is already active
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.nvidia_configured) {
          setServerKeyDetected(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveKey = (key: string) => {
    setNvidiaApiKey(key);
    localStorage.setItem('migrantcare_nvidia_key', key.trim());
    setTestResult(null);
  };

  const handleSaveModel = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('migrantcare_nvidia_model', model);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/chat/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(nvidiaApiKey ? { 'x-nvidia-api-key': nvidiaApiKey.trim() } : {}),
        },
        body: JSON.stringify({
          apiKey: nvidiaApiKey ? nvidiaApiKey.trim() : undefined,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `NVIDIA API responded: "${data.message}" (Model: ${data.model})`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || `NVIDIA API returned error ${res.status}`,
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'Network error reaching test endpoint',
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const role = user?.role || 'worker';

  const suggestedPrompts: Record<UserRole, string[]> = {
    worker: [
      'What should I do if I feel dizzy in extreme sun?',
      'How does my 5-minute doctor consent work?',
      'Explain common prescription dosage instructions',
      'What are my rights regarding medical record privacy?',
    ],
    provider: [
      'Summarize clinical indicators for severe heat exhaustion',
      'Interaction warnings: NSAIDs with ACE inhibitors',
      'Guideline for occupational dust-induced asthma review',
      'Standard protocol for tetanus toxoid booster timing',
    ],
    employer: [
      'MOM/OSHA Worksite Heat Stress Guidelines & Rest Cycles',
      'What health records are employers legally allowed to see?',
      'PPE recommendations for high-elevation scaffolding',
      'Protocol when a worker is flagged "Restricted Duty"',
    ],
  };

  const currentPrompts = suggestedPrompts[role] || suggestedPrompts.worker;

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/nemotron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(nvidiaApiKey ? { 'x-nvidia-api-key': nvidiaApiKey.trim() } : {}),
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userRole: user?.role || 'worker',
          apiKey: nvidiaApiKey ? nvidiaApiKey.trim() : undefined,
          model: selectedModel,
          userContext: user
            ? {
                name: user.name,
                role: user.role,
                health_id: (user as any).health_id,
                facility: (user as any).facility,
                company: (user as any).company,
                language: selectedLanguage,
              }
            : { language: selectedLanguage },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider || 'nvidia-api',
        model: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Nemotron Chat Error:', err);
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        isError: true,
        content: `### ⚠️ NVIDIA API Key Setup Notice
${err.message || 'Could not communicate with NVIDIA API.'}

**How to activate your live key:**
1. Click the **⚙️ Settings** icon in the header.
2. Enter your **NVIDIA API Key** (starts with \`nvapi-...\` from [build.nvidia.com](https://build.nvidia.com)).
3. Or set \`NVIDIA_API_KEY\` in your environment variables for automatic live deployment.
4. Click **"Test Key"** to verify connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared. Ready for your next query via NVIDIA Nemotron!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'nvidia-api',
        model: selectedModel,
      },
    ]);
  };

  const isConfigured = Boolean(nvidiaApiKey || serverKeyDetected);

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 text-white shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-700 cursor-pointer group"
          aria-label="Open NVIDIA AI Assistant"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-slate-950 font-bold shadow-xs">
            <Cpu className="w-4 h-4 text-slate-950" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-extrabold tracking-tight">AI Health Assistant</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                NVIDIA Nemotron
              </span>
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Live Medical & Safety Guidance
            </span>
          </div>
        </button>
      )}

      {/* Slide-over / Modal Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-4 right-4 w-full sm:w-[460px] h-[620px] max-h-[92vh]'
          }`}
        >
          {/* Top Chat Bar */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <Cpu className="w-4.5 h-4.5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-white">MigrantCare AI</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    NVIDIA API
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      isConfigured ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                      }`}
                    ></span>
                    {isConfigured ? 'Live Key Connected' : 'Enter API Key'}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{role} Mode</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                title="Configure NVIDIA API Key & Model"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  showSettings
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Chat History"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close AI Assistant"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* NVIDIA API Key Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 text-xs animate-in slide-in-from-top-2 duration-150 overflow-y-auto max-h-[340px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Key className="w-4 h-4" />
                  <span>NVIDIA API Key Configuration</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              {/* API Key Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>NVIDIA API Key:</span>
                  <a
                    href="https://build.nvidia.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5"
                  >
                    Get key on build.nvidia.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  value={nvidiaApiKey}
                  onChange={(e) => handleSaveKey(e.target.value)}
                  placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white font-mono-code placeholder-slate-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  You can enter your key here in the UI or set <code className="text-emerald-400">NVIDIA_API_KEY</code> in your environment for your live website.
                </p>
              </div>

              {/* Model Identifier */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  NVIDIA Model:
                </label>
                <input
                  type="text"
                  value={selectedModel}
                  onChange={(e) => handleSaveModel(e.target.value)}
                  placeholder="nvidia/llama-3.1-nemotron-70b-instruct"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white font-mono-code focus:outline-none"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    'nvidia/llama-3.1-nemotron-70b-instruct',
                    'nvidia/nemotron-4-340b-instruct',
                    'meta/llama-3.1-70b-instruct',
                    'meta/llama-3.3-70b-instruct',
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSaveModel(m)}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer"
                    >
                      {m.split('/').pop()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Button & Status */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingKey}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isTestingKey ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Testing API Key...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      Test Key
                    </>
                  )}
                </button>

                {testResult && (
                  <div
                    className={`flex-1 p-2 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 ${
                      testResult.success
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-700'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    )}
                    <span className="truncate">{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Language Switcher Bar */}
          <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Languages className="w-3 h-3 text-sky-400" />
              <span>Language:</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {['English', 'Español', 'বাংলা (Bengali)', 'हिन्दी (Hindi)', 'Tagalog'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.split(' ')[0])}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                    selectedLanguage === lang.split(' ')[0]
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {lang.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-900">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {isUser ? user?.name || 'You' : 'NVIDIA Nemotron AI'}
                    </span>
                    {msg.model && (
                      <span className="text-[9px] px-1 rounded bg-slate-800 text-emerald-400 font-mono-code">
                        {msg.model.split('/').pop()}
                      </span>
                    )}
                    <span className="text-[9px] text-slate-500 font-mono-code">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed group ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-tr-xs shadow-xs'
                        : msg.isError
                        ? 'bg-rose-950/80 text-rose-200 border border-rose-700/80 rounded-tl-xs'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {!isUser ? (
                      <div className="prose prose-invert prose-xs max-w-none text-slate-200 space-y-2">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {/* Copy Button */}
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-700/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span className="font-medium">NVIDIA Nemotron is generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {currentPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-sky-400" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask Nemotron about symptoms, medications, consent...`}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-40 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
