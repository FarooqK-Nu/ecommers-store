import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.issues.map(issue => issue.message);
        throw new ApiError(errorMessages.join(", "), 400);
    }
    req.body = result.data;
    next();
};

export default validate;