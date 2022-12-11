export interface IProject {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  tasks: ITask[];
  createdAt?: string;
  updatedAt?: string;
}

interface ITask {
  description: string;
  ranking: number;
  status: boolean;
  lists: string[];
}
