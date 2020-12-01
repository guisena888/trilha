const express = require("express");
const router = express.Router();
const path = require('path');
const session = require('express-session');

const request = require('request');
var formidable = require('formidable');
const awsS3 = require('../skins/aws-s3/AwsS3')
const profileService = require('../profile/ProfileService')
const categories = ['Tabuleiro', 'Emblema', 'Peca']

router.get('/game', (req, res) => {
    if(req.cookies['jwt'] == undefined) {
        res.redirect("/admin/users/login");
    }
    profileService.getMySkins(req.cookies['jwt'])
     .then(function (body){
         skins = JSON.parse(body)
         
         //Busca imagens na AWS
         awsS3.returnAllImages(skins)
             .then((skins) => {
                 res.render("game/index", {skins: skins, categories: categories})
                 });
     })
});
module.exports = router;