const express = require("express");
const bodyParser = require("body-parser");
const firebaseAdmin = require("firebase-admin");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin apps for 4 projects
const apps = {
  Rouya: firebaseAdmin.initializeApp(
    {
      credential: firebaseAdmin.credential.cert(
        require("./Rouya-serviceAccountKey.json")
      ),
      databaseURL: "https://rouyatest.firebaseio.com",
    },
    "RouyaApp"
  ),

  Docturm: firebaseAdmin.initializeApp(
    {
      credential: firebaseAdmin.credential.cert(
        require("./Docturm-serviceAccountKey.json")
      ),
      databaseURL: "https://doctorum-16c04.firebaseio.com",
    },
    "DocturmApp"
  ),

  Assel: firebaseAdmin.initializeApp(
    {
      credential: firebaseAdmin.credential.cert(
        require("./Assel-serviceAccountKey.json")
      ),
      databaseURL: "https://asselproject-18a50.firebaseio.com",
    },
    "AsselApp"
  ),

  Goldenship: firebaseAdmin.initializeApp(
    {
      credential: firebaseAdmin.credential.cert(
        require("./Goldenship-serviceAccountKey.json")
      ),
      databaseURL: "https://goldenship-749dd.firebaseio.com",
    },
    "GoldenshipApp"
  ),
};

// Endpoint to send notification from a specific Firebase project
app.post("/:projectId/send-notification", async (req, res) => {
  const { projectId } = req.params;
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res
      .status(400)
      .json({ error: "Missing required fields (token, title, body)" });
  }

  const selectedApp = apps[projectId];

  if (!selectedApp) {
    return res.status(400).json({ error: `Invalid project ID: ${projectId}` });
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const messaging = selectedApp.messaging();
    const response = await messaging.send(message);

    return res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(port, () => {
  console.log(`Multi-project FCM server running at http://localhost:${port}`);
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const firebaseAdmin = require("firebase-admin");
// const cors = require("cors");
// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(bodyParser.json());

// // Initialize Firebase Admin apps for 3 projects
// const apps = {
//   Rouya: firebaseAdmin.initializeApp(
//     {
//       credential: firebaseAdmin.credential.cert(
//         require("./Rouya-serviceAccountKey.json")
//       ),
//       databaseURL: "https://rouyatest.firebaseio.com",
//     },
//     "RouyaApp"
//   ),

//   Docturm: firebaseAdmin.initializeApp(
//     {
//       credential: firebaseAdmin.credential.cert(
//         require("./Docturm-serviceAccountKey.json")
//       ),
//       databaseURL: "https://doctorum-16c04.firebaseio.com",
//     },
//     "DocturmApp"
//   ),

//   Assel: firebaseAdmin.initializeApp(
//     {
//       credential: firebaseAdmin.credential.cert(
//         require("./Assel-serviceAccountKey.json")
//       ),
//       databaseURL: "https://asselproject-18a50.firebaseio.com",
//     },
//     "AsselApp"
//   ),
// };

// // Endpoint to send notification from a specific Firebase project
// app.post("/send-notification/:projectId", async (req, res) => {
//   const { projectId } = req.params;
//   const { token, title, body } = req.body;

//   if (!token || !title || !body) {
//     return res
//       .status(400)
//       .json({ error: "Missing required fields (token, title, body)" });
//   }

//   const selectedApp = apps[projectId];

//   if (!selectedApp) {
//     return res.status(400).json({ error: `Invalid project ID: ${projectId}` });
//   }

//   try {
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       token,
//     };

//     const messaging = selectedApp.messaging();
//     const response = await messaging.send(message);

//     return res.status(200).json({ success: true, messageId: response });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     return res.status(500).json({ error: "Failed to send notification" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Multi-project FCM server running at http://localhost:${port}`);
// });
