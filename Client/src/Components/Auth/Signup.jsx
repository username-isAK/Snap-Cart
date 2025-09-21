import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const result = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/admin");
    }
  };

  return (
    <div className="container auth-container" style={{ maxWidth: "40rem" }}>
      <h1 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.5rem 0.75rem", borderRadius: "1rem",fontSize:"clamp(1.5rem, 5vw, 2.25rem)"}}>
        Welcome to Snap Cart!</h1>
      <h3 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.5rem 0.75rem", borderRadius: "1rem",fontSize:"clamp(1.2rem, 3vw, 1.75rem)"}}> 
        Create an Account</h3>
      <div className="form-wrapper position-relative auth-card card p-4 shadow-sm rounded-4">
        <form onSubmit={handleSubmit} autoComplete="off">
          <img src="/SC logo.jpg" alt="tag" className="corner-tag top-right"/>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required/>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required/>
            <i
              className={`bi ${
                showPassword ? "bi-eye-slash" : "bi-eye"
              } position-absolute`}
              style={{ right: "10px", top: "38px", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}></i>
            <div id="passwordHelp" className="form-text">
              Minimum 8 characters.
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={8}
              required/>
            <i
              className={`bi ${
                showConfirmPassword ? "bi-eye-slash" : "bi-eye"
              } position-absolute`}
              style={{ right: "10px", top: "38px", cursor: "pointer" }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>
          <div className="d-flex justify-content-center">
          <button
            type="submit"
            disabled={loading}
            className="btn rounded-4 px-4 py-2" style={{backgroundColor:"rgba(255, 210, 180, 1)"}}>
            <i className="bi bi-person-plus-fill"></i>{" "}
            {loading ? "Signing up..." : "Signup"}
          </button></div>
            <div className="mt-3 d-flex">
              <p
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "1rem",
                }}>
                Already have an account?
              </p>
              <button className="btn btn-link" onClick={() => navigate("/login")}>
                Login<i className="bi bi-arrow-right"></i>
              </button>
        </div>
        </form>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
}
