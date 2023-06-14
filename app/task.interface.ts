export interface Schedule {
  id: string;
  name: string;
  date: string;
  tasks: Tasks[];
  createdAt: any;
}

export interface Tasks {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
}
