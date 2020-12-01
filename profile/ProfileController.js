const express = require("express");
const router = express.Router();
const profileService = require('./ProfileService')
const awsS3 = require('../skins/aws-s3/AwsS3')
var formidable = require('formidable');
const categories = ['Tabuleiro', 'Emblema', 'Peca']


router.get("/profile", (req,res) => {
    
    if(req.cookies['jwt'] == undefined) {
        res.redirect("/admin/users/login");
    }
    //Busca Skins no BackEnd
    profileService.getMySkins(req.cookies['jwt'])
     .then(function (body){
         skins = JSON.parse(body)
         
         //Busca imagens na AWS
         awsS3.returnAllImages(skins)
             .then((skins) => {
                 res.render("profile", {mySkins: skins, categories: categories})
                 });
     })
});

router.post("/profile/save", (req,res) => {
    console.log(req.body)
    
    profileService.equipSkin(req.cookies['jwt'], req.body.skinSelected_Tabuleiro)
    .then(function(result) {
        console.log(result);
        return profileService.equipSkin(req.cookies['jwt'], req.body.skinSelected_Emblema);
      })
    .then(function(result) {
        console.log(result);
        return profileService.equipSkin(req.cookies['jwt'], req.body.skinSelected_Peca);
    })
    .then(function(result) {
        console.log(result);
        res.redirect("/profile");
    })
});

module.exports = router;