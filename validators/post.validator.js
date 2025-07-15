import Post from '../models/posts.model.js';

export async function isUserValidator(req, res, next) {
    const user = req.user;
    if (!user) {
        return res.json("You are not authorized to perform this action.");
    }
    next()
}

export async function isSameUserValidator(req, res, next){
    const user = req.user;
    if (!user){
        return res.json("You are not authorized to perform this action.");
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.userId.equals(user._id)) {
        return res.status(403).json("You are not authorized to perform this action.");
    }
    next();
}