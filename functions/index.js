const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const dashboardOneRoute = require("./routes/db1.js");
const dashboardTwoRoute = require("./routes/db2.js");
const about = require("./routes/about.js");
const timeline = require("./routes/timeline.js");
const userMedia = require("./routes/user-media.js");
const products = require("./routes/products.js");
const categories = require("./routes/categories.js");
const invoices = require("./routes/invoices.js");
const faq = require("./routes/faq.js");

app.use("/db/1", dashboardOneRoute);
app.use("/db/2", dashboardTwoRoute);
app.use("/about", about);
app.use("/timeline", timeline);
app.use("/user_media", userMedia);
app.use("/products", products);
app.use("/categories", categories);
app.use("/faq", faq);
app.use("/invoices", invoices);

const api = functions.https.onRequest(app)

module.exports = {
  api
}
