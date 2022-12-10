import { Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  tasks: ITask[];
}

export interface ITask extends Document {
  description: string;
  ranking: number;
  status: boolean;
  lists: string[];
}
