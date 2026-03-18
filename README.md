# Job Portal

Job Portal is a MERN Stack based web app which helps in streamlining the flow of job application process. It allows users to select there roles (applicant/recruiter), and create an account. In this web app, login session are persistent and REST APIs are securely protected by JWT token verification. After logging in, a recruiter can create/delete/update jobs, shortlist/accept/reject applications, view resume and edit profile. And, an applicant can view jobs, perform fuzzy search with various filters, apply for jobs with an SOP, view applications, upload profile picture, upload resume and edit profile. Hence, it is an all in one solution for a job application system.

Directory structure of the web app is as follows:

```
- backend/
    - public/
        - profile/
        - resume/
- frontend/
- README.md
```

## Instructions for initializing web app:

- Install Node.js and MongoDB on your machine.
- Start the MongoDB server.
- Move inside the `backend` directory: `cd backend`
- Install dependencies: `npm install`
- Start the express server: `npm start`
- The backend server will start on port 4444.
- In a new terminal, go inside the `frontend` directory: `cd frontend`
- Install dependencies: `npm install --legacy-peer-deps`
- Start the frontend server: `npm start`
- The frontend server will start on port 3000.
- Open `http://localhost:3000/` in your browser.

## Deployment Instructions:

### Backend (Render)

1.  **Create a Web Service** on Render and connect your GitHub repository.
2.  **Root Directory**: `backend`
3.  **Build Command**: `npm install`
4.  **Start Command**: `npm start`
5.  **Environment Variables**:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `PORT`: 4444 (or any port Render provides).
    - `JWT_SECRET`: Your custom JWT secret key (optional but recommended).

### Frontend (Vercel)

1.  **Import Project** on Vercel and connect your GitHub repository.
2.  **Framework Preset**: Create React App.
3.  **Root Directory**: `frontend`
4.  **Environment Variables**:
    - `REACT_APP_SERVER_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).
5.  Vercel will automatically use the `vercel.json` for client-side routing.

## Important Note:

The project has been updated to use `bcryptjs` instead of `bcrypt` to avoid build issues on Windows. The frontend dependencies have also been updated to work with newer versions of Node.js. Environment variables have been added to facilitate deployment on Vercel and Render.

## Dependencies:

- Frontend
  - @material-ui/core
  - @material-ui/icons
  - @material-ui/lab
  - axios
  - material-ui-chip-input
  - react-phone-input-2
- Backend
  - bcrypt
  - body-parser
  - connect-flash
  - connect-mongo
  - cors
  - crypto
  - express
  - express-session
  - jsonwebtoken
  - mongoose
  - mongoose-type-email
  - multer
  - passport
  - passport-jwt
  - passport-local
  - uuid

# Machine Specifications

Details of the machine on which the webapp was tested:

- Operating System: Windows 10/11
- Terminal: PowerShell / CMD
- Project Origin: Custom MERN Stack Application
