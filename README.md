GridLinker Backend:
See frontend: https://github.com/Lotoke/grid-game

The backend for GridLinker is built with Express.js and runs as a firebase function

Performs the following:
-Sends player scores between the frontend and a firebase realtime database.
-Grid number generation, ensuring that all players get the same set of numbers
-resetting of the grid every 24h by keeping track of the date that scores are submitted to the database

Dependencies:
"cors": "^2.8.5",
"express": "^4.18.2",
"firebase-admin": "^11.10.1",
"node-schedule": "^2.1.1",
"nodemon": "^3.0.1",
"unique-names-generator": "^4.7.1"
