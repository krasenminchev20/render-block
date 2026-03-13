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
                children: "[\"header\",\"counter\",\"video1\",\"video2\",\"video3\",\"video4\"]"
              },

              {
                id: "header",
                name: "Text",
                props: "{\"size\":\"lg\",\"weight\":\"bold\",\"value\":\"Enjoy these hits\"}",
                children: "[]"
              },

              {
                id: "counter",
                name: "Html",
                props: "{\"html\":\"<div style='margin-bottom:20px'><div style='width:100%;height:8px;background:#2a2a2a;border-radius:8px;overflow:hidden'><div id=progressbar style='height:8px;width:0%;background:#22c55e'></div></div><div id=videocount style='margin-top:8px;font-size:14px'>0 / 4 videos played</div></div><script>let played=0;const total=4;function update(){document.getElementById('videocount').innerText=played+' / '+total+' videos played';document.getElementById('progressbar').style.width=(played/total*100)+'%';}document.addEventListener('pointerdown',e=>{const iframe=e.target.closest('iframe');if(iframe && !iframe.dataset.counted){iframe.dataset.counted=true;played++;update();}});</script>\"}",
                children: "[]"
              },

              {
                id: "video1",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/DNEdnKq9Hj0\",\"height\":315}",
                children: "[]"
              },

              {
                id: "video2",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/Qtogm_mo1AQ\",\"height\":315}",
                children: "[]"
              },

              {
                id: "video3",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/G00dmXhboaw\",\"height\":315}",
                children: "[]"
              },

              {
                id: "video4",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/3jsHPvjxR7A\",\"height\":315}",
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