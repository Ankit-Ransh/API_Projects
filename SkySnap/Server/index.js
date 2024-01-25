require("dotenv").config();

const server = require("./config/middleware");

const location = require("./controller/location");
server.use("/location", location);

const environment = require("./controller/environment");
server.use("/", environment);

const PORT = process.env.PORT;
server.listen(`${PORT}`, () => {
    console.log(`Server connected at PORT ${PORT}`);
});




