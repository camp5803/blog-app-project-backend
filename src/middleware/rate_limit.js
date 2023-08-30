import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

export default rateLimit({
    windowMs: 1000,
    max: 10,
    handler(req, res) {
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
            message: "Request rejected."
        });
    }
});