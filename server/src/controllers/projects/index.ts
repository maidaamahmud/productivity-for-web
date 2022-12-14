import { Response, Request } from "express";
import { IProject, ITask } from "./../../types/project";
import { Project, Task } from "../../models/project";

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

    const tasksArray: ITask[] = [];
    for (var i in body.tasks) {
      const taskObject = body.tasks[i];
      if (taskObject.description) {
        const newTask: ITask = new Task({
          description: taskObject.description,
          ranking: taskObject.ranking || 1,
          lists: [],
          status: false,
        });
        tasksArray.push(newTask);
      }
    }

    const project: IProject = new Project({
      name: body.name || "Unnamed Project",
      startDate: body.startDate, //FIXME: find default for these or make it non required
      endDate: body.endDate,
      tasks: tasksArray,
    });

    const newProject: IProject = await project.save();

    res.status(201).json({
      project: newProject,
    });
  } catch (error) {
    throw error;
  }
};

const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const updatedProject: IProject | null = await Project.findByIdAndUpdate(
      { _id: id },
      body
    );
    res.status(200).json({
      project: updatedProject,
    });
  } catch (error) {
    throw error;
  }
};

const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProject: IProject | null = await Project.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      project: deletedProject,
    });
  } catch (error) {
    throw error;
  }
};

export { getProjects, addProject, updateProject, deleteProject };
