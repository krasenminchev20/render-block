import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bettermode Render app is running");
});

app.post("/", (req, res) => {
  const body = req.body || {};
  const appId = body?.data?.appId;
  const interactionId = body?.data?.interactionId;

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
                props: "{\"className\":\"space-y-6\",\"direction\":\"vertical\",\"padding\":\"md\"}",
                children: "[\"header\",\"progress\",\"script\",\"video1\",\"video2\",\"video3\",\"video4\"]"
              },

              {
                id: "header",
                name: "Text",
                props: "{\"size\":\"lg\",\"weight\":\"bold\",\"value\":\"Enjoy these hits\"}",
                children: "[]"
              },

              {
                id: "progress",
                name: "Html",
                props: "{\"html\":\"<div style='width:100%;background:#222;border-radius:10px;height:10px;margin-bottom:10px'><div id=bar style='height:10px;width:0%;background:#22c55e;border-radius:10px'></div></div><div id=count style='font-size:14px'>0 / 4 videos played</div>\"}",
                children: "[]"
              },

              {
                id: "script",
                name: "Html",
                props: "{\"html\":\"<script>let played=0;const total=4;function update(){document.getElementById('count').innerText=played+' / '+total+' videos played';document.getElementById('bar').style.width=(played/total*100)+'%';}document.addEventListener('click',e=>{const iframe=e.target.closest('iframe');if(iframe && !iframe.dataset.played){iframe.dataset.played=true;played++;update();}});</script>\"}",
                children: "[]"
              },

              {
                id: "video1",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/DNEdnKq9Hj0\",\"height\":315,\"title\":\"DNB Video 1\"}",
                children: "[]"
              },

              {
                id: "video2",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/Qtogm_mo1AQ\",\"height\":315,\"title\":\"DNB Video 2\"}",
                children: "[]"
              },

              {
                id: "video3",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/G00dmXhboaw\",\"height\":315,\"title\":\"DNB Video 3\"}",
                children: "[]"
              },

              {
                id: "video4",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/3jsHPvjxR7A\",\"height\":315,\"title\":\"DNB Video 4\"}",
                children: "[]"
              }

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