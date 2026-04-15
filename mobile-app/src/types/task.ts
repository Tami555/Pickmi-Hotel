export interface ManagementTask {
  id: string;
  title: string;
  progress: number;
  color: string;
}

export interface CurrentTask {
  id: string;
  room: string;
  completed: boolean;
}