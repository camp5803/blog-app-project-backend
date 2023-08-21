function errorMiddleware(error, _req, res, _next) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    res.status(status).send({
        status,
        message,
    });
}

export default errorMiddleware;
