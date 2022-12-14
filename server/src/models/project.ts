import { IProject, ITask } from "./../types/project";
import { model, Schema } from "mongoose";

const taskSchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    ranking: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    lists: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const projectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: taskSchema,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
export const Task = model<ITask>("student", taskSchema);
