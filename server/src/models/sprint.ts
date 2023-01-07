import { ITask } from "./../types/project";
import { ISprint } from "./../types/sprint";
import { taskSchema } from "./project";
import { model, Schema } from "mongoose";

// const taskSchema: Schema = new Schema(
//   {
//     description: {
//       type: String,
//       required: true,
//     },
//     ranking: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//     inSprint: {
//       type: Boolean,
//       required: true,
//     },
//   },
//   { timestamps: true }
// ); //FIXME: DONT RE-DEFINE SCHEMA AND MAYBE ADD IN PROJECT DATA TOO KEEPING IN MIND ALL NEEDED PROJECT DATA MUST BE INCLUDED NOT JUST ID

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
      required: true,
    },
  },
  { timestamps: true }
);

export const Sprint = model<ISprint>("Sprint", sprintSchema);
