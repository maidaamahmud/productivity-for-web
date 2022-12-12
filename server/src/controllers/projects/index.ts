import { Response, Request } from "express";
import { IProject } from "./../../types/project";
import Project from "../../models/project";

const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects: IProject[] = await Project.find();
    res.status(200).json({ projects });
  } catch (error) {
    throw error;
  }
};

const addProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const project: IProject = new Project({
      name: body.name,
      startDate: body.startDate,
      endDate: body.endDate,
      tasks: body.tasks,
    });

    const newProject: IProject = await project.save();
    const allProject: IProject[] = await Project.find();

    res.status(201).json({
      message: "Project added",
      project: newProject,
      projects: allProject,
    });
  } catch (error) {
    throw error;
  }
};

export { getProjects, addProject };
