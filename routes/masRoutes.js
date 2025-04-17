import { Router } from 'express';
import sanitizeHtml from 'sanitize-html';
import Message from '../models/Message.js';

const router = Router();

/* --------------------------- Create New Message --------------------------- */
router.post('/messages', async (req, res) => {
  try {
    let { name, email, content } = req.body;

    // Check if inputs are not empty
    if (!name || !email || !content) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Sanitize inputs
    name = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} });
    email = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} });
    content = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });

    // Detect suspicious content
    const suspiciousPattern = /(\$|\{|\}|\<|\>|script|<script|require\(|process\.env|eval|function|\.\.\/)/i;
    if (
      suspiciousPattern.test(name) ||
      suspiciousPattern.test(email) ||
      suspiciousPattern.test(content)
    ) {
      return res.status(400).json({ error: 'Suspicious content detected in input.' });
    }

    // Validate message length
    if (content.length < 10 || content.length > 2000) {
      return res.status(400).json({ error: 'Message must be between 10 and 2000 characters.' });
    }

    const newMessage = new Message({ name, email, content });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/* ---------------------------- Get All Messages ---------------------------- */
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

export default router;
