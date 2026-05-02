import express, { Request, Response } from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server working");
});

app.get("/api", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API working"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});