const asyncHandler = require('express-async-handler');

const validate = (schema) => asyncHandler(async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
});

module.exports = { validate };