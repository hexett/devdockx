import { Router } from 'express';
import { supabase } from '../../lib/supabase.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { createLogger } from '../../lib/logger.js';

const log = createLogger('auth');
const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user, accessToken: data.session.access_token });
});

router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      log.warn(`logout failed: ${error.message}`);
      return res.status(400).json({ ok: false, error: error.message });
    }
    log.success('user logged out');
    return res.json({ ok: true, message: 'Logged out' });
  } catch (err: any) {
    log.error(err?.message || err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

router.get('/me', requireAuth, async (req: any, res: any) => {
  res.json({ user: req.user });
});

export default router;