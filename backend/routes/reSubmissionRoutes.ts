import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authRole from "../middleware/authRole.js";
import { createReSubmissionRequest, getMyReSubmissionRequests, getReSubmissionRequests, getRevertBackRequests, reSubmitTask, revertReSubmissionRequest } from "../controllers/reSubmissionRequestControllers.js";
import { taskUploadMiddleware } from "../utils/multer.js";

const reSubmissionRouter = express.Router();

reSubmissionRouter.post('/createReSubmissionRequest', authMiddleware, createReSubmissionRequest);
reSubmissionRouter.get('/getMyReSubmissionRequests', authMiddleware, getMyReSubmissionRequests);
reSubmissionRouter.patch('/revertReSubmissionRequest', authMiddleware, authRole('Admin'), revertReSubmissionRequest);
reSubmissionRouter.get('/getReSubmissionRequests', authMiddleware, authRole('Admin'), getReSubmissionRequests);
reSubmissionRouter.get('/getRevertBackReSubmissionRequests', authMiddleware, authRole('Admin'), getRevertBackRequests);
reSubmissionRouter.put('/reSubmitTask', authMiddleware, taskUploadMiddleware.array('images', 4), reSubmitTask);

export default reSubmissionRouter;