//middleware example
const middleware_example=(req,res,next) => {
    req.text="request method is accessiblen via middleware"
    console.log(req.originalUrl)
    next();
}

module.exports=middleware_example;