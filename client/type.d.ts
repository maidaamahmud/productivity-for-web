export interface IProject {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  tasks?: ITask[];
  createdAt?: string;
  updatedAt?: string;
}

interface ITask {
  _id: string;
  description: string;
  ranking: number;
  status: boolean;
  lists: string[];
}

interface ProjectProps {
  project: IProject; //FIXME: needed?
}

export type ApiDataType = {
  message: string;
  status: string;
  projects: IProject[];
  project?: IProject; //FIXME: needed?
};
