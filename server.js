const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔴 Pega aquí tu cadena de MongoDB
mongoose.connect(
  "mongodb+srv://jordy:s1i2l3v4a5@cluster0.sqhfwwz.mongodb.net/invernadero?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error("Error al conectar MongoDB:", err));


// Esquema para los datos
const DataSchema = new mongoose.Schema({
  temp: Number,
  hum: Number,
  soil: Number,
  pump: String,
  timestamp: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", DataSchema);

// Ruta para guardar datos
app.post("/api/data", async (req, res) => {
  try {
    const nuevo = new Data(req.body);
    await nuevo.save();
    res.json({ message: "Datos guardados correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar" });
  }
});

// Ruta para leer datos
app.get("/api/data", async (req, res) => {
  const datos = await Data.find().sort({ timestamp: -1 }).limit(50);
  res.json(datos);
});

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

app.listen(3000, () => console.log("Servidor iniciado en puerto 3000"));

