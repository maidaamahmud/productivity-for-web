import { Router } from "express";
import {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
} from "../controllers/projects";

const router: Router = Router();

router.get("/projects", getProjects);

router.get("/projects/:id", getProject);

router.post("/add-project", addProject);

router.put("/edit-project/:id", updateProject);

router.delete("/delete-project/:id", deleteProject);

export default router;
