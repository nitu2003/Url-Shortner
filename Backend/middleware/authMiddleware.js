const firebase = require('firebase-admin');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccountConfig = {
    type: 'service_account',
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjok1H3f8oju4/\nC+AWO2q52iBPe2UTPw++acCsKqdRvktmYsfjn+O210wFzPSTDZPx8Kx6aP+9iBvA\niws3k/eLGFSHITz6CzDEWUVmbBy88Z4ADeOqF5KXfzkdiTnNL59Nuqbb7MSpMy3T\n4jLXiphjUfn0aSvmXlp4taYru3puBQ2vG01mTyhYfIiNIL1I9vVMzK0Cf93W74I3\nRntwwUI3ZyQAA2oS6Vc/bOtBgWkjUV6Uqq9seXwuBkziHdx07bpbBw141i0on2qk\nMIOt2NM/8WzWQLpeldCqfRKXh//1TtGcNmT12V/qAr1jdpKtZdN44YR3DRtElTWj\nAJgPPTfPAgMBAAECggEABn969ygjKk6mul0z3F4mqlO1pcJeLKn765FSg+O7ujzG\nzL2Od4URa2DYVYCik7Zd0iU/DCtgQHwHshkzbFUVZvIj5SvWOo24NYvf/CW97Gjh\n39mtWUNPYHG+aGRbJcFG37TSTHh2BMwR/VCFuVZ5H7SRKvoEMsU7bYC1JRZwUa8U\na0F4TpPGYBVgCk19XkhLVcpJ+b5/IBVs3vg/gVXFKAwfWsM/mODJ8kDuw2mvsbMP\nrEMZj46uvfJFlSIm9afvwHrRUFWa7ckPLVVpcceudIsv0Pib8qfNNvMqFd2pjLno\nHPrdLNwW/zPkQybt+EVHzkhqFATK7nWZzj7+7TGmaQKBgQDVuGL4PEK9qFuim/k1\nFqT4HATtjKQGDp/tG0tozStSUncADb0L8Fwufm60WaFvhPfD262rfp/dAnhoQNup\nWjCbjhOnk5LrliUM8b0Ou+6FiJorxCsK6fqK3Nv/CUL8nWVREsjoX0hJjt7ZQEjA\n1rIyLHIwzq8ydhwMA9FC72NdGQKBgQDEAVrHj3Tvsa2AaOnKOSQKQ9nrbVpOdEzu\nVqUaQRfhc8nipFutjchYHQb3q8cT5M4Iw3AGE+TnjjcIP4IH14PhOyoDEizaDT25\n+c62yGRalIFFSO5+fe1GOJ17htGJ3wX+wLZP6FUyKkNGDrMk488duf524S+7I7SA\nP71CUVJxJwKBgAPUF8HGopNvLqUNEjvHOhFPvy7aNB3/qRHASWuJMVt6KrOPi3Fp\nTt1uWmFUsbWjtiSGDOhjjk2RO8LyVn0EJpbCxstbs2gQ+nzu36oh57XwqoJaM0Mw\nydIu/qnk6pRH5Ya8RWkUO+FFc+yEYElED1EixrDlIvJOd1Ynw1nlm+wRAoGADBj9\nTmXnVMgFqnBPRcEDHXMUpzhHo6IAAZHtfNJZs/uekVONqQegPvgDrxO2JN8xbE8L\nwgRGU5hugx7QWsWNiUBKlofvpsG8dpcZkCSMNR8HX4xh1ALXu0bRSYeHtVfDmfax\nCfuQDpmXL2LG4dcBuJb7QsEhXg6VHHlSqB421W8CgYEAkKAt01aW9EJPz2e8jH77\n9AvOrdrz3qsRd4WLwmk4yv4iybPFqDeeaiXixaLmjbs+6uuQg7bdiexO//2fxfbr\nKAriZleaXeaLy4OPn0PhwaVMooXqmFUhVVhp0xU1WAf2yiDviDODJquzcn4e3ELv\nXak/Yl074kQ8zFBJsGHd1zM=\n-----END PRIVATE KEY-----\n",
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};



const defaultApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccountConfig),
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
