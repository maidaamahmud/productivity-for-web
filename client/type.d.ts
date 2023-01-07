export interface IProject {
  _id: string;
  name: string;
  tasks?: ITask[];
  createdAt?: string;
  updatedAt?: string;
}

interface ITask {
  _id: string;
  description: string;
  ranking: number;
  status: string;
  inSprint: boolean;
}

export interface ISprint {
  _id: string;
  tasks?: ITask[];
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ApiDataType = {
  message: string;
  status: string;
  projects: IProject[];
  project?: IProject;
};
