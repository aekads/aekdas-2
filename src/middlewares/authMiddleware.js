// const authMiddleware = (req, res, next) => {
//     if (req.session.user) {
//         return next();
//     } else {
//         req.flash('error_msg', 'You need to be logged in to access this page.');
//         res.redirect('/login');
//     }
// };

// module.exports = authMiddleware;