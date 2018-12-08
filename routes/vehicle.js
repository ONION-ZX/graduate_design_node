const express = require('express');
const dbUtil = require('../db/dbUtil');
const router = express.Router();

router.get('/createVehicle', (req, res, next) => {
    let price = req.query.price;
    let title = req.query.title;
    let year = req.query.year;
    let preview = req.query.preview;
    let brand_id = req.query.brand_id;
    let publisher_id = req.query.publisher_id;
    let on_sale = req.query.on_sale;
    let description = req.query.description;
    
});

router.get('/deleteVehicle', (req, res, next) => {

});

router.get('/editVehicle', (req, res, next) => {

});

router.get('/getVehicles', (req, res, next) => {

});

router.get('/queryVehicles', (req, res, next) => {

});

module.exports = router;