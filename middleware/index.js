const rateLimiter = require('express-rate-limit');


const middleware = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
		},
	postLimiter (req,res,next){
		rateLimiter({
			windowMs: 1000, // 1 second window
			max: 3, // start blocking after 3 requests
			message:"Too many messages sent from this IP, please try again after a minute"
		});
	} 
};

module.exports=middleware;
