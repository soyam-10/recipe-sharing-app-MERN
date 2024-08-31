const bcrypt = require("bcryptjs");


const newPassword = '123456789'; // Replace with the new password
bcrypt.hash(newPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('New Password Hash:', hash);
});
