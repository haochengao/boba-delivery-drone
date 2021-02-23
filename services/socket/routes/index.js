const express = require("express");
const router = express.Router();

router.get("/socket/ping", (req, res) => {
    res.send({response: "pong"}).status(200);
});

module.exports = router;

