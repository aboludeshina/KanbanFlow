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
    backlog: { id: 'backlog', title: 'Backlog', cardIds: ['card-1', 'card-2', 'card-7'] },
    todo: { id: 'todo', title: 'To Do', cardIds: ['card-3', 'card-4'] },
    inProgress: { id: 'inProgress', title: 'In Progress', cardIds: ['card-5'] },
    done: { id: 'done', title: 'Done', cardIds: ['card-6'] }
  },
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Research React 19 Server Components',
      description: 'Deep dive into the new RSC architecture and how it integrates with Vite.',
      priority: 'Low',
      tag: 'Learning',
      dueDate: '2025-12-25',
      createdAt: new Date('2025-01-20').toISOString(),
      movedTo: {
        backlog: new Date('2025-01-20').toISOString(),
        todo: new Date('2025-01-21').toISOString()
      }
    },
    'card-2': {
      id: 'card-2',
      title: 'Optimize image loading',
      description: 'Implement lazy loading and WebP conversion for all dashboard images to improve LCP.',
      priority: 'Medium',
      tag: 'Enhancement',
      dueDate: '',
      createdAt: new Date('2025-01-18').toISOString(),
      movedTo: {
        backlog: new Date('2025-01-18').toISOString()
      }
    },
    'card-3': {
      id: 'card-3',
      title: 'Fix mobile navigation menu',
      description: 'Hamburger menu does not close when clicking outside the drawer on iOS devices.',
      priority: 'Urgent',
      tag: 'Bug',
      dueDate: '2025-10-30',
      createdAt: new Date('2025-01-19').toISOString(),
      movedTo: {
        backlog: new Date('2025-01-19').toISOString(),
        todo: new Date('2025-01-19').toISOString()
      }
    },
    'card-4': {
      id: 'card-4',
      title: 'Dark Mode Implementation',
      description: 'Add system preference detection and manual toggle for dark/light themes.',
      priority: 'High',
      tag: 'Feature',
      dueDate: '2025-11-05',
      createdAt: new Date('2025-01-17').toISOString(),
      movedTo: {
        backlog: new Date('2025-01-17').toISOString(),
        todo: new Date('2025-01-17').toISOString(),
        inProgress: new Date('2025-01-20').toISOString()
      }
    },
    'card-5': {
      id: 'card-5',
      title: 'User Profile Settings',
      description: 'Allow users to update avatar, change password, and manage email notifications.',
      priority: 'High',
      tag: 'Feature',
      dueDate: '2025-11-15',
      createdAt: new Date('2025-01-16').toISOString(),
      movedTo: {
        backlog: new Date('2025-01-16').toISOString(),
        todo: new Date('2025-01-16').toISOString(),
        inProgress: new Date('2025-01-18').toISOString(),
        done: new Date('2025-01-21').toISOString()
      }
    },
    'card-6': {
      id: 'card-6',
      title: 'Initial Project Setup',
      description: 'Set up Vite, TypeScript, Tailwind CSS, and folder structure.',
      priority: 'None',
      tag: 'Enhancement',
      dueDate: '2025-10-01',
      createdAt: new Date('2025-01-15').toISOString(),
      movedTo: {
        backlog: new Date('2025-01-15').toISOString(),
        todo: new Date('2025-01-15').toISOString(),
        inProgress: new Date('2025-01-15').toISOString(),
        done: new Date('2025-01-16').toISOString()
      }
    },
    'card-7': {
      id: 'card-7',
      title: 'AI Auto-categorization',
      description: 'Explore using Gemini API to automatically tag incoming tasks based on description.',
      priority: 'Medium',
      tag: 'Idea',
      dueDate: '',
      createdAt: new Date('2025-01-22').toISOString(),
      movedTo: {
        backlog: new Date('2025-01-22').toISOString()
      }
    }
  },
  columnOrder: ['backlog', 'todo', 'inProgress', 'done']
};

export const PRIORITIES: Priority[] = ['None', 'Low', 'Medium', 'High', 'Urgent'];
export const TAGS: Tag[] = ['Bug', 'Feature', 'Enhancement', 'Learning', 'Idea'];