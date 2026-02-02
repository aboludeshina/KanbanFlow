import React, { useState, useEffect } from 'react';
import { FaTimes, FaCog, FaServer, FaKey, FaMicrochip, FaLink } from 'react-icons/fa';
import { AppSettings, Provider, ProviderSettings } from '../types';
import { PROVIDERS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      // Ensure we have a valid structure even if something weird was passed
      if (!settings.providerSettings) {
        // Fallback if migration didn't run or failed (shouldn't happen with App.tsx fix)
        setFormData({
          provider: settings.provider,
          providerSettings: {
            gemini: { apiKey: '', model: '' },
            zhipu: { apiKey: '', model: '' }
          }
        });
      } else {
        setFormData(settings);
      }
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const activeProviderId = formData.provider;
  const activeProviderConfig = PROVIDERS.find(p => p.id === activeProviderId) || PROVIDERS[0];

  // Safe access to provider settings
  const currentProviderSettings = formData.providerSettings?.[activeProviderId] || { apiKey: '', model: '' };

  const handleProviderChange = (newProvider: Provider) => {
    // Ensure the new provider has an entry in providerSettings
    const updatedSettings = { ...formData, provider: newProvider };
    if (!updatedSettings.providerSettings[newProvider]) {
      updatedSettings.providerSettings[newProvider] = { apiKey: '', model: '' };
    }

    // If model is not set for this provider, set default
    if (!updatedSettings.providerSettings[newProvider].model) {
      const providerConfig = PROVIDERS.find(p => p.id === newProvider);
      if (providerConfig) {
        updatedSettings.providerSettings[newProvider].model = providerConfig.defaultModel;
      }
    }

    setFormData(updatedSettings);
  };

  const handleApiKeyChange = (value: string) => {
    setFormData({
      ...formData,
      providerSettings: {
        ...formData.providerSettings,
        [activeProviderId]: {
          ...currentProviderSettings,
          apiKey: value
        }
      }
    });
  };

  const handleModelChange = (value: string) => {
    // Normalize Zhipu model if needed
    const normalizedValue = activeProviderId === 'zhipu' ? value.trim().toLowerCase() : value;

    setFormData({
      ...formData,
      providerSettings: {
        ...formData.providerSettings,
        [activeProviderId]: {
          ...currentProviderSettings,
          model: normalizedValue
        }
      }
    });
  };

  const handleEndpointChange = (value: string) => {
    setFormData({
      ...formData,
      providerSettings: {
        ...formData.providerSettings,
        [activeProviderId]: {
          ...currentProviderSettings,
          endpoint: value
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center space-x-2.5 text-black dark:text-white">
            <span className="text-neutral-500"><FaCog size={20} /></span>
            <h2 className="text-xl font-bold">Settings</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            <span><FaTimes /></span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wide">
              AI Provider
            </label>
            <div className="relative">
              <select
                value={formData.provider}
                onChange={(e) => handleProviderChange(e.target.value as Provider)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-1 focus:ring-black dark:focus:ring-white text-sm appearance-none"
              >
                {PROVIDERS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><FaServer size={12} /></span>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wide">
              API Key {formData.provider === 'gemini' ? '(Optional if env set)' : '(Required)'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={currentProviderSettings.apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={`Enter ${activeProviderConfig.name} API Key`}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-1 focus:ring-black dark:focus:ring-white text-sm placeholder:text-neutral-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><FaKey size={12} /></span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1.5">
              Your key is stored locally in your browser.
            </p>
          </div>

          {/* API Endpoint */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wide">
              API Endpoint (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentProviderSettings.endpoint || ''}
                onChange={(e) => handleEndpointChange(e.target.value)}
                placeholder={activeProviderConfig.endpoint || 'Default endpoint'}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-1 focus:ring-black dark:focus:ring-white text-sm placeholder:text-neutral-400 font-mono text-xs"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><FaLink size={12} /></span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1.5">
              Leave empty to use the default endpoint. Use for proxies or custom deployments.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wide">
              Model
            </label>
            <div className="relative">
              <select
                value={currentProviderSettings.model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-1 focus:ring-black dark:focus:ring-white text-sm appearance-none"
              >
                {activeProviderConfig.models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
                {/* Fallback if current model isn't in list (e.g. custom input previously) */}
                {!activeProviderConfig.models.includes(currentProviderSettings.model) && currentProviderSettings.model && (
                  <option value={currentProviderSettings.model}>{currentProviderSettings.model}</option>
                )}
              </select>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><FaMicrochip size={12} /></span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1.5">
              Select the model to use for task generation.
            </p>
          </div>

          <div className="flex justify-end pt-2 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-black dark:bg-black dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;