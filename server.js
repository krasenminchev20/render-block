import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Глобална променлива за памет (нулира се при рестарт на сървъра)
let userStats = {};

app.post("/log-play", (req, res) => {
  const { userName } = req.body;
  if (userName) {
    userStats[userName] = (userStats[userName] || 0) + 1;
  }
  res.json({ success: true, stats: userStats });
});

app.get("/stats", (req, res) => {
  res.json(userStats);
});

app.get("/", (req, res) => res.send("Server is running!"));

app.post("/", (req, res) => {
  const body = req.body || {};
  const appId = body?.data?.appId;
  const interactionId = body?.data?.interactionId;
  
  // Вземаме името на потребителя от Bettermode
  const userName = body?.data?.context?.member?.name || "Guest";
  
  // АВТОМАТИЧНО откриване на URL адреса на твоя Render сървър
  const host = req.get('host');
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const MY_RENDER_URL = `${protocol}://${host}`;

  const htmlContent = `
    <div style="padding:16px; background:#18181b; border-radius:12px; color:#ffffff; font-family:sans-serif; text-align:center; border:1px solid #27272a; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="font-weight:600; font-size:12px; color:#a1a1aa; letter-spacing: 0.05em; text-transform: uppercase;">Total Community Plays</div>
      <div id="total-count" style="font-size:48px; font-weight:800; color:#22c55e; margin:8px 0; line-height:1;">0</div>
      
      <div style="margin-top:20px; text-align:left; border-top:1px solid #27272a; padding-top:16px;">
        <div style="font-size:12px; color:#a1a1aa; margin-bottom:12px; font-weight:600; text-transform: uppercase;">Top Viewers</div>
        <div id="stats-list" style="font-size:14px; color:#fafafa;">
          <div style="color:#52525b; font-style:italic;">Waiting for data...</div>
        </div>
      </div>
    </div>

    <script>
      (function() {
        const userName = "${userName}";
        const serverUrl = "${MY_RENDER_URL}";

        async function refreshData() {
          try {
            const r = await fetch(serverUrl + "/stats");
            const stats = await r.json();
            updateUI(stats);
          } catch(e) { console.error("Stats error:", e); }
        }

        function updateUI(stats) {
          const list = document.getElementById("stats-list");
          const counter = document.getElementById("total-count");
          if(!list) return;
          
          let html = "";
          let total = 0;
          
          // Превръщаме обекта в масив и го сортираме (най-активните отгоре)
          const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
          
          if(entries.length === 0) {
            list.innerHTML = "<span style='color:#52525b;'>No plays yet. Be the first!</span>";
            return;
          }

          entries.forEach(([u, count]) => {
            total += count;
            html += \`
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:#27272a; padding:8px 12px; border-radius:8px;">
                <span style="font-weight:500; color:#ffffff;">\${u}</span>
                <span style="color:#22c55e; font-weight:700; background:#14532d; padding:2px 8px; border-radius:6px; font-size:12px;">\${count}</span>
              </div>
            \`;
          });
          
          list.innerHTML = html;
          counter.innerText = total;
        }

        window.reportPlayToServer = async function() {
          try {
            const r = await fetch(serverUrl + "/log-play", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userName: userName })
            });
            const data = await r.json();
            updateUI(data.stats);
          } catch(e) { console.error("Report error:", e); }
        };

        // YouTube API Logic
        if (!window.YT) {
          let t = document.createElement("script");
          t.src = "https://www.youtube.com/iframe_api";
          document.head.appendChild(t);
        }

        window.onYouTubeIframeAPIReady = function() {
          setTimeout(() => {
            const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
            iframes.forEach(iframe => {
              new YT.Player(iframe, {
                events: {
                  "onStateChange": (e) => {
                    if (e.data === 1 && !iframe.dataset.playing) {
                      window.reportPlayToServer();
                      iframe.dataset.playing = "true";
                    } else if (e.data === 0) { iframe.dataset.playing = ""; }
                  }
                }
              });
            });
          }, 2000);
        };
        
        refreshData();
      })();
    </script>
  `;

  const responsePayload = {
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId,
      interactionId,
      interactions: [{
        type: "SHOW",
        id: interactionId,
        slate: {
          rootBlock: "root",
          blocks: [
            { id: "root", name: "Container", props: JSON.stringify({ className: "space-y-6" }), children: ["counter", "v1", "v2", "v3", "v4"] },
            { id: "counter", name: "Html", props: JSON.stringify({ html: htmlContent }), children: [] },
            { id: "v1", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/DNEdnKq9Hj0?enablejsapi=1", height: 315 }), children: [] },
            { id: "v2", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/Qtogm_mo1AQ?enablejsapi=1", height: 315 }), children: [] },
            { id: "v3", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/G00dmXhboaw?enablejsapi=1", height: 315 }), children: [] },
            { id: "v4", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/3jsHPvjxR7A?enablejsapi=1", height: 315 }), children: [] }
          ]
        }
      }]
    }
  };

  return res.status(200).json(responsePayload);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));