import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

import Home from './pages/Home.jsx';
import PostList from './pages/PostList.jsx';
import PostDetails from './pages/PostDetails.jsx';
import PostForm from './pages/PostForm.jsx';
import SignUp from './pages/Signup.jsx';
import Login from './pages/Login.jsx';

import './App.css';

const NavigationTabs = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = location.pathname.startsWith('/posts') ? '/posts' : '/';

  const handleLogout = () => {
    fetch("http://localhost:3000/auth/logout", {
      credentials: "include"
    }).then(() => {
      onLogout();
      navigate("/login");
    });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px"
      }}>
        <Tabs
          activeKey={activeKey}
          onChange={(key) => navigate(key)}
          items={[
            { key: '/', label: 'HOME' },
            { key: '/posts', label: 'TRACKS' }
          ]}
          style={{ marginBottom: 0 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span><UserOutlined /> {user?.username}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <hr />
    </div>
  );
};

const ProtectedRoutes = ({ user, onLogout }) => (
  <>
    <NavigationTabs user={user} onLogout={onLogout} />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/posts' element={<PostList />} />
      <Route path='/posts/:postId' element={<PostDetails />} />
      <Route path='/posts/new' element={<PostForm />} />
      <Route path='/posts/edit/:postId' element={<PostForm />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  </>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Checking login status...</p>;

  return (
    <BrowserRouter>
      <div className="card">
        {user ? (
          <ProtectedRoutes user={user} onLogout={() => setUser(null)} />
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={(user) => setUser(user)} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
