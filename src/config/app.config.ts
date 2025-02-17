import dotenv, { config, } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { ENVType } from "../utils/enum.util";
import ENV from "../utils/env.util";
import errorHandler from "../middlewares/error.mdw";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import expressSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import v1Routes from "../routers/routes.router";
import { requestLogger } from "../services/logger.service";




dotenv.config();


const app = express();

app.use(requestLogger)

// body parser
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: false}))

app.use(bodyParser.json({limit: '50mb', inflate: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))

// cookie parser
app.use(cookieParser())

// temporaary files directory
app.use(fileUpload({useTempFiles: true, tempFileDir: path.join(__dirname, 'tmp')}))


/**
 * sanitize data
 * secure db against sql injection
 */
app.use(expressSanitize())

// secure response header
app.use(helmet())

// prevent parameter pollution
app.use(hpp())

const allowedOrigins = ["http://localhost:3000"]; // Replace with your frontend origin

app.use(
    cors({
        origin: allowedOrigins, // Set allowed frontend origin
        credentials: true, // Allow cookies and auth headers
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
    })
);

// ✅ Remove manually setting headers (CORS handles this)
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
    next();
});

// ✅ Handle preflight requests (important for CORS)
app.options("*", cors());



app.set('view engine', 'ejs')

app.get("/", (req: Request, res: Response, next: NextFunction) => {

    let enviornemnt = ENVType.DEVELOPMENT

    if (ENV.isProduction()) {
        enviornemnt = ENVType.PRODUCTION
    } else if (ENV.isStaging()) {
        enviornemnt = ENVType.STAGING
    } else if (ENV.isDevelopment()) {
        enviornemnt = ENVType.DEVELOPMENT
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: {
            name: "Freshcart API - DEFAULT",
            version: "1.0.0",

        },
        message: 'Freshcart api v1.0.0',
        status: 200

    })
})

app.use('/v1', v1Routes)

app.use(errorHandler)

export default app;