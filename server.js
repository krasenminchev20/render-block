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
                props: "{\"title\":\"Video Test\"}",
                children: "[]"
              },
              {
                id: "content",
                name: "Card.Content",
                props: "{\"className\":\"space-y-3\"}",
                children: "[\"stack\"]"
              },
              {
                id: "stack",
                name: "Container",
                props: "{\"direction\":\"vertical\",\"padding\":\"sm\"}",
                children: "[\"text1\",\"iframe1\"]"
              },
              {
                id: "text1",
                name: "Text",
                props: "{\"value\":\"Testing YouTube iframe\",\"size\":\"md\"}",
                children: "[]"
              },
              {
                id: "iframe1",
                name: "Iframe",
                props: "{\"url\":\"https://www.youtube.com/embed/H98Rfljxmsc\",\"height\":400,\"title\":\"YouTube video\"}",
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