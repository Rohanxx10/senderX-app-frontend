import "../css/component/Overview.css";

function Overview() {
  return (
    <section id="overview">
      <div className="overview-container">

        {/* LEFT SIDE */}
        <div className="overview-left">
          <h2>Fast. Secure. Reliable.</h2>
          <p>
            DropTalk delivers lightning-fast file transfers with end-to-end
            encryption. Your data is always protected.
          </p>

          <div className="overview-cards">
            <div className="info-card c1">
               <h2> ⚡</h2>
              <h4>Ultra Fast</h4>
              <span>Instant delivery</span>
            </div>

            <div className="info-card c2">
             <h2> 🔐</h2>
              <h4>Secure</h4>
              <span>End-to-end encryption</span>
            </div>

            <div className="info-card c3">
              <h2> ☁️</h2>
              <h4>Cloud Ready</h4>
              <span>Access anywhere</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="overview-right">
          <div className="demo-chat loop">

            <div className="demo-header">
              <span className="dot green"></span>
              <span className="dot yellow"></span>
              <span className="dot red"></span>
              <p>Live Demo</p>
            </div>

            <div className="demo-body">
              <div className="demo-msg left upload">
                Uploading file…
              </div>

              <div className="demo-msg left sending">
                Sending file
                <div className="progress">
                  <span></span>
                </div>
              </div>

              <div className="demo-msg left file">
                📄 project.pdf
              </div>

              <div className="demo-msg right downloaded">
                Downloaded ✔
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Overview;
