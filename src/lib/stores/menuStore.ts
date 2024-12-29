/**
 * Store for managing UI menu states across the application
 * This centralizes menu state management and provides type-safe access
 */
import { writable } from 'svelte/store';

interface MenuState {
  userMenuOpen: boolean;
}

function createMenuStore() {
  const { subscribe, update, set } = writable<MenuState>({
    userMenuOpen: false
  });

  return {
    subscribe,
    toggleUserMenu: () => update(state => ({ ...state, userMenuOpen: !state.userMenuOpen })),
    closeUserMenu: () => update(state => ({ ...state, userMenuOpen: false })),
    reset: () => set({ userMenuOpen: false })
  };
}

export const menuStore = createMenuStore();
