export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const mines = Number(req.body.mines || 3);
  const gridSize = 5; // fixed
  const total = gridSize * gridSize;

  let cells = Array.from({ length: total }, (_, i) => i);
  cells.sort(() => Math.random() - 0.5);

  const picks = cells.slice(0, mines);

  res.json({
    gridSize,
    mines,
    picks
  });
}
