/*function auth.isLoggedIn (req, res, next) => {
        if (req.isAuthenticated()) {
        */
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { // Or your custom logic: if (req.user)
           return next();
        }
        return res.redirect('/signin');
    };

