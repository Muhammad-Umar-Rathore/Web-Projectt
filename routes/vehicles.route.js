const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const vehicles_controller = require("../controllers/vehicles.controller");


router.get("/add",ensureAuthenticated, vehicles_controller.add);
router.post("/add",ensureAuthenticated, vehicles_controller.create);

 router.get("/all",ensureAuthenticated, vehicles_controller.all);

module.exports = router;