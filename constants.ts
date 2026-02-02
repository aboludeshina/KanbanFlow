import { Priority, Tag, Provider } from './types';

export const PRIORITY_COLORS: Record<Priority, string> = {
  None: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  Low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20',
  Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-400/20',
  High: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 ring-1 ring-inset ring-orange-600/20 dark:ring-orange-400/20',
  Urgent: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 ring-1 ring-inset ring-rose-600/20 dark:ring-rose-400/20',
};

export const TAG_COLORS: Record<Tag, string> = {
  Bug: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300',
  Feature: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300',
  Enhancement: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-300',
  Learning: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-300',
  Idea: 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20 dark:text-fuchsia-300',
};

interface ProviderConfig {
  id: Provider;
  name: string;
  defaultModel: string;
  endpoint?: string;
  models: string[];
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    defaultModel: 'gemini-3.0-flash',
    models: [
      'gemini-3.0-flash',
      'gemini-3.0-pro',
      'gemini-2.5-flash'
    ]
  },
  {
    id: 'zhipu',
    name: 'Zhipu AI (GLM) - Z.ai Endpoint',
    defaultModel: 'glm-4.7',
    endpoint: 'https://api.z.ai/api/coding/paas/v4/chat/completions',
    models: [
      'glm-4.6',
      'glm-4.7'
    ]
  },
];
