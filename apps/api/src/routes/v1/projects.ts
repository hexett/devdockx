import { Router } from 'express';

const router = Router();

router.post('/', async (req: any, res: any) => {});

router.get('/:id', async (req: any, res: any) => {});

router.get('/', async (req: any, res: any) => {});

router.put('/:id', async (req: any, res: any) => {});

router.delete('/:id', async (req: any, res: any) => {});

// Stats Routes

router.get('/:id/stats', async (req: any, res: any) => {
    const range = req.query.range;
});

router.post('/:id/stats', async (req: any, res: any) => {});


export default router;