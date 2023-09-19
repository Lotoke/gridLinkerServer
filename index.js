const express = require("express");
const schedule = require("node-schedule");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
var meanScore = 0;
var bestScore = 0;
var grid = [];
var gridGenerated = false;

app.use(bodyParser.json());

//if ((gridGenerated = false)) {
//  grid2 = GridGenerator();
//  gridGenerated = true;
//  console.log("5");
//}

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
        tempGrid[row].push(randomNum);
        sum += randomNum;
      }
    }
  }

  return tempGrid;
}
function generateStats() {
  var totalScore = 0;

  //console.log(scores.playerName[1]);

  for (i = 0; i < scores.length; i++) {
    totalScore += scores[i].score;
  }
  meanScore = Math.floor(totalScore / scores.length);

  bestScore = Math.min(...scores.map((scoreObj) => scoreObj.score));
  return { bestScore, meanScore };
}

grid = GridGenerator(); // generated initial grid
scores = [
  {
    playerName: "init",
    score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
    timestamp: "2023-09-17T15:56:19.334Z",
  },
];

meanScore = generateStats().meanScore;
bestScore = generateStats().bestScore;

schedule.scheduleJob("0 0 * * *", () => {
  // This code will run at midnight every day
  grid = GridGenerator();
  scores = [
    {
      playerName: "init",
      score: Math.floor(Math.random() * (65 - 45 + 1) + 45),
      timestamp: "2023-09-17T15:56:19.334Z",
    },
  ];
});

const callback = () => {
  meanScore = generateStats().meanScore;
  bestScore = generateStats().bestScore;
  console.log(meanScore);
  console.log(Math.min(bestScore));
  console.log(scores);
};

// Score submission endpoint
app.use(cors());

app.post("/api/scores", (req, res) => {
  const { playerName, score, timestamp } = req.body;
  scores.push({ playerName, score, timestamp });
  res.status(201).json({ message: scores });
  callback();
});

app.get("/api/bestScore", (req, res) => {
  // Find the highest score

  res.json({ bestScore });
});
app.get("/api/meanScore", (req, res) => {
  // Find the highest score

  res.json({ meanScore });
});

app.get("/api/gridGen", (req, res) => {
  // Find the highest score

  res.json({ grid });
});

app.use(logger);

function logger(req, res, next) {
  console.log(req.originalUrl);
  console.log(scores);

  next();
}
app.listen(4000);
