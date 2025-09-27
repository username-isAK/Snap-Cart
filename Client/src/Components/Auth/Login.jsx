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
    else if (userInfo && token && userInfo.role === "user"){
      navigate("/client", {replace: true});
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
      <h1 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.3rem 0.55rem", borderRadius: "1rem",fontSize:"clamp(1.5rem, 5vw, 2.25rem)"}}>
        Welcome to Snap Cart!
      </h1>
      <h3 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.3rem 0.55rem", borderRadius: "1rem",fontSize:"clamp(1.2rem, 3vw, 1.75rem)"}}>
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

          <div className="position-relative">
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
          <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-link p-0 mb-3" style={{fontSize: "clamp(0.7rem, 1vw, 0.9rem)"}} onClick={()=> navigate("/reset-password")}>
            Forgot Password?</button></div>
          <div className="d-flex justify-content-center">
          <button
            type="submit"
            disabled={loading}
            className="btn rounded-4 px-4 py-2 text-light" style={{backgroundColor:"rgba(255, 123, 36, 1)"}}>
            <i className="bi bi-box-arrow-in-right me-1"></i>
            {loading ? "Logging in..." : "Login"}
          </button>
          </div>
          <div className="mt-3 d-flex justify-content-center align-items-center">
            <p className="mb-0 me-2">
              Don't have an account?
            </p>
            <button className="btn btn-link p-0" onClick={() => navigate("/signup")}>
              Signup<i className="bi bi-arrow-right"></i>
            </button>
        </div>
        </form>
        {error && <p className="text-danger mt-2 fw-bold text-center">{error}</p>}
      </div>
    </div>
  );
}
