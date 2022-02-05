const path = require("path");
const express = require("express");
const router = express.Router();

router.use(express.static(path.resolve("./") + '/client/build'));

router.get("/", (req, res) => {
    res.sendFile('./index.html');
});

module.exports = router;