import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  id: Number,
  title: String,
  body: String,
  artist: String,
  genre: String,
  duration: String,
  audioUrl: String,
  numberId: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
