import express from "express";
import cors from "cors";
import PptxGenJS from "pptxgenjs";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const API_KEY = process.env.API_KEY;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/generate-pptx", async (req, res) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title = "Presentation", slides = [] } = req.body;
  const pptx = new PptxGenJS();

  slides.forEach(s => {
    const slide = pptx.addSlide();
    slide.addText(s.title || "", { x: 0.5, y: 0.5, fontSize: 24, bold: true });
    if (s.bullets) {
      slide.addText(s.bullets.join("\n"), { x: 0.5, y: 1.5, fontSize: 14 });
    }
  });

  const buffer = await pptx.write("nodebuffer");

  res.set({
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "Content-Disposition": `attachment; filename="${title}.pptx"`
  });

  res.send(buffer);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Doc generator running on port ${port}`);
});
