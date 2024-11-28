// src/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthType {
    token: string;
    name: string;
}

const initialState: AuthType = {
    token: '',
    name: ''
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string, name: string }>) => {
            state.token = action.payload.token;
            state.name = action.payload.name;
        },
        logout: (state) => {
            state.token = '';
            state.name = '';
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
