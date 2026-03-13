import express from "express";
import cors from "cors"; // Трябва да инсталираш: npm install cors

const app = express();
const PORT = process.env.PORT || 10000;

// Разрешаваме комуникацията между фронтенда (Bettermode) и твоя сървър
app.use(cors());
app.use(express.json());

// Временна памет за статистиката (ще се нулира при рестарт на сървъра)
let userStats = {};

// Маршрут за записване на ново гледане
app.post("/log-play", (req, res) => {
  const { userName } = req.body;
  if (userName) {
    userStats[userName] = (userStats[userName] || 0) + 1;
    console.log(`User ${userName} played a video. Total: ${userStats[userName]}`);
  }
  res.json({ success: true, stats: userStats });
});

// Маршрут за вземане на статистиката (ако искаш да я ползваш другаде)
app.get("/stats", (req, res) => {
  res.json(userStats);
});

app.get("/", (req, res) => {
  res.send("Bettermode Render app is running with Tracker");
});

app.post("/", (req, res) => {
  const body = req.body || {};
  const appId = body?.data?.appId;
  const interactionId = body?.data?.interactionId;

  // Вземаме името на потребителя от Bettermode контекста
  // Ако потребителят не е логнат, ще се казва "Guest"
  const userName = body?.data?.context?.member?.name || "Guest";

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
                props: JSON.stringify({ className: "space-y-6", direction: "vertical", padding: "md" }),
                children: ["header", "counter", "video1", "video2", "video3", "video4"]
              },
              {
                id: "header",
                name: "Text",
                props: JSON.stringify({ size: "lg", weight: "bold", value: `Hello, ${userName}! Enjoy these hits` }),
                children: []
              },
              {
                id: "counter",
                name: "Html",
                props: JSON.stringify({
                  html: `
                    <div style="padding:16px; background:#1f1f1f; border-radius:8px; color:#fff; font-family:sans-serif; text-align:center;">
                      <div style="margin-bottom:8px; font-weight:bold; font-size:16px;">Total Videos Played</div>
                      <div id="total-video-counter" style="font-size:32px; font-weight:bold; color:#22c55e; margin: 10px 0;">0</div>
                      <div id="leaderboard" style="margin-top:15px; text-align:left; font-size:12px; border-top:1px solid #333; pt-10px;">
                        <div style="color:#888; margin-bottom:5px; margin-top:10px;">Leaderboard:</div>
                        <div id="stats-list">Loading stats...</div>
                      </div>
                    </div>

                    <script>
                      (function() {
                        const userName = "${userName}";
                        // Смени това с твоя истински URL от Render (напр. https://my-app.onrender.com)
                        const serverUrl = window.location.origin === 'http://localhost:10000' ? 'http://localhost:10000' : 'https://' + window.location.hostname; 
                        
                        async function reportPlay() {
                          try {
                            const res = await fetch(serverUrl + '/log-play', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userName: userName })
                            });
                            const data = await res.json();
                            renderStats(data.stats);
                          } catch(e) { console.error("Error reporting:", e); }
                        }

                        function renderStats(stats) {
                          const list = document.getElementById('stats-list');
                          const counter = document.getElementById('total-video-counter');
                          if(!list || !stats) return;
                          
                          let html = '';
                          let total = 0;
                          for (let user in stats) {
                            total += stats[user];
                            html += '<div style="display:flex; justify-content:space-between; margin-bottom:4px;">' +
                                    '<span>' + user + '</span>' +
                                    '<span style="color:#22c55e;">' + stats[user] + '</span></div>';
                          }
                          list.innerHTML = html;
                          counter.innerText = total;
                        }

                        // Инициализация на YouTube API
                        if (!window.YT) {
                          let tag = document.createElement('script');
                          tag.src = "https://www.youtube.com/iframe_api";
                          document.head.appendChild(tag);
                        }

                        window.onYouTubeIframeAPIReady = function() {
                          setTimeout(() => {
                            const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
                            iframes.forEach(iframe => {
                              let player = new YT.Player(iframe, {
                                events: {
                                  'onStateChange': (e) => {
                                    if (e.data === 1 && !iframe.dataset.playing) {
                                      reportPlay();
                                      iframe.dataset.playing = "true";
                                    } else if (e.data === 0) {
                                      iframe.dataset.playing = "";
                                    }
                                  }
                                }
                              });
                            });
                          }, 1500);
                        };

                        // Първоначално зареждане на статс
                        fetch(serverUrl + '/stats').then(r => r.json()).then(renderStats);
                      })();
                    </script>
                  `
                }),
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});