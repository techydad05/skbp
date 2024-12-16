import { writable } from 'svelte/store';

interface User {
    id: string;
    email: string;
    username?: string;
}

export const showAuthModal = writable(false);
export const authMode = writable<'login' | 'register'>('login');
export const currentUser = writable<User | null>(null);

// Helper functions to manage user state
export const setUser = (user: User | null) => {
    currentUser.set(user);
    if (user) {
        showAuthModal.set(false);
    }
};

export const logout = () => {
    currentUser.set(null);
};
