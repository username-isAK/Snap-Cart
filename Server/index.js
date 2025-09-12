const express = require("express");
const connectToDB = require("./db");
require("dotenv").config();
const cors = require("cors");

connectToDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
app.use(express.json());

app.use("/api/users", require("./routes/user"));
app.use("/api/products", require("./routes/product"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/cart", require("./routes/cart"));

app.get("/", (req, res) => res.send("E-commerce API is running"));

app.listen(port, () => console.log(`Server running on port ${port}`));
