import { Response, Request } from "express";
import { ISprint } from "./../../types/sprint";
import { Sprint } from "../../models/sprint";

const getSprints = async (req: Request, res: Response): Promise<void> => {
  try {
    const sprints: ISprint[] = await Sprint.find();
    res.status(200).json({ sprints });
  } catch (error) {
    throw error;
  }
};

const addSprint = async (req: Request, res: Response): Promise<void> => {
  try {
    const sprint: ISprint = new Sprint({
      tasks: null,
      completed: false,
    });

    const newSprint: ISprint = await sprint.save();

    res.status(201).json({
      sprint: newSprint,
    });
  } catch (error) {
    throw error;
  }
};

export { getSprints, addSprint };
