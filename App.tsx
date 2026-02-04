import React, { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_DATA, BoardData, AppSettings, DEFAULT_SETTINGS } from './types';
import Board from './components/Board';
import SettingsModal from './components/SettingsModal';
import ImportExportModal from './components/ImportExportModal';
import PrivacyModal from './components/PrivacyModal';
import { FaMoon, FaSun, FaGithub, FaCog, FaFileImport } from 'react-icons/fa';

const App: React.FC = () => {
  const [data, setData] = useLocalStorage<BoardData>('kanban-board-data', INITIAL_DATA);
  const [settings, setSettings] = useLocalStorage<AppSettings>('kanban-board-settings', DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen privacy notice
    const hasSeenNotice = localStorage.getItem('hasSeenPrivacyNotice');
    if (!hasSeenNotice) {
      // Small delay to ensure smooth entrance animation after app load
      const timer = setTimeout(() => {
        setIsPrivacyModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePrivacyModalClose = () => {
    localStorage.setItem('hasSeenPrivacyNotice', 'true');
    setIsPrivacyModalOpen(false);
  };

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('theme') === 'dark' ||
        (!('theme' in window.localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    // Migration for old settings structure
    const oldSettings = settings as any;
    if (oldSettings.apiKey !== undefined && oldSettings.providerSettings === undefined) {
      console.log('Migrating old settings to new structure...');
      setSettings({
        provider: oldSettings.provider || 'gemini',
        providerSettings: {
          gemini: {
            apiKey: oldSettings.provider === 'gemini' ? oldSettings.apiKey : '',
            model: oldSettings.provider === 'gemini' ? oldSettings.model : ''
          },
          zhipu: {
            apiKey: oldSettings.provider === 'zhipu' ? oldSettings.apiKey : '',
            model: oldSettings.provider === 'zhipu' ? oldSettings.model : ''
          }
        }
      });
    }

    // Fix for Zhipu model naming (glm-4-7 -> glm-4.7, glm-4-6 -> glm-4.6)
    if (settings.providerSettings?.zhipu?.model === 'glm-4-7' || settings.providerSettings?.zhipu?.model === 'glm-4-6') {
      console.log('Migrating Zhipu model naming...');
      setSettings({
        ...settings,
        providerSettings: {
          ...settings.providerSettings,
          zhipu: {
            ...settings.providerSettings.zhipu,
            model: settings.providerSettings.zhipu.model === 'glm-4-7' ? 'glm-4.7' : 'glm-4.6'
          }
        }
      });
    }
  }, [settings, setSettings]);

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-hidden font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-6 py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 shadow-sm shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-neutral-800 to-black dark:from-white dark:to-neutral-300 rounded-xl shadow-lg flex items-center justify-center transform transition-transform hover:scale-105">
            <span className="text-white dark:text-black font-bold text-base md:text-lg">K</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white block">
            Kanban<span className="text-neutral-500 dark:text-neutral-400">Flow</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <button
            onClick={() => setIsImportExportOpen(true)}
            className="p-2 md:p-2.5 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            aria-label="Import/Export"
          >
            <span><FaFileImport size={18} /></span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 md:p-2.5 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            aria-label="Settings"
          >
            <span><FaCog size={18} /></span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 md:p-2.5 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition-all hidden sm:block"
          >
            <span><FaGithub size={20} /></span>
          </a>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 overflow-hidden relative">
        <Board data={data} setData={setData} settings={settings} />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        boardData={data}
        setBoardData={setData}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={handlePrivacyModalClose}
      />

      {/* Physical Dark Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-[100] group">
        <div
          onClick={() => setDarkMode(!darkMode)}
          className={`
            relative w-24 h-10 rounded-full cursor-pointer transition-all duration-300 shadow-xl border-2
            ${darkMode
              ? 'bg-neutral-900 border-neutral-700 shadow-neutral-950/50'
              : 'bg-neutral-100 border-white shadow-neutral-300/50'}
          `}
        >
          {/* Internal Track Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none select-none">
            <span className={`text-[10px] font-black tracking-tighter transition-opacity duration-300 ${darkMode ? 'opacity-100 text-neutral-500' : 'opacity-0'}`}>DARK</span>
            <span className={`text-[10px] font-black tracking-tighter transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-100 text-neutral-400'}`}>LIGHT</span>
          </div>

          {/* Sliding Knob */}
          <div className={`
            absolute top-1 bottom-1 w-10 rounded-full flex items-center justify-center transition-all duration-300 transform
            ${darkMode
              ? 'left-[calc(100%-44px)] bg-neutral-800 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),2px_2px_4px_rgba(0,0,0,0.5)]'
              : 'left-1 bg-white shadow-[inset_2px_2px_4px_rgba(255,255,255,1),2px_2px_6px_rgba(0,0,0,0.1)]'}
          `}>
            {darkMode
              ? <span className="text-yellow-500 text-xs transform -rotate-12 group-hover:rotate-0 transition-transform"><FaSun size={12} /></span>
              : <span className="text-neutral-400 text-xs transform rotate-12 group-hover:rotate-0 transition-transform"><FaMoon size={12} /></span>
            }
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;