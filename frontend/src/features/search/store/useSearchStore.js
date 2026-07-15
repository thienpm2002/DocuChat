import { create } from "zustand";

const useSearchStore = create((set) => ({
    open: false,

    tab: "chats",

    setOpen: (open) =>
        set({
            open,
        }),
    
    setTab: (tab) => set({ tab }),    
}));

export default useSearchStore;