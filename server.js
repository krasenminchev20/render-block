import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

let userStats = {};

// 1. Смени това с твоя истински адрес от Render!
const MY_RENDER_URL = "https://render-block.onrender.com"; 

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

app.get("/", (req, res) => {
  res.send("Server is up!");
});

app.post("/", (req, res) => {
  const body = req.body || {};
  const appId = body?.data?.appId;
  const interactionId = body?.data?.interactionId;
  const userName = body?.data?.context?.member?.name || "Guest";

  // Подготвяме HTML съдържанието отделно, за да е по-чист кода
  const htmlContent = `
    <div style="padding:16px; background:#1f1f1f; border-radius:8px; color:#fff; font-family:sans-serif; text-align:center; border:1px solid #333;">
      <div style="font-weight:bold; font-size:16px;">Total Videos Played</div>
      <div id="total-count" style="font-size:32px; font-weight:bold; color:#22c55e; margin:10px 0;">0</div>
      <div style="text-align:left; font-size:12px; border-top:1px solid #333; margin-top:10px; padding-top:10px;">
        <div style="color:#888; margin-bottom:8px;">Leaderboard:</div>
        <div id="stats-list">Loading...</div>
      </div>
    </div>

    <script>
      (function() {
        const userName = "${userName}";
        const serverUrl = "${MY_RENDER_URL}";

        async function updateStats() {
          try {
            const r = await fetch(serverUrl + "/stats");
            const stats = await r.json();
            render(stats);
          } catch(e) { console.log("Fetch error", e); }
        }

        function render(stats) {
          const list = document.getElementById("stats-list");
          const counter = document.getElementById("total-count");
          if(!list) return;
          let html = "";
          let total = 0;
          for (let u in stats) {
            total += stats[u];
            html += '<div style="display:flex; justify-content:space-between; margin-bottom:4px;">' +
                    '<span>' + u + '</span><span style="color:#22c55e;">' + stats[u] + '</span></div>';
          }
          list.innerHTML = html || "No plays yet";
          counter.innerText = total;
        }

        window.reportPlay = async function() {
          try {
            const r = await fetch(serverUrl + "/log-play", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userName: userName })
            });
            const data = await r.json();
            render(data.stats);
          } catch(e) { console.error(e); }
        };

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
                      window.reportPlay();
                      iframe.dataset.playing = "true";
                    } else if (e.data === 0) { iframe.dataset.playing = ""; }
                  }
                }
              });
            });
          }, 2000);
        };
        updateStats();
      })();
    </script>
  `;

  const responsePayload = {
    type: "INTERACTION",
    status: "SUCCEEDED",
    data: {
      appId,
      interactionId,
      interactions: [
        {
          type: "SHOW",
          id: interactionId,
          slate: {
            rootBlock: "root",
            blocks: [
              {
                id: "root",
                name: "Container",
                props: JSON.stringify({ className: "space-y-6", padding: "md" }),
                children: ["counter", "video1", "video2", "video3", "video4"]
              },
              {
                id: "counter",
                name: "Html",
                props: JSON.stringify({ html: htmlContent }),
                children: []
              },
              { id: "video1", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/DNEdnKq9Hj0?enablejsapi=1", height: 315 }), children: [] },
              { id: "video2", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/Qtogm_mo1AQ?enablejsapi=1", height: 315 }), children: [] },
              { id: "video3", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/G00dmXhboaw?enablejsapi=1", height: 315 }), children: [] },
              { id: "video4", name: "Iframe", props: JSON.stringify({ src: "https://www.youtube.com/embed/3jsHPvjxR7A?enablejsapi=1", height: 315 }), children: [] }
            ]
          }
        }
      ]
    }
  };

  return res.status(200).json(responsePayload);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));