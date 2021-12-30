const V = require("../models/vehicles");


exports.add = function A(req, res) {
    res.render("vehicles/vehiclesAdd", { layout: "lay/vehiclesLayout" });
};

exports.create = (req, res) => {
    let V1 = new V({
        brand: req.body.brand,
        name: req.body.name,
        quantity:req.body.quantity  
    });

    V1.save(function(err) {
        if (err) {
            return res
                .status(400)
                .json({err});
        }
        req.flash("vehicles_add_success_msg", "New vehicles added successfully");
        res.redirect("/vehicles/all");
    });
};
exports.all = (req, res) => {
    V.find(function(err, Vs) {
        if (err) {
            return res
                .status(400)
                .json({ err: "Oops something went wrong! Cannont find vehicless." });
        }
        res.status(200).render("vehicles/vehiclesAll", {
            Vs,
            layout: "lay/vehiclesLayout"
        });
    });
};
