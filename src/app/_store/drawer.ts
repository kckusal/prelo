import { create } from "zustand";

const drawerKeys = ["AddDocDrawer", "UpdateScheduleDrawer"] as const;

type DrawerKey = (typeof drawerKeys)[number];
interface DrawerState {
  isOpen: boolean;
}

interface DrawerStore {
  drawer: Record<DrawerKey, DrawerState>;
  openDrawer: (drawer: DrawerKey) => void;
  closeDrawer: (drawer: DrawerKey) => void;
}

export const useDrawer = create<DrawerStore>()((set) => ({
  drawer: {
    AddDocDrawer: { isOpen: false },
    UpdateScheduleDrawer: { isOpen: false },
  },

  openDrawer: (drawerKey: DrawerKey) =>
    set((state) => ({
      drawer: {
        ...state.drawer,
        [drawerKey]: { isOpen: true },
      },
    })),
  closeDrawer: (drawerKey: DrawerKey) =>
    set((state) => ({
      drawer: {
        ...state.drawer,
        [drawerKey]: { isOpen: false },
      },
    })),
}));
