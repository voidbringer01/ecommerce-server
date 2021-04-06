const express = require('express')
const logger = require('./middlewares/logger')
const config = require('./config')
const cors = require('cors')
const mongoose = require('mongoose')
// const session = require('express-session')
const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy;
const validPassword = require('./utils/passwordUtils').validPassword
var morgan = require("morgan");



// const MongoStore = require('connect-mongo')

// Db config
mongoose.connect(config.dbConnection,{
    useCreateIndex:true
})
let db = mongoose.connection;
const User = require('./models/user')
const { all } = require('./routes/api/category')

db.on('error', (err)=>{
    console.log(err)
})
db.once('open',()=>{
    console.log('Connected to MongoDB')
})

// Session store
// const sessionStore = MongoStore.create({
//      mongoUrl:config.dbConnection,
//      collection:'sessions'
// })

const app = express();


// middlewares
console.log(__dirname)
app.use(express.static(__dirname+'/uploads/'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.use(upload.array())
app.use(morgan('common'))
// app.use(session({
//     secret:'some secret',
//     resave:false,
//     saveUninitialized:true,
//     store:sessionStore,
//     cookie:{
//         maxAge:1000 * 60 * 60 * 24 
//     }
// }))

// Passport config
// const customFields = {
//     usernameField: 'uname',
//     passwordField: 'pw'
// };
// const verifyCallback = (username, password, done) => {

//     User.findOne({ username: username })
//         .then((user) => {

//             if (!user) { return done(null, false) }
            
//             const isValid = validPassword(password, user.hash, user.salt);
            
//             if (isValid) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//             }
//         })
//         .catch((err) => {   
//             done(err);
//         });

// }

// const strategy  = new LocalStrategy(customFields, verifyCallback);

// passport.use(strategy);

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((userId, done) => {
//     User.findById(userId)
//         .then((user) => {
//             done(null, user);
//         })
//         .catch(err => done(err))
// });


// app.use(passport.initialize());
// app.use(passport.session());

// passport config done


app.use('/api/login', require('./routes/api/login'))
app.use('/api/register', require('./routes/api/register'))
app.use('/api/category', require('./routes/api/category'))
app.use('/api/items', require('./routes/api/shopItem'))
app.use('/api/plans', require('./routes/api/plans'))
app.use('/api/transactions', require('./routes/api/transactions'))
app.use('/api/tickets', require('./routes/api/tickets'))
app.use('/api/support', require('./routes/api/support'))

app.listen(3000,'138.68.102.182');
// app.listen(3000)