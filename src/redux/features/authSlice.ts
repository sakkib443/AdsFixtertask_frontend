import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: any;
    token: string | null;
    isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("creativehub-auth");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return { user: null, token: null, isAuthenticated: false };
            }
        }
    }
    return { user: null, token: null, isAuthenticated: false };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            if (typeof window !== "undefined") {
                localStorage.setItem("creativehub-auth", JSON.stringify(state));
            }
        },
        updateUser: (state, action: PayloadAction<any>) => {
            state.user = { ...state.user, ...action.payload };
            if (typeof window !== "undefined") {
                localStorage.setItem("creativehub-auth", JSON.stringify(state));
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== "undefined") {
                localStorage.removeItem("creativehub-auth");
            }
        },
    },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
