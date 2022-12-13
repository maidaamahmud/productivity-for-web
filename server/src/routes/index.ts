import { Router } from "express";
import {
  getProjects,
  addProject,
  updateProject,
} from "../controllers/projects";

const router: Router = Router();

router.get("/projects", getProjects);

router.post("/add-project", addProject);

router.put("/edit-project/:id", updateProject);

export default router;
