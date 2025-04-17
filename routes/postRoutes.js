import { Router } from 'express';
import Post from '../models/Post.js';
import Message from '../models/Message.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

/* ----------------------------- Count Statistics ----------------------------- */
// Note: This route must come before "/:id" to avoid route conflicts
router.get('/count', async (req, res) => {
  try {
    const { type } = req.query;

    if (type) {
      const count = await Post.countDocuments({ type });
      return res.json({ [type]: count });
    }

    const [quran, hadiths, articles, courses, fatwas, messages] = await Promise.all([
      Post.countDocuments({ type: 'تفسير' }),
      Post.countDocuments({ type: 'حديث' }),
      Post.countDocuments({ type: 'مقالة' }),
      Post.countDocuments({ type: 'دورة' }),
      Post.countDocuments({ type: 'فتوى' }),
      Message.countDocuments()
    ]);

    res.json({ quran, hadiths, articles, courses, fatwas, messages });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* ----------------------------- Get All Posts ----------------------------- */
router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    const posts = type ? await Post.find({ type }) : await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error while fetching posts' });
  }
});

/* ----------------------------- Get Single Post ----------------------------- */
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* ----------------------------- Create Post ----------------------------- */
router.post('/', verifyToken, async (req, res) => {
  const { title, reference, content, speaker, type, author } = req.body;

  if (!title || !reference || !content || !type) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    const newPost = new Post({ title, reference, content, speaker, type, author });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error while creating the post' });
  }
});

/* ----------------------------- Edit Post ----------------------------- */
router.put('/:id', verifyToken, async (req, res) => {
  const { title, reference, content, speaker, type } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, reference, content, speaker, type },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ msg: 'Post not found' });
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error while updating the post' });
  }
});

/* ----------------------------- Delete Post ----------------------------- */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Post not found' });
    res.json({ msg: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error while deleting the post' });
  }
});

export default router;
