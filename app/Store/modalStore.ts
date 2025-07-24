// store/modalStore.ts
import { create } from "zustand";

interface ModalStore {
  isTopUpModalOpen: boolean;
  openTopUpModal: () => void;
  closeTopUpModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isTopUpModalOpen: false,
  openTopUpModal: () => set({ isTopUpModalOpen: true }),
  closeTopUpModal: () => set({ isTopUpModalOpen: false }),
}));
