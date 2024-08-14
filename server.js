const express = require('express');
const dotenv = require('dotenv');
// @ts-ignore
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require("path")
//dot config
dotenv.config();
//mongodb connection
connectDB();


//rest object
//const app = express();
const app = express();

app.get('/', (req, res) => {
  res.send('API is running...')
});

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('server'));
//routes
//1 test route
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

//STATIC FOLDER
app.use(express.static(path.join(__dirname, "./client/build")));

//STATIC ROUTES
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});
//PORT
//const PORT=process.env.PORT || 800;
const PORT = Number(process.env.PORT);

//listen
app.listen(PORT, () => {
  console.log(
    `Node server Running In ${process.env.DEV_MODE} 
       ModeOn Port ${process.env.PORT}`.bgBlue.white


  );
});

