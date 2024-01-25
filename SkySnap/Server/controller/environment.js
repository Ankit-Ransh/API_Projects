require("dotenv").config();
const router = require("../config/router");

const geoLocation = process.env.geoLocation;
const API_KEY_DATE_TIME = process.env.API_KEY_DATE_TIME;

router.post("/environment", async (req,res) => {

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const latitude = req.body.longitude;
    const longitude = req.body.longitude;

    let geoLocationUrl = geoLocation + `${API_KEY_DATE_TIME}&format=json&by=position&lat=${latitude}&lng=${longitude}`;

    try{    
        const locationResponse = await fetch(geoLocationUrl);
        const locationData = await locationResponse.json();

        console.log(locationData);

        return res.status(200).json(locationData);
    }
    catch(err){
        return res.status(500).json({error: "Internal server error"});
    }

});

module.exports = router;


