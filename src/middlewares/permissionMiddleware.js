
// src/middlewares/permissionMiddleware.js

// const checkPermission = (requiredPermission) => {
//     return (req, res, next) => {
//       const user = req.session.user;
      
//       if (user && user.permissions && user.permissions.includes(requiredPermission)) {
//         return next(); // User has the permission
//       } else {
//         // Optionally log or notify which specific permission is missing
//         console.error(`User ${user.name} lacks ${requiredPermission} permission`);
//         req.flash('error_msg', `You do not have the  permission (${requiredPermission}) to perform this action.`);
//         return res.redirect('/login');
//       }
//     };
//   };
//   module.exports = checkPermission;

const checkPermission = (requiredPermissions) => {
    return (req, res, next) => {
      const user = req.session.user;
  
      // If no user or no permissions, redirect to login
      if (!user || !user.permissions) {
        req.flash('error_msg', 'You are not authorized to perform this action.');
        return res.redirect('/login');
      }
  
      // Check if `requiredPermissions` is an array or a single permission string
      const hasPermission = Array.isArray(requiredPermissions)
        ? requiredPermissions.every(permission => user.permissions.includes(permission))
        : user.permissions.includes(requiredPermissions);
  
      if (hasPermission) {
        return next(); // User has the necessary permissions
      } else {
        // Log the missing permission and show error
        console.error(`User ${user.name} lacks the required permission(s): ${requiredPermissions}`);
        req.flash('error_msg', `You do not have the permission(s) to perform this action.`);
        return res.redirect('/Dashboard');
      }
    };
  };
  
  module.exports = checkPermission;
  