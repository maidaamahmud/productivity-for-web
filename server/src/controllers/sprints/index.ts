import { Response, Request } from "express";
import { ISprint } from "./../../types/sprint";
import { Sprint } from "../../models/sprint";

const getSprints = async (req: Request, res: Response): Promise<void> => {
  try {
    const sprints: ISprint[] = await Sprint.find();
    const orderedSprints = sprints.reverse();
    res.status(200).json({ sprints: orderedSprints });
  } catch (error) {
    throw error;
  }
};

const addSprint = async (req: Request, res: Response): Promise<void> => {
  try {
    const sprint: ISprint = new Sprint({
      tasks: null,
      completed: null,
    });

    const newSprint: ISprint = await sprint.save();

    res.status(201).json({
      sprint: newSprint,
    });
  } catch (error) {
    throw error;
  }
};

const updateSprint = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const updatedSprint: ISprint | null = await Sprint.findByIdAndUpdate(
      { _id: id },
      body
    );
    res.status(200).json({
      project: updatedSprint,
    });
  } catch (error) {
    throw error;
  }
};

export { getSprints, addSprint, updateSprint };
