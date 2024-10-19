import unreadNotifySlice from '@/reducers/unreadNotifySlice';
import tokenReducer from '../reducers/tokenSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        token: tokenReducer,
        unreadNotify: unreadNotifySlice
    }
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
