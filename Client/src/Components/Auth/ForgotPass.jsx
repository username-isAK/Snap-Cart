import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordOtp, resetPassword } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, otpSent } = useSelector((state) => state.user);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSendOtp = () => {
    if (!email) return;
    dispatch(sendForgotPasswordOtp({ email }));
    setTimeLeft(60);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }
    try{
    const result= await dispatch(resetPassword({ email, otp, newPassword }));
    if (result.meta.requestStatus === "fulfilled") {
        alert("Password reset successful! Please login with your new password.");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeLeft(0);
        navigate("/login");
    }
  } catch(err){
    alert(err.response?.data?.message || "Failed to reset password. Please try again.");
  }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
    } else {
      handleResetPassword();
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: "40rem" }}>
      <h2 className="mb-3 text-center" style={{backgroundColor:"white",padding:"0.3rem 0.55rem", borderRadius: "1rem",fontSize:"clamp(1.25rem, 4vw, 2rem)"}}>
           Reset your Password</h2>
     <div className="form-wrapper position-relative auth-card card p-4 shadow-sm rounded-4">
      <form onSubmit={handleSubmit}>
        <img src="/SC logo.jpg" alt="tag" className="corner-tag top-right"/>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={otpSent}/>
        </div>

        {otpSent && (
         <div>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required/>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}/>
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                 style={{ right: "10px", top: "38px", cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}></i>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="confirmPassword" className="form-label">Re-type New Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={8}/>
                <i className={`bi ${
                 showConfirmPassword ? "bi-eye-slash" : "bi-eye"
              } position-absolute`}
              style={{ right: "10px", top: "38px", cursor: "pointer" }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
            </div>
            <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-success rounded-4 px-4 py-2 text-light mb-3"
              disabled={loading}>
             Reset Password
            </button></div> </div>)}
            <div className="d-flex justify-content-center">
            <button
              type="button"
              disabled={timeLeft>0}
              className="btn rounded-4 px-4 py-2 text-light" style={{backgroundColor:"rgba(255, 123, 36, 1)"}}
              onClick={handleSendOtp}>
              {loading? "Sending..." : timeLeft > 0? `Resend OTP in ${timeLeft}s`: "Send OTP"}
            </button></div>
      </form>

      {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
