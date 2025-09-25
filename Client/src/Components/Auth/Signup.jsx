import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, sendOtp } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, otploading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const handleChange = (e) => { 
    const { name, value } = e.target; 
    setFormData((prev) => ({ ...prev, [name]: value })); 
  };

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);


  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email first!");
      return;
    }

    try {
      const res = await dispatch(sendOtp({ email: formData.email, name: formData.name }));
      if (res.meta.requestStatus === "fulfilled") {
        setOtpSent(true);
        setTimeLeft(60);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP. Please try again.");
    }
  };


  const handleSubmit = async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const result = await dispatch(
          registerUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            code: otp,
          })
        );

        if (result.meta.requestStatus === "fulfilled") {
          if (result.payload.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/client");
          }
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to create account");
      }
    };

  return (
    <div className="container auth-container" style={{ maxWidth: "40rem" }}>
      <h1 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.3rem 0.55rem", borderRadius: "1rem",fontSize:"clamp(1.5rem, 5vw, 2.25rem)"}}>
        Welcome to Snap Cart!</h1>
      <h3 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.3rem 0.55rem", borderRadius: "1rem",fontSize:"clamp(1.2rem, 3vw, 1.75rem)"}}> 
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

          {otpSent && (
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP sent to your email</label>
              <input
                type="text"
                className="form-control"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}
          <div className="d-flex justify-content-center">
          <button
              type="button"
              disabled={timeLeft>0}
              className="btn rounded-4 px-4 py-2 text-light me-3" style={{backgroundColor:"rgba(255, 123, 36, 1)"}}
              onClick={handleSendOtp}>
              {otploading ? "Sending..." : timeLeft > 0? `Resend OTP in ${timeLeft}s`: "Send OTP"}
            </button>
          <button
            type="submit"
            disabled={loading || !otpSent}
            className="btn rounded-4 px-4 py-2 text-light" style={{backgroundColor:"rgba(255, 123, 36, 1)"}}>
            <i className="bi bi-person-plus-fill"></i>{" "}
            {loading ? "Signing up..." : "Signup"}
          </button></div>
            <div className="mt-3 d-flex justify-content-center align-items-center">
              <p className="mb-0 me-2">
                Already have an account?
              </p>
              <button className="btn btn-link p-0" onClick={() => navigate("/login")}>
                Login<i className="bi bi-arrow-right"></i>
              </button>
        </div>
        </form>
        {error && <p className="text-danger mt-2 fw-bold text-center">{error}</p>}
      </div>
    </div>
  );
}
