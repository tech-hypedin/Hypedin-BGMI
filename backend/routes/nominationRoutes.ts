import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkForNominatedPlayer, nominatePlayer } from "../controllers/nominationControllers.js";
import { taskUploadMiddleware } from "../utils/multer.js";
import authorizeRole from "../middleware/authRole.js";

const nominationRoutes = express.Router();

nominationRoutes.post("/nominatePlayer", authMiddleware, authorizeRole("Ambassador"), taskUploadMiddleware.array('playerImages', 2), nominatePlayer);
nominationRoutes.get("/checkNomination", authMiddleware, authorizeRole("Ambassador"), checkForNominatedPlayer);

export default nominationRoutes;