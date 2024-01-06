const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sequelize = require('./database');
const User = require('./models/user');
const LedgerData = require('./models/ledger');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "build" directory (or adjust the path based on your project structure)
app.use(express.static(path.join(__dirname, 'build')));

sequelize.sync({ force: true }).then(() => {
  console.log('Database and tables created!');
});

app.get('/', (req, res) => {
  res.send('Welcome to the authentication server!');
});

// Define a route for "/ledger" that serves your React application
app.get('/ledger', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error during login' });
  }
});

app.post('/api/saveLedgerData', async (req, res) => {
  try {
    const { name, code, group } = req.body;

    // Save data to the LedgerData model
    await LedgerData.create({ name, code, group });

    res.json({ success: true, message: 'Ledger data saved successfully' });
  } catch (error) {
    console.error('Error saving ledger data:', error);
    res.status(500).json({ success: false, message: 'Error saving ledger data' });
  }
});

app.get('/api/displayLedgerData', async (req, res) => {
  try {
    // Fetch data from the LedgerData model
    const ledgerData = await LedgerData.findAll();

    // Respond with the fetched data
    res.json(ledgerData);
  } catch (error) {
    console.error('Error fetching ledger data:', error);
    res.status(500).json({ success: false, message: 'Error fetching ledger data' });
  }
});

app.get('/api/getGroupData', async (req, res) => {
  try {
    // Fetch group data from the LedgerData model
    const groupData = await LedgerData.findAll({
      attributes: ['code', 'name'],
      group: ['code', 'name'],
    });

    // Respond with the fetched group data
    res.json(groupData);
  } catch (error) {
    console.error('Error fetching group data:', error);
    res.status(500).json({ success: false, message: 'Error fetching group data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
