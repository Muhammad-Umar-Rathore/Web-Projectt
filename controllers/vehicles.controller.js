
//const { json } = require("express/lib/response");
const V = require("../models/vehicles");
const U = require("../models/User");


exports.add = function A(req, res) {
    res.render("vehicles/vehiclesAdd", { layout: "lay/vehiclesLayout" });
};

exports.create = (req, res) => {
        let V1 = new V({
        id:req.body.id,
        myimage:req.body.myImage,
        brand: req.body.brand,
        name: req.body.name,
        quantity:req.body.quantity,
    });
    console.log("ss",V1.myimage);
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


exports.view = (req, res) => {
    V.find(function(err, Vs) {
        if (err) {
            return res
                .status(400)
                .json({ err: "Oops something went wrong! Cannont find vehicless." });
        }
        res.status(200).render("vehicles/view", {
            Vs,
            user:req.params.user,
            layout: "./lay/main"
        });
    });
};
exports.checkout = (req, res) => {
    t=JSON.parse(req.params.V11);
    
    V.find({id:t.vid},function(err, Vs) {
        if (err) {
            return res
                .status(400)
                .json(err);
        }
        U.find({email:t.user},function(err, U) {
            if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            res.status(200).render("../checkout", {
                Vs:Vs[0],
                U:U[0],
                layout: "./lay/main"
            });
        });
    });
};
