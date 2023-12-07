import { create } from 'zustand';

const useContactForm = create<{ open: boolean; setOpen: (open: boolean) => void }>()((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
}));

export default useContactForm;
