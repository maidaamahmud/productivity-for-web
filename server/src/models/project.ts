import { IProject, ITask } from "./../types/project";
import { model, Schema } from "mongoose";

export const taskSchema: Schema = new Schema(
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
      type: String,
      required: true,
    },
    inSprint: {
      type: Boolean,
      required: true,
    },
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
export const Task = model<ITask>("Task", taskSchema);
