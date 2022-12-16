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
  isSprint: boolean;
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
