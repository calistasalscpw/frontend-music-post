import { useEffect, useState } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { AudioOutlined, UserOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Pagination } from 'antd';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", genre: "", duration: "", body: "", audioUrl: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const pageSize = parseInt(searchParams.get('pageSize')) || 5;
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/posts?page=${currentPage}&limit=${pageSize}&search=${search}`)
      .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setPosts(data.posts || []);
        setTotalPosts(data.pagination?.totalPosts || 0);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError("Failed to load posts."); // Set error state for user feedback
        setLoading(false);
      });
  }, [currentPage, pageSize, search]);

  const paginate = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber.toString());
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    const newParams = new URLSearchParams(searchParams); // Use existing params
    
    if (searchValue.trim()) {
      newParams.set('search', searchValue);
    } else {
      newParams.delete('search'); // Remove search param if empty
    }
    newParams.set('page', '1'); // Reset to page 1 when searching
    
    setSearchParams(newParams);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.body.trim()) {
      setError("Description is required.");
      return;
    }
    if (!form.artist.trim()) {
      setError("Artist is required.");
      return;
    }
    if (!form.genre.trim()) {
      setError("Genre is required.");
      return;
    }
    if (!form.duration.trim()) {
      setError("Duration is required.");
      return;
    }
    // Simple URL validation (can be more robust)
    try {
        new URL(form.audioUrl);
    } catch (e) {
        setError("Invalid Audio URL.");
        return;
    }

    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save post");
        return res.json();
      })
      .then(data => {
        if (!data.post) throw new Error("Post creation failed: No post data returned.");
        setForm({ title: "", artist: "", genre: "", duration: "", body: "", audioUrl: "" });
        setShowForm(false);
        // Reset page to 1 to see the new post and trigger useEffect
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', '1');
            return newParams;
        });
      })
      .catch(err => {
        console.error('Error submitting post:', err);
        setError(err.message);
      });
  };

  if (loading) return <p>Loading posts...</p>;
  if (error && !posts.length) return <p style={{ color: 'red' }}>Error: {error}</p>; // Display error if no posts loaded

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search music..."
          value={search}
          onChange={handleSearchChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #b2dfb4c4",
            fontSize: 16,
            outline: "none"
          }}
        />
        <PlusCircleOutlined
          onClick={() => setShowForm(prev => !prev)}
          style={{ fontSize: 28, color: "#388e3c", marginLeft: 16, cursor: "pointer" }}
          title="Add New Track"
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "#f8f8f8", padding: 20, borderRadius: 8, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Add New Track</h3>
          {["title", "artist", "genre", "duration", "audioUrl"].map((field) => (
            <div key={field} style={{ marginBottom: 12 }}>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === "title" || field === "body" || field === "artist" || field === "genre" || field === "duration" || field === "audioUrl" ? " (Required)" : "")}
                required // HTML5 required attribute
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
              />
            </div>
          ))}
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Description (Required)"
            required
            rows="4"
            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginBottom: 12 }}
          ></textarea>
          {error && <p style={{ color: "red", marginBottom: 12 }}>Error: {error}</p>}
          <button type="submit" style={{ padding: "8px 16px", background: "#388e3c", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
            Save
          </button>
        </form>
      )}

      <div className="post-list-wrapper" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post._id} className="card post-card" style={{ marginBottom: 24, padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 24, color: "#333" }}>{post.title}</h2>
                <span style={{ fontSize: 16, color: "#999" }}>#{(currentPage - 1) * pageSize + index + 1}</span>
              </div>

              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 14, color: "#555" }}>
                <span><UserOutlined /> {post.artist}</span>
                <span><AudioOutlined /> {post.duration}</span>
                <span style={{ border: "1px solid #388e3c", borderRadius: 4, padding: "2px 8px", fontSize: 12, color: "#388e3c", background: "#e8f5e9" }}>{post.genre}</span>
              </div>

              <p style={{ marginTop: 12, color: "#444", lineHeight: 1.5 }}>{post.body?.slice(0, 160)}{post.body?.length > 160 ? "..." : ""}</p>

              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#333" }}><strong>Artist:</strong> {post.artist}</span>
                <Link
                  to={`/posts/${post._id}`} // Corrected template literal and used _id
                  style={{ color: "#388e3c", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#2e7d32"}
                  onMouseOut={(e) => e.currentTarget.style.color = "#388e3c"}
                >
                  Listen & Read →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found. Why not add one?</p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        {totalPosts > 0 && ( // Only show pagination if there are posts
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalPosts}
            onChange={paginate}
            showSizeChanger={false}
            style={{ marginBottom: 20 }}
          />
        )}
      </div>
    </div>
  );
};

export default PostList;