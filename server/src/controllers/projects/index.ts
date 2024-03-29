import { Response, Request } from "express";
import { IProject, ITask } from "./../../types/project";
import { Project, Task } from "../../models/project";

const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects: IProject[] = await Project.find();
    const projectsOrdered = projects.reverse();
    res.status(200).json({ projects: projectsOrdered });
  } catch (error) {
    throw error;
  }
};

const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const selectedProject: IProject | null = await Project.findById(
      req.params.id
    );
    res.status(200).json({
      project: selectedProject,
    });
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
          status: "todo",
          inSprint: false,
        });
        tasksArray.push(newTask);
      }
    }

    const project: IProject = new Project({
      name: body.name || "Unnamed Project",
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

const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const newTask: ITask = new Task({
      description: body.description,
      ranking: body.ranking || 1,
      status: "todo",
      inSprint: false,
    });

    Project.findOneAndUpdate(
      { _id: id },
      { $push: { tasks: newTask } },
      function (error: any, success: any) {
        if (error) {
          console.log("error", error);
        }
      }
    );

    res.status(200).json({
      task: newTask,
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

export {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
  addTask,
};
