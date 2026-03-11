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
                props: "{\"className\":\"space-y-4\",\"direction\":\"vertical\",\"padding\":\"md\"}",
                children: "[\"header\",\"card1\",\"card2\",\"card3\"]"
              },

              {
                id: "header",
                name: "Text",
                props: "{\"className\":\"font-bold mb-4\",\"size\":\"lg\",\"value\":\"Recommended for You\"}",
                children: "[]"
              },

              {
                id: "card1",
                name: "Card",
                props: "{\"className\":\"mb-4 shadow-sm border border-gray-100 hover:shadow-md\"}",
                children: "[\"content1\"]"
              },

              {
                id: "content1",
                name: "Card.Content",
                props: "{\"className\":\"p-4 flex flex-col gap-2\"}",
                children: "[\"title1\",\"meta1\",\"desc1\",\"iframe1\",\"btn1\"]"
              },

              {
                id: "title1",
                name: "Text",
                props: "{\"size\":\"lg\",\"value\":\"be kind coolest thing you can do\",\"weight\":\"bold\"}",
                children: "[]"
              },

              {
                id: "meta1",
                name: "Text",
                props: "{\"size\":\"xs\",\"value\":\"TikTok\",\"weight\":\"semibold\"}",
                children: "[]"
              },

              {
                id: "desc1",
                name: "Html",
                props: "{\"className\":\"text-gray-600 leading-relaxed\",\"html\":\"<p>Description of be kind coolest thing you can do <a href='https://www.tiktok.com/@user258431600/video/7612050679338683670'>View TikTok</a></p>\"}",
                children: "[]"
              },

              {
                id: "iframe1",
                name: "Iframe",
                props: "{\"src\":\"https://www.tiktok.com/embed/v2/7612050679338683670\",\"height\":600,\"title\":\"TikTok video\"}",
                children: "[]"
              },

              {
                id: "btn1",
                name: "Button",
                props: "{\"value\":\"See more\",\"variant\":\"primary\",\"href\":\"https://www.google.com\",\"target\":\"_blank\"}",
                children: "[]"
              },

              {
                id: "card2",
                name: "Card",
                props: "{\"className\":\"mb-4 shadow-sm border border-gray-100 hover:shadow-md\"}",
                children: "[\"content2\"]"
              },

              {
                id: "content2",
                name: "Card.Content",
                props: "{\"className\":\"p-4 flex flex-col gap-2\"}",
                children: "[\"title2\",\"meta2\",\"desc2\",\"btn2\"]"
              },

              {
                id: "title2",
                name: "Text",
                props: "{\"size\":\"lg\",\"value\":\"Nobody talks about return on kindness\",\"weight\":\"bold\"}",
                children: "[]"
              },

              {
                id: "meta2",
                name: "Text",
                props: "{\"size\":\"xs\",\"value\":\"Article\",\"weight\":\"semibold\"}",
                children: "[]"
              },

              {
                id: "desc2",
                name: "Html",
                props: "{\"className\":\"text-gray-600 leading-relaxed\",\"html\":\"<p>Every business talks about returns ranging from ROI to ROE. But nobody talks about return on kindness.</p><p><a href='https://medium.com/illumination/choose-kindness-and-pass-it-on-fc3a37fd8051'>Read the article</a></p>\"}",
                children: "[]"
              },

              {
                id: "btn2",
                name: "Button",
                props: "{\"value\":\"See more\",\"variant\":\"primary\",\"href\":\"https://www.google.com\",\"target\":\"_blank\"}",
                children: "[]"
              },

              {
                id: "card3",
                name: "Card",
                props: "{\"className\":\"mb-4 shadow-sm border border-gray-100 hover:shadow-md\"}",
                children: "[\"content3\"]"
              },

              {
                id: "content3",
                name: "Card.Content",
                props: "{\"className\":\"p-4 flex flex-col gap-2\"}",
                children: "[\"title3\",\"meta3\",\"desc3\",\"iframe3\"]"
              },

              {
                id: "title3",
                name: "Text",
                props: "{\"size\":\"lg\",\"value\":\"testing title url\",\"weight\":\"bold\"}",
                children: "[]"
              },

              {
                id: "meta3",
                name: "Text",
                props: "{\"size\":\"xs\",\"value\":\"YouTube\",\"weight\":\"semibold\"}",
                children: "[]"
              },

              {
                id: "desc3",
                name: "Html",
                props: "{\"className\":\"text-gray-600 leading-relaxed\",\"html\":\"<p><a href='https://www.youtube.com/watch?v=H98Rfljxmsc'>Watch on YouTube</a></p>\"}",
                children: "[]"
              },

              {
                id: "iframe3",
                name: "Iframe",
                props: "{\"src\":\"https://www.youtube.com/embed/H98Rfljxmsc\",\"height\":315,\"title\":\"YouTube video\"}",
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