//middleware example
const middleware_example=(req,res,next) => {
    req.text="request method is accessible via middleware"
    next();
}

module.exports=middleware_example;