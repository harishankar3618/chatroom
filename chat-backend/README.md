MERN Chatroom

A real-time chatroom application built using the MERN (MongoDB, Express, React, Node.js) stack with Socket.io for real-time communication.

Features

User authentication (Sign up/Login)

Real-time messaging with WebSockets (Socket.io)

MongoDB for storing chat history

Responsive UI with React

Deployed on Render

Tech Stack

Frontend: React, Axios, Socket.io-client

Backend: Node.js, Express.js, Socket.io, Mongoose

Database: MongoDB (Atlas)

Installation & Setup

Prerequisites

Make sure you have the following installed:

Node.js (v16 or higher)

MongoDB (Local or Atlas)

Git

Clone the Repository

git clone https://github.com/harishankar3618/chatroom.git
cd chatroom

Backend Setup

Navigate to the backend folder:

cd chat-backend

Install dependencies:

npm install

Create a .env file in chat-backend/ and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend server:

npm start

Frontend Setup

Navigate to the frontend folder:

cd ../chat-frontend

Install dependencies:

npm install

Start the React app:

npm start

The frontend should now be running at http://localhost:3000 and the backend at http://localhost:5000.

Deployment on Render

1. Deploy Backend

Push your code to GitHub.

Go to Render and create a new web service.

Connect your repository and select the backend branch.

Set up environment variables:

MONGO_URI: Your MongoDB connection string.

JWT_SECRET: Your secret key for authentication.

Set the build command:

npm install

Set the start command:

npm start

Deploy!

2. Deploy Frontend

Create a new web service for the frontend.

Set the build command:

npm install && npm run build

Set the start command:

serve -s build -l 3000

Add an environment variable to point to the backend API:

REACT_APP_API_URL=your_render_backend_url

Deploy!

Your chatroom should now be live! 🎉

Usage

Open the app in a browser.

Sign up or log in.

Start chatting in real time!

License

This project is licensed under the MIT License.

Contact

For any issues or contributions, reach out via GitHub or email.