import { Router } from "express";
import { getProjects, addProject } from "../controllers/projects";

const router: Router = Router();

router.get("/projects", getProjects);

router.post("/project", addProject);

export default router;
