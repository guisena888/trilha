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

router.get("/admin/users/logoff", (req,res) => {
  res.clearCookie('jwt');
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
        var tokenResponse = JSON.parse(response.body);
        if(response.statusCode == 200){
            res.cookie('jwt', tokenResponse.token, {maxAge: 6000 * 60 * 600});
            if(tokenResponse.roles.includes("ROLE_MODERATOR")){
              res.redirect("/admin/skins")
            }
            res.redirect("/");
        } else {
            res.redirect("/admin/users/login");
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
            role: ['user'],
            password: req.body.password
        })
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        if(response.statusCode == 200){
            res.redirect("/admin/users/login");
        } else {
            res.redirect("/admin/users/create")
        }
      });
});

module.exports = router;
