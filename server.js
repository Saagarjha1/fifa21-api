const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Path to your CSV file (update this with the correct file path)
const csvFilePath = 'C:/Users/sagar/Downloads/archive (3)/fifa21_male2.csv'; // Local file path

// Parse FIFA data from CSV file
let fifaData = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => fifaData.push(row))
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

// Home Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the FIFA Stats API!" });
});

// Get all players' stats
app.get('/players', (req, res) => {
  res.json(fifaData);
});

// Get player stats by name
app.get('/players/:name', (req, res) => {
  const playerName = req.params.name.toLowerCase();
  const player = fifaData.filter(player => player.Name.toLowerCase().includes(playerName));

  if (player.length === 0) {
    return res.status(404).json({ error: 'Player not found' });
  }

  res.json(player);
});

// Get players by Overall Rating (OVA)
app.get('/players/ova/:rating', (req, res) => {
  const rating = parseInt(req.params.rating);
  const players = fifaData.filter(player => parseInt(player.OVA) >= rating);

  if (players.length === 0) {
    return res.status(404).json({ error: `No players with OVA >= ${rating} found.` });
  }

  res.json(players);
});

// Get players by Potential (POT)
app.get('/players/pot/:rating', (req, res) => {
  const rating = parseInt(req.params.rating);
  const players = fifaData.filter(player => parseInt(player.POT) >= rating);

  if (players.length === 0) {
    return res.status(404).json({ error: `No players with POT >= ${rating} found.` });
  }

  res.json(players);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
