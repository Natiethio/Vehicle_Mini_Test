
class middlewareAuth  {
    async isAuthenticated(req, res, next) {
        try{
            if (req.session && req.session.userId) {
                console.log('User authenticated:', req.session.userId);
                next(); 
            } else {
                res.status(401).json({ message: 'Unauthorized. Please log in.' });  
            }
        }
        catch(error){
            console.log(error)
        }

    }

    async logSession (req, res, next) {
        console.log('Session Data:', req.session);
        next();
    }
};

module.exports = new middlewareAuth();

