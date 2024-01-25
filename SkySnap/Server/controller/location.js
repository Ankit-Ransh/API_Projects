require("dotenv").config();
const router = require("../config/router");

// API for weather information
const geoCoordinate = process.env.geoCoordinate;
const API_KEY = process.env.API_KEY;

router.post("/", async (req,res) => {

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const searchedLocation = req.body.searchedLocation;
    const units = req.body.units;

    const geoCoordinateURL = geoCoordinate + `${searchedLocation}` + `&appid=${API_KEY}&units=${units}`;

    try{
        const response = await fetch(geoCoordinateURL);
        const data = await response.json();

        return res.status(200).json(data);
    }
    catch(err){
        return res.status(500).json({error: "Server failed"});
    }
});

module.exports = router;
