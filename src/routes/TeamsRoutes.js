const express = require("express");
const router = express.Router();
const teamMember = require('../controllers/teams.controller')

router.get("/", (req, res) => {
  res.render("register", { message: null });
});

router.get('/AddMember',(req, res) => {
  res.render("register", { message: null });
})




// router.post('/AddMember',teamMember.addMember);
module.exports=router;
















// Route to display all users
// app.get('/admin/users', async (req, res) => {
//   const user = req.session.user;

 
//   try {
//     const users = await User.findAll();
//     res.render('admin-users', { users });
//   } catch (error) {
//     console.error(error);
//     req.flash('error_msg', 'An error occurred while fetching users.');
//     res.redirect('/');
//   }
// });

// // Route to get the edit user form
// app.get('/admin/users/:id/edit', async (req, res) => {
//   const user = req.session.user;
//   const userId = req.params.id;

 
//   try {
//     const userToEdit = await User.findOne({ where: { id: userId } });

//     if (!userToEdit) {
//       req.flash('error_msg', 'User not found.');
//       return res.redirect('/admin/users');
//     }

//     res.render('edit-user', { user: userToEdit });
//   } catch (error) {
//     console.error(error);
//     req.flash('error_msg', 'An error occurred while fetching the user.');
//     res.redirect('/admin/users');
//   }
// });

// // Route to update a user's profile
// app.post('/admin/users/:id/edit', async (req, res) => {
//   const { name, email, role, currentPassword, newPassword, confirmNewPassword } = req.body;
//   const allowedRoles = ['admin', 'editor', 'viewer'];
//   const userId = req.params.id;

//   // Check if the role is one of the allowed roles
//   if (!allowedRoles.includes(role)) {
//     req.flash('error_msg', 'Invalid role selected.');
//     return res.redirect(`/admin/users/${userId}/edit`);
//   }

//   try {
//     const user = await User.findOne({ where: { id: userId } });

//     if (!user) {
//       req.flash('error_msg', 'User not found.');
//       return res.redirect('/admin/users');
//     }

//     // Update user details
//     user.name = name;
//     user.email = email;
//     user.role = role;

//     if (currentPassword || newPassword || confirmNewPassword) {
//       if (!currentPassword || !newPassword || !confirmNewPassword) {
//         req.flash('error_msg', 'Please fill in all password fields.');
//         return res.redirect(`/admin/users/${userId}/edit`);
//       }

//       const passwordMatch = await bcrypt.compare(currentPassword, user.password);
//       if (!passwordMatch) {
//         req.flash('error_msg', 'Current password is incorrect.');
//         return res.redirect(`/admin/users/${userId}/edit`);
//       }

//       if (newPassword !== confirmNewPassword) {
//         req.flash('error_msg', 'New passwords do not match.');
//         return res.redirect(`/admin/users/${userId}/edit`);
//       }

//       user.password = await bcrypt.hash(newPassword, 10);
//     }

//     await user.save();
//     req.flash('success_msg', 'User updated successfully.');
//     res.redirect('/admin/users');
//   } catch (error) {
//     console.error(error);
//     req.flash('error_msg', 'An error occurred while updating the user.');
//     res.redirect(`/admin/users/${userId}/edit`);
//   }
// });