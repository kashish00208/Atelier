import express from 'express';
const app = express();

app.get("/", (req, res) => {
  res.send(`Hello from port ${process.env.PORT}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});