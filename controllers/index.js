require('dotenv');
const { cloudinary } = require('../cloudinary');
const axios = require('axios');
const ejs = require('ejs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
	// GET /
	async getLandingPage(req, res, next) {

        //use Heroku CLI to get list of all apps and send them to the page to loop through and display in carousel/grid
        const projects = await axios.get('https://api.heroku.com/apps',{headers: 
            {
            Accept: "application/vnd.heroku+json; version=3",
            Authorization: `Bearer ${process.env.HEROKU_TOKEN}` /* token previously created using heroku CLI 'heroku authorizations:create' */
            }
        });
        
        const projectImages = await cloudinary.v2.search
        .expression(`folder:portfolio/projects`)
        .execute();
        console.log(projectImages.resources);

        res.render('index', { projects:projects.data, projectImages:projectImages.resources, title: 'Robert Greenstreet - Home', page:'home'});
    },
    async postContact(req,res,next) {
        const { firstname, lastname, email, company } = req.body;
        try{
            //render .ejs file into a string using values from contact form to send a response email to be sent through sendgrid
            const renderedHtml = await ejs.renderFile('./private/templates/contact.ejs', { firstname, lastname, email, company });
            const response = {
                to:`${firstname} ${lastname} (${company}) <${email}>`,
                from:'Robert Greenstreet <rgreenstreetdev@gmail.com>',
                subject:'Thank you for contacting me!',
                html:renderedHtml
            }
            //send an alert to myself about the contact
            const alert = {
                to:'rgreenstreetdev@gmail.com',
                from:'rgreenstreetdev@gmail.com',
                subject:`New contact from ${firstname} at ${company}`,
                html:`<ul>
                    <li>Name: ${firstname} ${lastname}</li>
                    <li>Email: ${email}</li>
                    <li>Company: ${company}</li>
                </ul>`
            }
            await sgMail.send(response);
            await sgMail.send(alert);
            req.session.success = `Your message has been sent! I'll be in touch ASAP! 
            A confirmation message was also sent to ${email}`;
            res.redirect('/');
        } catch(err) {
            console.log(err);
            req.session.error='There was an issue sending the message. Please try again';
            return res.redirect('/')
        }
    }
}