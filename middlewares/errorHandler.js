import ErrorResponse from '../utils/ErrorResponse.js';

const errorHandler = (err,req,res,next) => {
    let error = {...err};
    error.message = err.message;

    try {
        res.status(error.statusCode || 500).json({
            success : false,
            message : error.message || "Server Error."
        });
    } catch (err) {
        console.log(err);
    };

}

export default errorHandler;