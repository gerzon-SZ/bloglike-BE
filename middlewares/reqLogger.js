const reqLogger = (req, res, next) => {
    if (req) {
        console.log('Received request from client!')
        req.user = {admin : true}
    }
   
    next();
}

module.exports = reqLogger;