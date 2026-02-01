import "../css/component/Footer.css";

function Footer() {
  return (
    <footer id="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h3>FileShare</h3>
          <p>Send files and messages securely and instantly.</p>
        </div>

        <div className="footer-links">
          <h4>Product</h4>
          <ul>
            <li><a href="#work">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} FileShare. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
