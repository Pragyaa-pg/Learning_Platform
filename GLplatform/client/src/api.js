const API_URL = "http://localhost:5000";

export const fetchCourses = async () => {
  const res = await fetch(`${API_URL}/api/courses`);
  return res.json();
};
fetch("http://localhost:5000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    email,
    password
  })
});