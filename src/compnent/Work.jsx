import "../css/component/Work.css";

function Work() {
  return (
    <div id="work">
      <h2 className="work-title">How It Works</h2>

      <div className="steps">
        <div className="step-card">
          <span className="step-number">1</span>
          <h3>Select File</h3>
          <p>Choose the file you want to send from your device.</p>
        </div>

        <div className="step-card">
          <span className="step-number">2</span>
          <h3>Add Message</h3>
          <p>Write a message to explain your file.</p>
        </div>

        <div className="step-card">
          <span className="step-number">3</span>
          <h3>Send Securely</h3>
          <p>Click send and share your file instantly.</p>
        </div>
      </div>
    </div>
  );
}

export default Work;
