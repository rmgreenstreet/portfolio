const User = require('../models/user');
const { cloudinary } = require('../cloudinary');


const middleware = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
		},
	async isLoggedIn (req,res,next) {
		if(req.isAuthenticated()) return next();
		req.session.error = 'You need to be logged in to do that!';
		req.session.redirectTo = req.originalUrl;
		res.redirect('/users/login');
	},
	async isPostAuthor (req,res,next) {
		const post = await Post.findById(req.params.id);
		if(post.author.equals(req.user._id)){
			res.locals.post=post;
			return next();
		}
		req.session.error='Access Denied!'
		res.redirect('back')
	},
	async isValidPassword (req,res,next) {
		const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
		if(user){
			console.log('found user');
			//add user to res.locals
			res.locals.user = user
			next();
		}
		else {
			console.log('no user found');
			middleware.deleteProfileImage(req);
			req.session.error = "Incorrect current password!";
			return res.redirect('/profile');
		}
	},
	async changePassword (req,res,next) {
		const {
			newPassword,
			passwordConfirmation,
		} = req.body;
		if(newPassword && !passwordConfirmation) {
			req.session.error = 'Missing password confirmation!';
			middleware.deleteProfileImage(req);
			return res.redirect('/profile');
		}
		else if(newPassword && passwordConfirmation) {
			console.log('user wants to change password')
			const { user } = res.locals;
			if(newPassword === passwordConfirmation) {
				console.log('passwords match');
				await user.setPassword(newPassword);
				next();
			} else {
				console.log('passwords do not match');
				middleware.deleteProfileImage(req);
				req.session.error = "New passwords do not match!"
				return res.redirect('/profile');
			}
		} else {
			next();
		}
	},
	async deleteProfileImage (req,res,next) {
		if (req.file) {	
			await cloudinary.uploader.destroy(req.file.public_id);
		}
	}
};

module.exports=middleware;
