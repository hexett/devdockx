import { Router } from 'express';
import healthRoutes from './health.js';
import authRoutes from './auth.js';
import projectRoutes from './projects.js';
import integrationRoutes from './integrations.js';
import apiTokenRoutes from './apitokens.js';

const router = Router();

router.get('/', (_req, res) => {
    res.json({ ok: true, message: 'v1' });
});

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/integrations', integrationRoutes);
router.use('/tokens', apiTokenRoutes);

export default router;