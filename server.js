const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "689881769122-eok1c47akm356fe86bpaiqr9hmivn4m9.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const PORT = process.env.PROT || 5000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/login', (req, res)=>{
    res.render('login');

})

app.post('/login', (req, res)=>{
    let token = req.body.token;
    console.log(token);

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        // const userid = payload['sub'];
        
        console.log(payload);
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next()
      })
      .catch(console.error);

})

app.get('/profile', (req, res)=>{
    let user = req.user;
    res.render('profile', {user});
})

app.get('/protecdroute', (req, res)=>{
    // res.send('This route is protected')
    res.render('protectedroute');
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('login');
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})