// API Base URL
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get auth token
const getToken = () => {
    if (typeof window !== "undefined") {
        const auth = localStorage.getItem("creativehub-auth");
        if (auth) {
            try {
                return JSON.parse(auth).token;
            } catch {
                return null;
            }
        }
    }
    return null;
};

// Fetch wrapper with auth
export const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Something went wrong");
        error.errorSources = data.errorSources;
        error.data = data;
        throw error;
    }

    return data;
};

// ==================== AUTH SERVICE ====================
export const authService = {
    login: (credentials) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

    register: (userData) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

    getMe: () => apiFetch('/api/users/me'),

    updateProfile: (data) => apiFetch('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

    changePassword: (data) => apiFetch('/api/users/change-password', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ==================== USER SERVICE ====================
export const userService = {
    getAll: (params = "") => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/users/admin/all${queryString}`);
    },

    getById: (id) => apiFetch(`/api/users/admin/${id}`),

    update: (id, data) => apiFetch(`/api/users/admin/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`/api/users/admin/${id}`, { method: 'DELETE' }),

    getStats: () => apiFetch('/api/users/admin/stats'),
};

// ==================== NOTIFICATION SERVICE ====================
export const notificationService = {
    getAll: (limit = 10) =>
        apiFetch(`/api/notifications?limit=${limit}`),

    markAsRead: (id) =>
        apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" }),

    markAllAsRead: () =>
        apiFetch("/api/notifications/read-all", { method: "PATCH" }),
};

// ==================== DESIGN/THEME SERVICE ====================
export const designService = {
    get: () =>
        apiFetch("/api/design"),

    update: (data) =>
        apiFetch("/api/design", { method: "PATCH", body: JSON.stringify(data) }),
};

// ==================== STATS SERVICE ====================
export const statsService = {
    getUserStats: () =>
        apiFetch("/api/stats/user"),
    getDashboardStats: () =>
        apiFetch("/api/stats/dashboard"),
};

// ==================== PLATFORM/MODULE SERVICE ====================
export const platformService = {
    getEnabledModules: () =>
        apiFetch("/api/platforms/settings/modules"),

    updateEnabledModules: (modules) =>
        apiFetch("/api/platforms/settings/modules", {
            method: "PATCH",
            body: JSON.stringify(modules),
        }),
};

// ==================== SPREADSHEET SERVICE ====================
export const spreadsheetService = {
    getAll: () => apiFetch('/api/spreadsheet'),
    getById: (id) => apiFetch(`/api/spreadsheet/${id}`),
    create: (data) => apiFetch('/api/spreadsheet/create', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/api/spreadsheet/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/api/spreadsheet/${id}`, { method: 'DELETE' }),
};

// ==================== FLOW SERVICE ====================
export const flowService = {
    getAll: () => apiFetch('/api/flows'),
    getById: (id) => apiFetch(`/api/flows/${id}`),
    create: (data) => apiFetch('/api/flows', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/api/flows/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/api/flows/${id}`, { method: 'DELETE' }),
    duplicate: (id) => apiFetch(`/api/flows/${id}/duplicate`, { method: 'POST' }),
    toggleActive: (id) => apiFetch(`/api/flows/${id}/toggle-active`, { method: 'PATCH' }),
};

