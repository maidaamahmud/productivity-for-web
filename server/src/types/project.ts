import { Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  tasks?: ITask[];
}

export interface ITask extends Document {
  description: string;
  ranking: number;
  status: string;
  inSprint: boolean;
}
