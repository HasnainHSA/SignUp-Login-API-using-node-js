// middleware 
const middlewares = {
    
    authMiddleWare: (req, res, next) => {
        console.log(req.header.authorization, "request")

    const user = true
    if (user) {
        next()
    }
    else{
        res.json({
            message : "invalid user"
        })
    }

}}

module.exports = middlewares