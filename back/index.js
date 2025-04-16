const app = require("./app");
const db = require('./config/db')
const port = 3000;
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: false,
      error: err.message || 'Something went wrong',
    });
  });
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
  