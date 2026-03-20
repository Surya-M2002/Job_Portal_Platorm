const inferLocal =
  typeof window !== "undefined" &&
  (window.location.port === "3000" || window.location.port === "3001")
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : undefined;
export const server =
  process.env.REACT_APP_SERVER_URL || inferLocal || "http://localhost:4444";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  uploadResume: `${server}/upload/resume`,
  uploadProfileImage: `${server}/upload/profile`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
};

export default apiList;
