import { Router } from "express";
import {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
  addTask,
} from "../controllers/projects";

const router: Router = Router();

router.get("/projects", getProjects);

router.get("/projects/:id", getProject);

router.post("/add-project", addProject);

router.put("/update-project/:id", updateProject);

router.delete("/delete-project/:id", deleteProject);

router.put("/projects/:id/add-task", addTask);

export default router;
