import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner/LoadingSpinner';

const Board = lazy(() => import('@/components/kanban/Board/Board'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Board />
      </Suspense>
    </Layout>
  );
}

export default App;
