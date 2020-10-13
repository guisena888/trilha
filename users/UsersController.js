const express = require("express");
const router = express.Router();
const User = require("./Users");
const request = require('request');

router.get("/admin/users/", (req,res) => {
    res.send("lista de users");
});

router.get("/admin/users/create", (req,res) => {
    res.render("admin/users/create");
});

router.get("/admin/users/login", (req,res) => {
    res.render("admin/users/login");
});


router.post("/users/signin", (req,res) => {
    var options = {
        'method': 'POST',
        'url': 'https://trilha-ies.herokuapp.com/api/auth/signin',
        'headers': {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        if(response.statusCode == 200){
            res.render("/admin/skins");
        } else {
            res.render("/admin/users/login");
        }
      });
});

router.post("/users/signup", (req,res) => {
    var options = {
        'method': 'POST',
        'url': 'https://trilha-ies.herokuapp.com/api/auth/signup',
        'headers': {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: req.body.username,
            email: req.body.email,
            role: ['mod'],
            password: req.body.password
        })
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        if(response.statusCode == 200){
            res.render("/admin/users/login");
        } else {
            res.render("/admin/users/create")
        }
      });
});

module.exports = router;
