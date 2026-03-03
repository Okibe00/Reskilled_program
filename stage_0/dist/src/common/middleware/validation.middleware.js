export const validate = (schema) => async (req, res, next) => {
    try {
        // Validate body, query, and params
        // I can use this function generic with a flag
        // console.log(req.body)
        await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        // Pass the Zod error to our Global Error Handler
        // console.log(error)
        next(error);
    }
};
