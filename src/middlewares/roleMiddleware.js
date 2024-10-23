// src/middlewares/roleMiddleware.js
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      if (req.session.user && allowedRoles.includes(req.session.user.role)) {
        return next();
      } else {
        req.flash('error_msg', 'You do not have permission to access this page.');
        return res.redirect('/Dashboard');
      }
    };
  };
  
  module.exports = checkRole;
  