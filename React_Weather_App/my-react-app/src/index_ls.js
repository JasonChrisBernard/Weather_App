const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");

const templatePath = path.join(__dirname, '../tempelates');
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);

// Serve static files like CSS, JavaScript, and images from the "public" directory
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    await collection.insertMany([data]);

    res.render("home");
});

const port = 3000; // You can change the port if needed

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});