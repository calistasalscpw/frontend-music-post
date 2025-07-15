import { Button, Card, Row, Col } from "antd";
import daunImg from "../assets/daun.jpg"; 

const Home = () => {
  return (
    <div className="home-container" style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16, color: "#388e3c" }}>Music Discovery</h1>

      <p style={{ maxWidth: 700, margin: "0 auto", fontSize: 18, color: "#555" }}>
        Explore amazing tracks, discover new artists, and dive deep into the world of music with our curated collection.
      </p>

      <img
        src={daunImg} 
        alt="music-art"
        style={{ width: 200, marginTop: 32, borderRadius: 8 }}
      />

      {/* 3 Cards */}
      <div style={{ marginTop: 60 }}>
        <Row gutter={24} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card title="Explore Music" bordered={false} style={{ borderRadius: 10, backgroundColor: "#e8f5e9" }}>
              <p style={{ fontSize: 16, color: "#444" }}>
                Discover handpicked songs across various genres and moods.
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Deep Listening" bordered={false} style={{ borderRadius: 10, backgroundColor: "#e8f5e9" }}>
              <p style={{ fontSize: 16, color: "#444" }}>
                Read detailed reviews and insights about each track.
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Artist Stories" bordered={false} style={{ borderRadius: 10, backgroundColor: "#e8f5e9" }}>
              <p style={{ fontSize: 16, color: "#444" }}>
                Learn about the artists and the stories behind the music.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      <div style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 22, color: "#222" }}>Ready to Discover?</h2>
        <p style={{ fontSize: 16, color: "#666" }}>Browse through our music collection and find your next favorite song.</p>
        <Button type="primary" style={{ backgroundColor: "#388e3c", borderColor: "#388e3c", marginTop: 16 }}>
          <a href="/posts" style={{ color: "#fff", textDecoration: "none" }}>
            View All Tracks
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Home;
