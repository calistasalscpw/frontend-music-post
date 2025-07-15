# Project Name

"MUSIC DISCOVERY"

This is a platform for music lovers where they can add their favorite tracks to a favorites list and create posts. These features provide a seamless experience for discovering, sharing, and organizing music within a community platform.

## Installation

1. Clone the repository  
   bash
   git clone https://github.com/aroliani/music-discovery-project.git

**Backend:**
2. Install Express 
   bash
   npm install express
   
3. Command-line interface
    bash
    node server.js

4. Install dependencies
    bash
    npm install

**Frontend:**
5. Start the development server  
   bash
   npm run dev
   ```

## Features

Music Discovery offers a variety of features designed for music enthusiasts:

- *User Authentication*  
  Secure login and registration using local credentials or Google OAuth2.

- *Music Favorites*  
  Users can add their favorite tracks to a personal favorites list for easy access.

- *Post Creation*  
  Create, edit, and delete posts to share music recommendations or thoughts with the community.

- *Responsive UI*  
  Modern and responsive user interface built with Ant Design components.

- *RESTful API*  
  Backend API built with Express and MongoDB for managing users, posts, and favorites.

- *Session & Token Management*  
  Secure session handling and JWT-based authentication for protected routes.

- *Mock API Support*  
  Use of json-server for rapid prototyping and testing with spotify linked addres.


## Packages Used

This project utilizes a variety of packages to support both frontend and backend development:

- *React & React DOM*: Core libraries for building user interfaces.
- **Ant Design (antd & @ant-design/icons): Provides a rich set of UI components and icons for rapid frontend development.
- *React Router DOM*: Enables client-side routing for single-page applications.
- *Vite*: A fast build tool and development server for modern web projects.
- *ESLint*: Ensures code quality and consistency through linting.
- *Express*: A minimal and flexible Node.js web application framework for building backend APIs.
- *Mongoose*: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- *Passport & Strategies*: Handles authentication using local, JWT, and Google OAuth2 strategies.
- *bcrypt & bcryptjs*: Used for hashing and verifying passwords securely.
- *jsonwebtoken*: Implements JSON Web Token authentication.
- *dotenv*: Loads environment variables from a .env file.
- *cookie-parser, cors, express-session*: Middleware for handling cookies, CORS, and sessions.
- *json-server*: Provides a simple mock REST API for development and testing.

## Sample Data

The project includes sample comment data stored in json/musicdb.comments.json. This file contains user comments associated with different music posts. Each comment entry includes:

- *postId*: References the music post the comment belongs to.
- *name*: The display name of the commenter.
- *email*: The commenter's email address.
- *body*: The text content of the comment.

This sample data is useful for development, testing, and demonstrating the application's comment functionality, allowing users to see how feedback and discussions are managed within the platform.

## Routing

This project uses *React Router DOM* to enable client-side routing and navigation between different pages and features. The routing system allows users to seamlessly move between views such as the home page, post list, and post details without reloading the entire application.

Key benefits of using React Router DOM in this project include:

*SPA Experience:* Smooth navigation without full page reloads.
*Dynamic Routing*: URLs adapt for viewing posts or profiles.
*Protected Routes*: Some pages require user authentication.
*Nested Routes*: Organizes related views within parent routes.

This routing setup ensures a modern, responsive, and user-friendly navigation experience throughout the Music


## Credit:

Aroo = CRUD
Amelya = Google Authentication
Calista = Access Validation
Fitra = Pagination
Faisal = MongoDB Setup & Documentation