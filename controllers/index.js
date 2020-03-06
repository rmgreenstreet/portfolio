require('dotenv');
const User = require('../models/user');
const Project = require('../models/project');
const { cloudinary, imageDelete } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const axios = require('axios');
const util = require('util');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// async function loginAfterChange (user,req,res) {
//     console.log('logging back in after a change to account');
//     const login = util.promisify(req.login.bind(req));
//     await login(user);
// };

module.exports = {
	// GET /
	async getLandingPage(req, res, next) {
        try {
            const projects = await axios.get('https://api.heroku.com/apps',{headers: 
                {
                Accept: "application/vnd.heroku+json; version=3",
                Authorization: `Bearer ${process.env.HEROKU_TOKEN}`
                }
            });
            console.log(projects);
            res.render('index', { projects, title: 'Robert Greenstreet - Home', page:'home'});
        } catch(err) {
            console.log(err);
            res.redirect('/');
        }
    },
    async postContact(req,res,next) {
        
    }
}