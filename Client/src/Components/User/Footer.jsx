export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">

        <div className="mb-2 mb-md-0">
          &copy; {new Date().getFullYear()} Snap Cart. All rights reserved.
        </div>

        <div className="d-flex gap-3 mb-2 mb-md-0">
          <a href="/profile" className="text-light text-decoration-none">Profile</a>
          <a href="/orders" className="text-light text-decoration-none">Orders</a>
          <a href="/help" className="text-light text-decoration-none">Help</a>
        </div>

        <div className="d-flex gap-3">
          <a href="#" className="text-light">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="text-light">
            <i className="bi bi-twitter-x"></i>
          </a>
          <a href="#" className="text-light">
            <i className="bi bi-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}