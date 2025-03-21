const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
require('dotenv').config()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;

// middleware setup
app.use(express.json({limit: "25mb"}));
// app.use((express.urlencoded({limit: "25mb"})));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: [
        'https://lebaba-frontend-final-lime.vercel.app', 
        'https://lebaba-ecommerce-backend-app-eta.vercel.app',
        'https://lebaba-frontend-final-sdk8.vercel.app',
        'https://lebaba-frontend-final-fvy349ys8-mohammed-saadiq-k-hans-projects.vercel.app' // new frontend link
    ],
    credentials: true
}))

// image upload 
const uploadImage = require("./src/utils/uploadImage")

// all routes
const authRoutes = require('./src/users/user.route');
const productRoutes =  require('./src/products/products.route');
const reviewRoutes = require('./src/reviews/reviews.router');
const orderRoutes = require('./src/orders/orders.route');
const statsRoutes = require('./src/stats/stats.route')

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes)

main()
  .then(() => console.log("mongodb is successfully connected."))
  .catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.db.collection('admin'); // use the 'admin' collection
    console.log("MongoDB is successfully connected.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});