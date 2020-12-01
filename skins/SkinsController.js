const express = require("express");
const router = express.Router();
const path = require('path');
const session = require('express-session');

const request = require('request');
var formidable = require('formidable');
const awsS3 = require('./aws-s3/AwsS3')
const skinService = require('./SkinService')
const categories = ['Tabuleiro', 'Emblema', 'Peca']

router.get("/error", (req,res) => {
    skinService.getSkins("tabuleiro")
        .then(function (body){
            res.send(body)
        })
})

router.get("/admin/skins", (req,res) => {
    
    //Busca Skins no BackEnd
    skinService.getSkins(req.query.categoryName)
    .then(function (body){
        skins = JSON.parse(body)
        
        //Busca imagens na AWS
        awsS3.returnAllImages(skins)
            .then((skins) => {
                res.render("admin/skins/index", {skins: skins, categories: categories})
                });
    })
});


router.get("/admin/skins/new", (req,res) => {
    var options = {
        'method': 'GET',
        'url': 'https://trilha-ies.herokuapp.com/category'
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(JSON.parse(response.body))
        res.render("admin/skins/new", {categories: categories})
    });
});

router.post("/admin/skins/save", (req,res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log(files.image.path);
        console.log(fields)
        awsS3.uploadToS3(files.image.path,fields.name + '.jpg', 
            function (fileName) {
                var options = {
                    'method': 'POST',
                    'url': 'https://trilha-ies.herokuapp.com/skin/',
                    'headers': {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: fields.name,
                        imageUrl: fileName,
                        categoryId: fields.categoryId,
                        price: fields.price
                    })
                  
                  };
                  request(options, function (error, response) {
                    if (error) throw new Error(error);
                    console.log(response.body);
                    res.redirect("/admin/skins");
                  });
            })
    })    
      
});

router.post("/admin/skin/delete", (req,res) => {
    var options = {
        'method': 'DELETE',
        'url': 'https://trilha-ies.herokuapp.com/skin/'+req.body.id,
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.redirect("/admin/skins/");
    });
});

router.get("/admin/skin/edit/:id", (req,res) => {
    var options = {
        'method': 'GET',
        'url': 'https://trilha-ies.herokuapp.com/skin/' + req.params.id
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var skin =JSON.parse(response.body);
        var options = {
            'method': 'GET',
            'url': 'https://trilha-ies.herokuapp.com/category'
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var categories =JSON.parse(response.body);
            awsS3.getS3Image(skin.imageUrl).then((img) => {
                res.render("admin/skins/edit", {
                    categories: categories,
                    skin: skin,
                    img: Buffer.from(img).toString('base64')
                })
            })    
        });
    });
});

router.post("/admin/skins/edit/:id", (req,res) => {

    console.log(req.body)
        var options = {
            'method': 'PUT',
            'url': 'https://trilha-ies.herokuapp.com/skin/' + req.params.id,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: req.body.name,
                imageUrl: req.body.name + '.jpg',
                categoryId: req.body.categoryId,
                price: req.body.price
            })
            
        };
        
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            res.redirect("/admin/skins");
        });
      
});

//new things

router.get("/skins/categories/", (req,res) => {
    var request = require('request');
    var options = {
        'method': 'GET',
        'url': 'https://trilha-ies.herokuapp.com/category'
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        res.render("admin/skins/index", {categories: JSON.parse(response.body)})
    });
});


router.get("/admin/skins/:categoryId", (req,res) => {
    var options = {
        'method': 'GET',
        'url': 'https://trilha-ies.herokuapp.com/category/' + req.params.categoryId
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(JSON.parse(response.body))
        res.render("admin/skins/:categoryId", {category: JSON.parse(response.body)})
    });
});

module.exports = router;