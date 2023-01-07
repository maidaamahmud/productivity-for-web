import { Router } from "express";
import {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
  addTask,
} from "../controllers/projects";
import { getSprints, addSprint } from "../controllers/sprints";

const router: Router = Router();

// project routes
router.get("/projects", getProjects);

router.get("/projects/:id", getProject);

router.post("/add-project", addProject);

router.put("/update-project/:id", updateProject);

router.delete("/delete-project/:id", deleteProject);

router.put("/projects/:id/add-task", addTask);

// sprint routes
router.get("/sprints", getSprints);

router.post("/add-sprint", addSprint);

export default router;
