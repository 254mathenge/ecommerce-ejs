import jwt from "jsonwebtoken";
const secret = process.env.SECRET_KEY;

// export const isAuthenticated = (req, res, next) => {
//     const token = req.cookies.access_token; // Read from cookies
//     if (!token) {
//         return res.redirect("/login");
//     }

//     jwt.verify(token, secret, (err, user) => {
//         if (err) {
//             return res.redirect("/login");
//         }
//         console.log("Authenticated user:", user);
//         req.user = user;
//         next();
//     });
// };

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.redirect("/login");
    }
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  });
};

// Middleware to check admin access
export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    // return res.status(403).send("Access Denied: Admins Only");
    return res.redirect("/user");
  }
  next();
};
