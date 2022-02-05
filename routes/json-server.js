const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const dataPath = path.resolve("./") + '/data/features.geojson';

// READ features
router.get('/features', (req, res) => {
    try {
      const readData = fs.readFileSync(dataPath, 'utf8');
      const dataObject = JSON.parse(readData);
      res.json({
          'status':'success',
          'result': dataObject.features
      });
    } catch (err) {
      res.json({
          'status': 'failed',
          'message': err
      });
    }  
});

router.get('/feature/:id', (req, res) => {
    
    const id = req.params['id'];

    try {
      const readData = fs.readFileSync(dataPath, 'utf8');
      const dataObject = JSON.parse(readData);
      const filterFeatures = dataObject.features.filter(feature=>feature.properties.id===id);
      let findFeature = null;
      if(filterFeatures.length>0){
          findFeature = filterFeatures[0];
      }
      res.json({
          'status':'success',
          'result': findFeature
      });
    } catch (err) {
      res.json({
          'status': 'failed',
          'message': err
      });
    }  
});

router.post('/feature/add', (req, res) => {

    const { 
        location,
        title,
        category,
        address,
        description
    } = req.body;

    try {
        var readData = fs.readFileSync(dataPath);
        var oldDataObject = JSON.parse(readData);
        
        var newFeature = {
           type:'Feature',
           geometry:{
              type:'Point',
              coordinates:location
           },
           properties:{
              id: uuidv4(),
              title: title,
              category: category,
              address: address,
              description: description
           }
        };
        
        oldDataObject.features.push(newFeature);
        
        var newWriteData = JSON.stringify(oldDataObject);
        fs.writeFile(dataPath, newWriteData, (err) => {
            if (err) throw err;
            res.json({
              'status': 'success',
              'result': newFeature
            });
        });
        
    } catch (err) {
        res.json({
          'status': 'failed',
          'message': err
        });
    }
});

module.exports = router;