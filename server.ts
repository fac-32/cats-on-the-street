import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

type Cat = {
  id: number;
  name: string;
  description: string;
  location: string;
};

let cats: Cat[] = [
  {
    id: 1,
    name: "Whiskers",
    description: "Siamese grey",
    location: "Stockwell",
  },
  { id: 2, name: "Fluffy", description: "Black cat", location: "Hoxton" },
  { id: 3, name: "Mittens", description: "Tabby", location: "Camden" },
  { id: 4, name: "Shadow", description: "Black cat", location: "Shoreditch" },
  {
    id: 5,
    name: "Tiger",
    description: "Orange tabby",
    location: "Rockerfeller Plaz",
  },
];

// get all cat names
app.get("/cats", (req, res) => {
  let names = cats.map((cat) => cat.name);
  res.status(200).json(names);
});

// get specific cat by id with description
app.get("/cat/:id", (req, res) => {
  const catId = parseInt(req.params.id);
  if (catId) {
    const cat = cats.find((c) => c.id === catId);
    if (cat) {
      res.status(200).json(cat);
    } else {
    res.status(404).json({ error: "Cat not found" });
    }
  }
});

// add new cat
app.post("/cats", (req, res) => {
  if (req.body.description && req.body.location && req.body.name) {
    let highestID = 0;

    for (let cat of cats) {
      if (cat.id > highestID) {
        highestID = cat.id;
      }
    }

    highestID++;

    const newCat: Cat = {
      id: highestID,
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
    };

    cats.push(newCat);
    res.status(201).json(newCat);
  } else {
    res
      .status(400)
      .json({
        message:
          "Required information omitted. Please provide Name, Description, Location",
      });
  }
});

// delete cat by id
app.delete("/cats/:id", (req, res) => {
  const catId = parseInt(req.params.id);
  cats = cats.filter((c) => c.id !== catId);
  res.json({ message: "Cat deleted" });
});

// update cat description
app.put("/cats/:id", (req, res) => {
  const catId = parseInt(req.params.id);
  const newDescription = req.body.description;
  const cat = cats.find((c) => c.id === catId);
  if (cat) {
    cat.description = newDescription;
    res.json(cat);
  } else {
    res.status(404).json({ error: "Cat not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;