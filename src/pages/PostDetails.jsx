import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  UserOutlined,
  AudioOutlined,
  CommentOutlined,
  CustomerServiceOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => setPost(data));

    fetch(`http://localhost:3000/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []));
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
      })
        .then(() => {
          alert("Post deleted successfully!");
          navigate('/posts');
        })
        .catch(error => console.error("Error deleting post:", error));
    }
  };

  const handleCreateNewPost = () => navigate('/posts/new');
  const handleEditPost = () => navigate(`/posts/edit/${postId}`);

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'DELETE',
      })
        .then(() => {
          setComments(prev => prev.filter(c => c._id !== commentId));
        })
        .catch(err => console.error("Failed to delete comment:", err));
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.body.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      });

      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment({ name: "", email: "", body: "" });
      } else {
        console.error("Comment failed:", data);
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
  };

  return (
    <div className="card post-card" style={{ padding: 24 }}>
      {/* Top Navigation & Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          onClick={() => navigate('/posts')}
          style={{
            background: '#83cf94',
            borderColor: '#388e3c',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          <ArrowLeftOutlined /> Back to Posts
        </button>
        <div>
          <EditOutlined
            onClick={handleEditPost}
            style={{ fontSize: 20, color: '#ffc107', cursor: 'pointer', marginRight: 12 }}
            title="Edit Post"
          />
          <DeleteOutlined
            onClick={handleDeletePost}
            style={{ fontSize: 20, color: '#dc3545', cursor: 'pointer', marginRight: 12 }}
            title="Delete Post"
          />
          <PlusCircleOutlined
            onClick={handleCreateNewPost}
            style={{ fontSize: 20, color: '#388e3c', cursor: 'pointer' }}
            title="Create New Post"
          />
        </div>
      </div>

      {/* Post Detail Info */}
      <p style={{ color: '#888', marginBottom: 0 }}>Track #{post.numberId || post.id || postId.slice(-6)}</p>
      <h1><CustomerServiceOutlined style={{ marginRight: 8 }} />{post.title}</h1>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span><UserOutlined /> {post.artist}</span>
        <span><AudioOutlined /> {post.duration}</span>
        <span style={{
          border: "1px solid #388e3c",
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: 12,
          color: "#388e3c"
        }}>{post.genre}</span>
      </div>

      <p style={{ marginTop: 16 }}>{post.body}</p>

      {/* Audio Preview with Icon */}
      {post.audioUrl && (
        <div style={{ marginTop: 24 }}>
          <h3>
            <PlayCircleOutlined style={{ fontSize: 22, color: '#2e7d32', marginRight: 8 }} />
            Track Preview
          </h3>
          <div>
            <iframe
              width="100%"
              height={post.audioUrl.includes("spotify.com") ? "152" : "120"}
              src={
                post.audioUrl.includes("youtube.com")
                  ? post.audioUrl.replace("watch?v=", "embed/")
                  : post.audioUrl.includes("spotify.com")
                    ? `https://open.spotify.com/embed/track/${post.audioUrl.split("/track/")[1]?.split("?")[0]}`
                    : post.audioUrl
              }
              title="Audio Player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <h3 style={{ marginTop: 32 }}>
        <CommentOutlined /> Reviews & Comments ({comments.length})
      </h3>

      {comments.length === 0 && (
        <p style={{ color: "#888", marginTop: 16 }}>No comments yet.</p>
      )}
      {comments.map((comment) => (
        <div key={comment._id} style={{
          marginTop: 16,
          background: '#fafafa',
          border: '1px solid #eee',
          borderRadius: '6px',
          padding: '12px 16px',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ marginBottom: 0 }}>
            <strong>{comment.name}</strong>
            <span style={{ color: '#999', marginLeft: 8 }}>
              #{comment._id ? comment._id.slice(-6) : ""}
            </span>
          </p>
          {comment.email && (
            <small style={{ color: 'gray' }}>@{comment.email}</small>
          )}
          <p style={{ marginTop: 8 }}>{comment.body}</p>
          <button
            onClick={() => handleDeleteComment(comment._id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: 13,
              padding: 0,
              marginTop: 4
            }}
          >
            Delete Comment
          </button>
        </div>
      ))}

      {/* Add Comment Form */}
      <div style={{ marginTop: 32, padding: 16, border: "1px solid #ccc", borderRadius: 6, background: "#f9f9f9" }}>
        <h4 style={{ marginBottom: 10 }}>Add a Comment</h4>
        <form onSubmit={handleSubmitComment}>
          <input
            type="text"
            placeholder="Your Name"
            value={newComment.name}
            onChange={e => setNewComment({ ...newComment, name: e.target.value })}
            required
            style={{ width: "100%", padding: 10, marginBottom: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          <input
            type="email"
            placeholder="Your Email (optional)"
            value={newComment.email}
            onChange={e => setNewComment({ ...newComment, email: e.target.value })}
            style={{ width: "100%", padding: 10, marginBottom: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          <textarea
            placeholder="Your Comment"
            value={newComment.body}
            onChange={e => setNewComment({ ...newComment, body: e.target.value })}
            required
            rows="4"
            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          ></textarea>
          <button
            type="submit"
            style={{
              marginTop: 12,
              padding: "10px 20px",
              background: "#388e3c",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDetails;
