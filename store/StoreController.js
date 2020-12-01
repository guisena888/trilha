const express = require("express");
const router = express.Router();
const skinService = require('../skins/SkinService')
const storeService = require('./StoreService')
const awsS3 = require('../skins/aws-s3/AwsS3')
const categories = ['Tabuleiro', 'Emblema', 'Peca']

router.get("/store", (req,res) => {
    
    if(req.cookies['jwt'] == undefined) {
        res.redirect("/admin/users/login");
    }
    //Busca Skins no BackEnd
    storeService.getCatalog(req.cookies['jwt'], req.query.categoryName)
     .then(function (body){
         skins = JSON.parse(body)
         
         //Busca imagens na AWS
         awsS3.returnAllImages(skins)
             .then((skins) => {
                 res.render("store/catalog", {skins: skins, categories: categories})
                 });
     })
});


router.post("/store/buy/", (req,res) => {
    
    if(req.cookies['jwt'] == undefined) {
        res.redirect("/admin/users/login");
    }
    //Busca Skins no BackEnd
    storeService.buySkin(req.cookies['jwt'], req.body.id)
     .then(function (body){
        res.redirect("/store")
     })
});

module.exports = router;