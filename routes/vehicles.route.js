const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const vehicles_controller = require("../controllers/vehicles.controller");


router.get("/add", vehicles_controller.add);
router.post("/add", vehicles_controller.create);

 router.get("/all", vehicles_controller.all);
 router.get("/view/:user", vehicles_controller.view);
 router.get("/checkout/:V11", vehicles_controller.checkout);

module.exports = router;