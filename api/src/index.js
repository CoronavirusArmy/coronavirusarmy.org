import "regenerator-runtime/runtime";
import express from "express";
import passport from "passport";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import logger from "morgan";
import chalk from "chalk";
import errorHandler from "errorhandler";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import api from "./routes";
import { cron } from "./helpers/insync";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("error", err => {
    console.error(err);
    console.log("%s MongoDB connection error. Please make sure MongoDB is running.", chalk.red("✗"));
    process.exit();
});

let corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true
};

if (process.env.NODE_ENV === "production") {
    corsOptions = {
        origin: "https://coronavirusarmy.org",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true
    };
}

const app = express();

require("./config/passport");

app.use(cors(corsOptions));

app.use(compression());
app.use(logger("dev"));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);

app.use(
    bodyParser.json({
        limit: "50mb",
        extended: true
    })
);
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true
    })
);

if (process.env.NODE_ENV !== "production") {
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send("Server Error");
    });
}

app.use(api());
cron();

app.listen(process.env.PORT || 8080, () => {
    console.log("%s App is running at http://localhost:%d in %s mode", chalk.green("✓"), process.env.PORT || "8080", process.env.NODE_ENV || "development");
    console.log("  Press CTRL-C to stop\n");
});

export default app;
