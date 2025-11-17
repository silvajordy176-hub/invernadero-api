import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// -------- CONEXIÓN A MONGODB --------
mongoose.connect(
  "mongodb+srv://jordy:si1213yla4s@cluster0.sqhfwvz.mongodb.net/invernadero?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error al conectar MongoDB:", err));

// -------- ESQUEMA --------
const DataSchema = new mongoose.Schema({
  temp: Number,
  hum: Number,
  soil: Number,
  pump: String,
  timestamp: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", DataSchema);

// -------- RUTA PARA GUARDAR DATOS --------
app.post("/api/data", async (req, res) => {
  try {
    const nuevo = new Data(req.body);
    await nuevo.save();
    res.json({ message: "Datos guardados correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar" });
  }
});

// -------- RUTA PARA LEER DATOS --------
app.get("/api/data", async (req, res) => {
  const datos = await Data.find().sort({ timestamp: -1 }).limit(50);
  res.json(datos);
});

// -------- RUTA PRINCIPAL --------
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// -------- PUERTO --------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
