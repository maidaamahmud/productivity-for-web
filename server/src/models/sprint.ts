import { ITask } from "./../types/project";
import { ISprint } from "./../types/sprint";
import { taskSchema } from "./project";
import { model, Schema } from "mongoose";

const sprintSchema: Schema = new Schema(
  {
    tasks: [
      {
        type: taskSchema,
        required: false,
      },
    ],
    completed: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

export const Sprint = model<ISprint>("Sprint", sprintSchema);
