import tokenReducer from '../reducers/tokenSlice';
import fcmTokenReducer from '../reducers/fcmTokenSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        token: tokenReducer,
        fcmToken: fcmTokenReducer
    }
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
