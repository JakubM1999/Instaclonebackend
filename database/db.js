const MONGOPASS = process.env.MONGOPASS


module.exports = {
    db: `mongodb+srv://Instaclone:${MONGOPASS}@cluster0.hkh7o.mongodb.net/instaclone?retryWrites=true&w=majority`,
    JWT: process.env.JWTPASS
};