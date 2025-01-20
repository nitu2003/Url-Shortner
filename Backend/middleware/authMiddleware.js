const firebase = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const User = require('../models/User');


const defaultApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});

const preauthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    // Proceed if no token is provided
    if (!token) {
        res.status(401).json({ message: 'Auth token required' });
        return next();
    }

    try {
        // Verify the Firebase token
        const decodedToken = await defaultApp.auth().verifyIdToken(token);

        console.log('@@@@@@@ ',decodedToken)
        
        // Attach user email to the request object
       

        // Add additional fields to the request body if needed
        req.body = {
            ...req.body,
            isGoogleAuth: true,
        };
        
        let user = await User.findOne({userId: decodedToken.uid});
        if(!user){
            //if user not found , create new user
            user = new User({
                email:decodedToken.email,
                userId:decodedToken.uid,
                name:decodedToken.name
            });
            await user.save();
            console.log('New user created:',user);
        }
        req.user={
            email:decodedToken.email,
            userId:decodedToken.uid
        }


        //find in db with the userId in user db

        //if user does not exists then create user and append email, userId in the req.user

       
        next();
       
    } catch (error) {
        // Handle invalid or expired token errors
        console.log(error)
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = preauthMiddleware;
