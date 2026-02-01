import "../css/component/Features.css";

function Features() {
  return (
    <section id="features">
      <h2 className="features-title">Secure & Privacy-First Features</h2>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Privacy Protection</h3>
          <p>
            Your personal information stays private. Unlike traditional messaging
            apps, your phone number is never exposed while sharing files or messages.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🕵️</div>
          <h3>Anonymous Sharing</h3>
          <p>
            Send messages and files anonymously without revealing your identity,
            protecting you from spam, harassment, or unwanted contact.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Auto Data Deletion</h3>
          <p>
            All shared messages and files are automatically deleted within
            <strong> 10 minutes</strong>, ensuring zero digital footprint.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📁</div>
          <h3>Secure File Sharing</h3>
          <p>
            Share documents, images, and files of any type securely with encrypted
            transfer and controlled access.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast & Reliable Transfer</h3>
          <p>
            Optimized infrastructure ensures quick uploads and instant delivery
            without compromising security.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌍</div>
          <h3>Access Anywhere</h3>
          <p>
            Seamlessly share across devices and platforms without installing
            additional apps or plugins.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;
