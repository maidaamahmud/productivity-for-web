import { Document } from "mongoose";
import { ITask } from "./project";

export interface ISprint extends Document {
  tasks: ITask[] | null;
  completed?: boolean;
}
