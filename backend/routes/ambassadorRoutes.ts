import express from 'express';

const router = express.Router();

import authRole from '../middleware/authRole.js';
import { taskUploadMiddleware } from '../utils/multer.js';
import authMiddleware from '../middleware/authMiddleware.js';
// import { getDashboardSync, getLeaderBoard, submitTaskIntel, getRewardsCatalog, getTasks, getSubmissionIntel, verifyAmbassador, getDashTasks, chooseAvator, registerPlayer, referFriend, sendNomination, getCohort } from '../controllers/ambassadorControllers.js';
import { getDashboardSync, getLeaderBoard, submitTaskIntel, getRewardsCatalog, getTasks, getSubmissionIntel, verifyAmbassador, getDashTasks, chooseAvator, registerPlayer, referFriend, getMyReferals, sendNomination, getCohort, deleteCohortPlayer, submitSpecificTask, leaderboardForSpecificTask, getSpecificTasks } from '../controllers/ambassadorControllers.js';

router.get('/', authMiddleware, authRole('Ambassador'), getDashboardSync);
router.get('/rewards', authMiddleware, authRole('Ambassador'), getRewardsCatalog);
router.get('/cohort', authMiddleware, authRole('Ambassador'), getCohort);
router.get('/getMissions', authMiddleware, authRole('Ambassador'), getTasks);
router.get('/leaderboard', authMiddleware, authRole('Ambassador'), getLeaderBoard);
router.get('/submissions', authMiddleware, authRole('Ambassador'), getSubmissionIntel);
router.get('/dash/missions', authMiddleware, authRole('Ambassador'), getDashTasks);
router.post('/mission', authMiddleware, authRole('Ambassador'), taskUploadMiddleware.array('images', 4), submitTaskIntel);
router.post('/nominate', authMiddleware, authRole('Ambassador'), taskUploadMiddleware.array('playerImages', 2), sendNomination);
router.patch('/verifyAmbassador', authMiddleware, authRole('Ambassador'), verifyAmbassador);
router.patch('/chooseAvator', authMiddleware, authRole('Ambassador'), chooseAvator)
router.patch('/chooseAvator', authMiddleware, authRole('Ambassador'), chooseAvator);
router.post('/recruitPlayer', taskUploadMiddleware.array('idCardImage', 2), registerPlayer);
router.post('/refer', authMiddleware, authRole('Ambassador'), referFriend);
router.delete('/cohort/:cohortId', authMiddleware, authRole('Ambassador'), deleteCohortPlayer);
router.get('/getMyReferals', authMiddleware, authRole('Ambassador'), getMyReferals);
router.post('/submitSpecificTask', authMiddleware, authRole('Ambassador'), submitSpecificTask);
router.get('/getLeaderboardForSpecificTask', authMiddleware, authRole('Ambassador'), leaderboardForSpecificTask);
router.get('/getSpecificTasks', authMiddleware, authRole('Ambassador'), getSpecificTasks);

export default router;