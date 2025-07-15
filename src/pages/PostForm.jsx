import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    body: "",
    artist: "",
    genre: "",
    duration: "",
    audioUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId) {
      setLoading(true);
      fetch(`http://localhost:3000/posts/${postId}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch post");
          return res.json();
        })
        .then(data => {
          setForm({
            title: data.title,
            body: data.body,
            artist: data.artist || "",
            genre: data.genre || "",
            duration: data.duration || "",
            audioUrl: data.audioUrl || ""
          });
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [postId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.title.trim() || !form.body.trim()) {
      alert("Title and description are required.");
      setLoading(false);
      return;
    }

    const url = postId
      ? `http://localhost:3000/posts/${postId}`
      : "http://localhost:3000/posts";
    const method = postId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save post");
        return res.json();
      })
      .then(() => {
        setLoading(false);
        navigate("/posts");
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading && postId) return <p>Loading post data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="card">
      <h2>{postId ? "Edit Track" : "Add New Track"}</h2>
      <form onSubmit={handleSubmit}>
        {["title", "artist", "genre", "duration"].map(field => (
          <div key={field} style={{ marginBottom: 16 }}>
            <label htmlFor={field} style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 6,
                border: "1px solid #b2dfb4c4",
                fontSize: 16
              }}
            />
          </div>
        ))}

        {/* Audio URL input */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="audioUrl" style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Audio URL (YouTube / Spotify):
          </label>
          <input
            type="text"
            id="audioUrl"
            name="audioUrl"
            value={form.audioUrl}
            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
            placeholder="Audio URL (Spotify/YouTube)"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid #b2dfb4c4",
              fontSize: 16
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="body" style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Description:
          </label>
          <textarea
            id="body"
            name="body"
            value={form.body}
            onChange={handleChange}
            required
            rows="6"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid #b2dfb4c4",
              fontSize: 16,
              resize: "vertical"
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            background: "#388e3c",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Saving..." : postId ? "Update Track" : "Create Track"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/posts")}
          style={{
            marginLeft: 10,
            padding: "10px 20px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#f0f0f0",
            color: "#333",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PostForm;
