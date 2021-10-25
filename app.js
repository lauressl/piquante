const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require("dotenv");
dotenv.config();
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const mongoose = require('mongoose');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');


const app = express();



mongoose.connect(process.env.APP_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  
app.use(helmet());
app.use(mongoSanitize());
app.use(bodyParser.json());

app.use("/api/", apiLimiter);
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static('images'))

module.exports = app;