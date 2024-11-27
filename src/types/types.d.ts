declare module 'path';
declare module 'url';

type columnId = 'todo' | 'inProgress' | 'done';

interface Task {
  id: number;
  content: string;
}

interface ImportMeta {
  url: string;
}

