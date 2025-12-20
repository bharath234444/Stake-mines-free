export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { gridSize = 5, mines = 5, seed = "" } = req.body || {};
    const size = Number(gridSize);
    const total = size * size;

    // Simple deterministic hash (FREE, no AI, no API key)
    function hash(str) {
      let h = 2166136261 >>> 0;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    }

    const base = `${size}:${mines}:${seed}:${Date.now()}`;
    let raw = [];
    let sum = 0;

    for (let i = 0; i < total; i++) {
      const h = hash(base + i);
      const v = (h % 1_000_000) / 1_000_000;
      const score = Math.pow(1 + v, 2); // bias towards "safe"
      raw.push(score);
      sum += score;
    }

    // Normalize to probabilities
    const distribution = raw.map(v => v / sum);

    // Best cell (highest probability)
    let bestIndex = 0;
    distribution.forEach((v, i) => {
      if (v > distribution[bestIndex]) bestIndex = i;
    });

    res.status(200).json({
      ok: true,
      mode: "FREE_PREDICTION",
      bestCell: bestIndex + 1,
      confidence: distribution[bestIndex],
      distribution
    });

  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
}
