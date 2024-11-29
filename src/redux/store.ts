import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistReducer, persistStore
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slice';

const persistConfig = {
    key: 'root',
    storage,
    version: 1
};

const reducer = combineReducers({
    auth: authReducer
})
const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
    reducer: {
        auth: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

const persistor = persistStore(store)

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
