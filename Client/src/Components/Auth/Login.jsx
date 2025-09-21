import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/userSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, token, error, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userInfo && token && userInfo.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [userInfo, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="container auth-container" style={{ maxWidth: "40rem" }}>
      <h1 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.5rem 0.75rem", borderRadius: "1rem",fontSize:"clamp(1.5rem, 5vw, 2.25rem)"}}>
        Welcome to Snap Cart!
      </h1>
      <h3 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.5rem 0.75rem", borderRadius: "1rem",fontSize:"clamp(1.2rem, 3vw, 1.75rem)"}}>
        Please Login to continue
      </h3>
      <div className="position-relative card p-4 auth-card shadow-sm rounded-4">
        <form onSubmit={handleSubmit} autoComplete="off">
          <img src="/SC logo.jpg" alt="tag" className="corner-tag top-right" />
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              id="email"
              name="email"
              aria-describedby="emailHelp"
              autoComplete="off"
              required/>
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              name="password"
              id="password"
              autoComplete="new-password"
              required/>
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
              style={{ right: "10px", top: "38px", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          <div className="d-flex justify-content-center">
          <button
            type="submit"
            disabled={loading}
            className="btn rounded-4 px-4 py-2" style={{backgroundColor:"rgba(255, 210, 180, 1)"}}>
            <i className="bi bi-box-arrow-in-right"></i>{" "}
            {loading ? "Logging in..." : "Login"}
          </button>
          </div>
          <div className="mt-3 d-flex">
            <p
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                padding: "0.5rem 0.75rem",
                borderRadius: "1rem",
              }}>
              Don't have an account?
            </p>
            <button className="btn btn-link" onClick={() => navigate("/signup")}>
              Signup<i className="bi bi-arrow-right"></i>
            </button>
        </div>
        </form>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>

    </div>
  );
}
