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
                name: "Card",
                props: "{\"padding\":\"md\"}",
                children: "[\"header\",\"content\"]"
              },
              {
                id: "header",
                name: "Card.Header",
                props: "{\"title\":\"TikTok Test\"}",
                children: "[]"
              },
              {
                id: "content",
                name: "Card.Content",
                props: "{\"className\":\"space-y-4\"}",
                children: "[\"stack\"]"
              },
              {
                id: "stack",
                name: "Container",
                props: "{\"direction\":\"vertical\",\"padding\":\"sm\"}",
                children: "[\"text1\",\"tiktokLink\",\"text2\",\"tiktokIframe\"]"
              },

              {
                id: "text1",
                name: "Text",
                props: "{\"value\":\"TikTok link (href variant)\",\"size\":\"md\",\"weight\":\"bold\"}",
                children: "[]"
              },

              {
                id: "tiktokLink",
                name: "Link",
                props: "{\"href\":\"https://www.tiktok.com/@scout2015/video/6718335390845095173\",\"external\":true,\"variant\":\"primary\"}",
                children: "[]"
              },

              {
                id: "text2",
                name: "Text",
                props: "{\"value\":\"TikTok iframe embed\",\"size\":\"md\",\"weight\":\"bold\"}",
                children: "[]"
              },

              {
                id: "tiktokIframe",
                name: "Iframe",
                props: "{\"src\":\"https://www.tiktok.com/embed/v2/6718335390845095173\",\"height\":600,\"title\":\"TikTok video\"}",
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