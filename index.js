const express = require("express");
const schedule = require("node-schedule");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const serviceAccount = require(path.resolve(
  __dirname,
  "serviceAccountKey.json"
));
const { uniqueNamesGenerator, names } = require("unique-names-generator");
//var serviceAccount = require("/serviceAccountKey.json");
const admin = require("firebase-admin");
var meanScore = 0;
var bestScore = 0;
var grid = [];
var scores = [];
var gridGenerated = false;
var day = 1;
var scorePos;
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://gridlinker-8e148-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();

const refGrid = db.ref("gridData");
const refScore = db.ref("scoreData");
const refMean = db.ref("meanData");
const refBest = db.ref("bestData");

store = (ref, data) => {
  ref.set(data, (error) => {
    if (error) {
      console.error("Error storing :", error);
    } else {
      console.log("stored successfully");
    }
  });
};

const fetch = (ref) => {
  return new Promise((resolve, reject) => {
    ref.once(
      "value",
      (snapshot) => {
        const data = snapshot.val() || [];
        resolve(data);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const sortNewScore = (playerName, score, timestamp) => {
  let appended = false;
  for (let i = 0; i < scores.length; i++) {
    console.log(i);
    if (scores[i].score > score) {
      scores.splice(i, 0, { playerName, score, timestamp });
      scorePos = i;
      appended = true;
      break;
    }
    scorePos = i;
  }
  if (appended == false) {
    scores.push({ playerName, score, timestamp });
    scorePos = scorePos + 1;
  }
};
// GENERATE NEW GRID
function GridGenerator() {
  var tempGrid = [];
  var sum = 0;

  while (sum !== 200) {
    tempGrid = [];
    sum = 0;

    for (let row = 0; row < 10; row++) {
      tempGrid.push([]);
      for (let col = 0; col < 5; col++) {
        let randomNum = Math.floor(Math.random() * 10);
        if (randomNum > 5) {
          randomNum = Math.floor(Math.random() * (20 - 10 + 1) + 10);
        }
        tempGrid[row].push(randomNum);
        sum += randomNum;
      }
    }
  }

  return tempGrid;
}

//GENERATE BESTSCORE/MEANSCORE STATS
function generateStats() {
  var totalScore = 0;

  for (i = 0; i < scores.length; i++) {
    totalScore += scores[i].score;
  }
  meanScore = Math.floor(totalScore / scores.length);

  bestScore = Math.min(...scores.map((scoreObj) => scoreObj.score));
  return { bestScore, meanScore };
}

//GENERATE GRID IF TIMESTAMP ON PREV SET OF SCORES SHOW NEW DAY
const initGrid = async () => {
  if (scores[0].timestamp != new Date().getDay().toString()) {
    scores = [
      {
        playerName: uniqueNamesGenerator({
          dictionaries: [names],
        }),
        score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
        timestamp: Number(new Date().getDay().toString()),
      },
      {
        playerName: uniqueNamesGenerator({
          dictionaries: [names],
        }),
        score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
        timestamp: Number(new Date().getDay().toString()),
      },
      {
        playerName: uniqueNamesGenerator({
          dictionaries: [names],
        }),
        score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
        timestamp: Number(new Date().getDay().toString()),
      },
      {
        playerName: uniqueNamesGenerator({
          dictionaries: [names],
        }),
        score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
        timestamp: Number(new Date().getDay().toString()),
      },
      {
        playerName: uniqueNamesGenerator({
          dictionaries: [names],
        }),
        score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
        timestamp: Number(new Date().getDay().toString()),
      },
    ];
    scores.sort((a, b) => a.score - b.score);
    console.log(scores);
    grid = GridGenerator();

    store(refGrid, grid);
    store(refScore, scores);
  } else {
    grid = await fetch(refGrid);
  }
};
//FULL STARTUP OPERATION, LOADING SCORES AND GRID FROM SERVER
const startupOP = async () => {
  scores = await fetch(refScore);
  await initGrid();
  console.log(grid);
  meanScore = generateStats().meanScore;
  bestScore = generateStats().bestScore;
};

startupOP();
//schedule.scheduleJob("0 0 * * *", () => {
//  grid = GridGenerator();
//  scores = [
//    {
//      playerName: "init",
//      score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
//     timestamp: "2023-09-17T15:56:19.334Z",
//   },
//  ];
//  day = day + 1;
//});

const callback = () => {
  meanScore = generateStats().meanScore;
  bestScore = generateStats().bestScore;
  store(refScore, scores);
};

// Score submission endpoint
app.use(cors());

app.post("/api/scores", (req, res) => {
  const { playerName, score, timestamp } = req.body;
  //scores.push({ playerName, score, timestamp });
  sortNewScore(playerName, Number(score), Number(timestamp));
  res.status(201).json({ message: scores });
  callback();
});

app.get("/api/bestScore", (req, res) => {
  // Find the highest score

  res.json({ bestScore });
});

app.get("/api/day", (req, res) => {
  // Find the highest score
  const day = scores[0].timestamp;
  res.json({ day });
});
app.get("/api/meanScore", (req, res) => {
  // Find the highest score

  res.json({ meanScore });
});

app.get("/api/gridGen", (req, res) => {
  // Find the highest score

  res.json({ grid });
});

app.get("/api/top5", (req, res) => {
  // Find the highest score
  const top5 = scores.slice(0, 5);
  res.json({ top5 });
});

app.get("/api/position", (req, res) => {
  // Find the highest score

  res.json({ scorePos });
});
app.use(logger);

function logger(req, res, next) {
  next();
}

const PORT = process.env.PORT || 8080;
app.listen(PORT);
