import { create } from "zustand";

// ============================================================
// Admin store — zustand (NO persistir en localStorage por seguridad)
// ============================================================

interface AdminState {
  csrfToken: string | null;
  isAuthed: boolean;
  setCsrfToken: (token: string | null) => void;
  setAuthed: (authed: boolean) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  csrfToken: null,
  isAuthed: false,
  setCsrfToken: (token) => set({ csrfToken: token }),
  setAuthed: (authed) => set({ isAuthed: authed }),
  logout: () => set({ csrfToken: null, isAuthed: false }),
}));
