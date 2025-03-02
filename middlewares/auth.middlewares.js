import jwt from "jsonwebtoken";
const secret = process.env.SECRET_KEY;

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies.access_token; // Read from cookies
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
