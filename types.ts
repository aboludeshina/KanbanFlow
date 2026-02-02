export type Priority = 'None' | 'Low' | 'Medium' | 'High' | 'Urgent';
export type Tag = 'Bug' | 'Feature' | 'Enhancement' | 'Learning' | 'Idea';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tag: Tag;
  dueDate: string; // ISO Date string
  createdAt: string; // ISO Date string for when the card was created
  movedTo: { [columnId: string]: string }; // Track when card was moved to each column
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardData {
  columns: { [key: string]: Column };
  cards: { [key: string]: Card };
  columnOrder: string[];
}

export type Provider = 'gemini' | 'zhipu';

export interface ProviderSettings {
  apiKey: string;
  model: string;
  endpoint?: string;
}

export interface AppSettings {
  provider: Provider;
  providerSettings: Record<Provider, ProviderSettings>;
}

export const DEFAULT_SETTINGS: AppSettings = {
  provider: 'gemini',
  providerSettings: {
    gemini: { apiKey: '', model: '' },
    zhipu: { apiKey: '', model: '' }
  }
};

export const INITIAL_DATA: BoardData = {
  columns: {
    backlog: { id: 'backlog', title: 'Backlog', cardIds: [] },
    todo: { id: 'todo', title: 'To Do', cardIds: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', cardIds: [] },
    done: { id: 'done', title: 'Done', cardIds: [] }
  },
  cards: {},
  columnOrder: ['backlog', 'todo', 'inProgress', 'done']
};

export const PRIORITIES: Priority[] = ['None', 'Low', 'Medium', 'High', 'Urgent'];
export const TAGS: Tag[] = ['Bug', 'Feature', 'Enhancement', 'Learning', 'Idea'];