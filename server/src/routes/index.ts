import { Router } from "express";
import { getProjects } from "../controllers/projects";

const router: Router = Router();

router.get("/projects", getProjects);

export default router;
