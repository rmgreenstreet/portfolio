require('dotenv');
const { cloudinary } = require('../cloudinary');
const axios = require('axios');
const Pageres = require('pageres');
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
        let projectImages = [];
        const allImages = await cloudinary.v2.search
        .expression('folder=portfolio/projects').execute();
        // console.log('images:',allImages);

        //use Heroku CLI to get list of all apps and send them to the page to loop through and display in carousel/grid
        const projects = await axios.get('https://api.heroku.com/apps',{headers: 
            {
            Accept: "application/vnd.heroku+json; version=3",
            Authorization: `Bearer ${process.env.HEROKU_TOKEN}` /* token previously created using heroku CLI 'heroku authorizations:create' */
            }
        });
        
        for(let project of projects.data) {
            const projectImage = await cloudinary.image(project.web_url,{signed:true, type:'url2png'});
            projectImages.push(projectImage);
        }

        console.log(projectImages);
        console.log(projects.data);
        res.render('index', { projects:projects.data, projectImages, title: 'Robert Greenstreet - Home', page:'home'});
    },
    async postContact(req,res,next) {
        
        res.session.success = `Your message has been sent! I'.. be in touch ASAP! A confirmation message was also sent to ${req.body.email}`
    }
}