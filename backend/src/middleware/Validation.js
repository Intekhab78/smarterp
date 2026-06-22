const {validationResult} = require("express-validator");
// translate('Ik spreek Engels', { to: 'en' })
const validate = (validations) => {
    return async (req, res, next) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({ error: "Validation failed", data: errors.array() });
    };
};

module.exports = {
    validate
}