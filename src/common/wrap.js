export const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error(error.stack);
            next(error);
        }
    };
};