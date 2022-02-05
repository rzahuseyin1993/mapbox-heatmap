const express = require('express');
const cors = require('cors');

const PORT = normalizePort(process.env.PORT || '3001');

const appRouter = require("./routes/app");
const jsonServerRouter = require("./routes/json-server");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use('/', appRouter);
app.use('/json-server', jsonServerRouter);

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}