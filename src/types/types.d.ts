declare module 'path';
declare module 'url';

declare type SVGComponent = (props: SVGProps<SVGElement>) => ReactElement;

declare module '*.svg?react' {
  const component: SVGComponent;
  export default component;
}

type columnId = 'todo' | 'inProgress' | 'done';

interface Task {
  id: number;
  content: string;
}

interface ImportMeta {
  url: string;
}

