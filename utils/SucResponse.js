const SucResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        success: true,
        data : data
    })
}

export default SucResponse;