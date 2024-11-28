import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Search from './Search';


const initialState = { kanban: { searchTerm: '' } };

describe('Search Component', () => {
  it('renders the search button and input', () => {
    const store = configureStore({
      reducer: { kanban: () => initialState.kanban },
      preloadedState: initialState,
    });
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('dispatches the searchTerm action on input change', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionLogger = () => (next: any) => (action: any) => {
      actions.push(action);
      return next(action);
    };

    const store = configureStore({
      reducer: { kanban: () => initialState.kanban },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(actionLogger),
    });

    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(actions).toContainEqual({ type: 'kanban/searchTerm', payload: 'test' });
  });
});
