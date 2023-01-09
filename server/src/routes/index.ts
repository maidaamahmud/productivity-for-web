import { Router } from "express";
import {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
  addTask,
} from "../controllers/projects";
import {
  getSprints,
  getSprint,
  addSprint,
  updateSprint,
} from "../controllers/sprints";

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

router.get("/sprints/:id", getSprint);

router.post("/add-sprint", addSprint);

router.put("/update-sprint/:id", updateSprint);

export default router;
