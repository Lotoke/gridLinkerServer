# GridLinker Backend

**Frontend Repository:** [GridLinker Frontend](https://github.com/Lotoke/grid-game)

The backend for GridLinker is built using Express.js and operates as a Firebase function.

## Functionality

- Sends player scores between the frontend and a Firebase Realtime Database.
- Handles grid number generation to ensure all players receive the same set of numbers.
- Resets the grid every 24 hours by comparing the date when scores are submitted to dates stored in the database.

## Dependencies

- "cors": "^2.8.5"
- "express": "^4.18.2"
- "firebase-admin": "^11.10.1"
- "node-schedule": "^2.1.1"
- "nodemon": "^3.0.1"
- "unique-names-generator": "^4.7.1"
