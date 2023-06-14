import { Schedule } from "@/app/task.interface";
import { create } from "zustand";
interface ScheduleState {
  schedule: Schedule[];
  selectedData: any | null;
  error: any;
  isLoading: boolean;
  fetching: () => void;
  getAllSchedule: (sched: any[]) => void;
  addSchedule: (sched: any) => void;
  selectOneSchedule: (id: string) => void;
  removeSchedule: (id: string) => void;
  updateSchedule: (id: string, data: any) => void;
}

const useScheduleStore = create<ScheduleState>((set) => ({
  schedule: [],
  selectedData: null,
  error: null,
  isLoading: false,
  fetching: () => {
    set((state) => ({
      isLoading: true,
    }));
  },

  getAllSchedule: (sched: any) => {
    set((state) => ({
      schedule: sched,
      isLoading: false,
    }));
  },
  addSchedule: (sched: any) => {
    console.log(sched);

    set((state) => ({
      schedule: [...state.schedule, sched],
      isLoading: false,
    }));
  },

  selectOneSchedule: (id: string) => {
    set((state) => ({
      selectedData: state.schedule.find((sched) => sched.id === id),
      isLoading: false,
    }));
  },
  removeSchedule: (id: string) => {
    set((state) => ({
      schedule: state.schedule.filter((task) => task.id !== id),
      isLoading: false,
    }));
  },

  updateSchedule: (id: string, data: any) => {
    set((state) => ({
      schedule: state.schedule.map((sched) =>
        sched.id === id ? { ...sched, data } : sched
      ),
      isLoading: false,
    }));
  },
}));

export default useScheduleStore;
