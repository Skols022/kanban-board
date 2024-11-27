import { configureStore } from '@reduxjs/toolkit';
import { createTransform, PERSIST, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { combineReducers } from 'redux';
import kanbanReducer, { KanbanState } from '@/features/kanban/kanbanSlice';

const omitSearchTermTransform = createTransform(
  
  (inboundState: KanbanState) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { searchTerm, ...rest } = inboundState;
    return rest as KanbanState;
  },
  
  (outboundState: KanbanState) => outboundState,
  { whitelist: ['kanban'] } 
);

const persistConfig = {
  key: 'root',
  storage,
  transform: [omitSearchTermTransform],
};

const rootReducer = combineReducers({
  kanban: kanbanReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
