import version from './index.js';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ ok: true, uptime: process.uptime(), version: version });
});

export default router;