import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();
const sign = (user: any) => jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, emailOrPhone, password } = req.body;
    if (!name || !emailOrPhone || !password || password.length < 6) return res.status(400).json({ message: 'Name, email/phone and a 6+ character password are required.' });
    const exists = await User.findOne({ emailOrPhone });
    if (exists) return res.status(409).json({ message: 'Account already exists.' });
    const user = await User.create({ name, emailOrPhone, passwordHash: await bcrypt.hash(password, 12) });
    return res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, emailOrPhone: user.emailOrPhone, role: user.role } });
  } catch (error) { return res.status(500).json({ message: 'Registration failed.' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({ emailOrPhone });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid credentials.' });
    return res.json({ token: sign(user), user: { id: user._id, name: user.name, emailOrPhone: user.emailOrPhone, role: user.role } });
  } catch { return res.status(500).json({ message: 'Login failed.' }); }
});

export default router;
