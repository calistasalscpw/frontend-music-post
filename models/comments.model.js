import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.Mixed,
  name: String,
  email: String,
  body: String,
  numberId: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
