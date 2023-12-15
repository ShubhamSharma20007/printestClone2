var express = require('express');
var router = express.Router();
const modelData = require('../routes/users');
const postData = require('../routes/postmodel');
const passport = require('passport');
const localStrategy = require("passport-local")
    // multer configuration 
const upload = require("./multer")
passport.use(new localStrategy(modelData.authenticate()));


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { nav: false });
});


router.get('/register', function(req, res) {
    res.render('register', { nav: false });
});




router.get('/profile', isloggedIn, async function(req, res) {
    const user = await modelData.findOne({ username: req.session.passport.user })
        .populate("posts")

    res.render('profile', { user, nav: true });
});


router.get('/add', isloggedIn, async function(req, res) {
    const user = await modelData.findOne({ username: req.session.passport.user })

    res.render('add', { nav: true });
});


router.get('/contentimg/:id', isloggedIn, async function(req, res) {
    const imageData = await postData.findOne({ _id: req.params.id });
    if (!imageData) {
        res.status(404).send('Image not found');

    }
    console.log(imageData);
    res.render('contentimg', { nav: true, imageData });
});

// update route
router.post("/update/:id", isloggedIn, upload.single("image"), async(req, res) => {
    try {
        const check = await postData.findOne({ _id: req.params.id })
        const { title, description, image } = req.body
        const newImage = req.file ? req.file.filename : check.image // this is mandatory condition 
        const updatation = await postData.findByIdAndUpdate(req.params.id, { title, description, image: newImage }, { new: true })
        console.log(updatation)
        res.redirect('/profile')
    } catch (error) {

        console.log(error)
    }
})

// delete route 



router.delete("/delete/:id", async(req, res) => {
    try {
        const data = await postData.findOne({ _id: req.params.id });
        if (!data) {
            console.log('data not found')
        }
        const dele = await postData.findByIdAndDelete(req.params.id)
        res.json({
            message: true,
            dele
        })

    } catch (err) {

        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});







//fileupload route 
router.post("/fileupload", isloggedIn, upload.single("image"), async(req, res) => {
    const user = await modelData.findOne({ username: req.session.passport.user })

    user.profileImage = req.file.filename;
    await user.save()
    res.redirect("./profile")
})



// feed route into this we can see all the posts
router.get("/feed", isloggedIn, async(req, res) => {
    // const user = await modelData.findOne({ username: req.session.passport.user })
    const posts = await postData.find().populate('user')

    res.render("feed", { posts, nav: true });
})


// add post route 
router.post("/createpost", isloggedIn, upload.single("postimage"), async(req, res) => {
    try {
        const user = await modelData.findOne({ username: req.session.passport.user })
        const postResult = await postData.create({
                user: user._id,
                image: req.file.filename,
                title: req.body.title,
                description: req.body.des
            })
            // console.log(user)
            // console.log(postResult)

        user.posts.push(postResult._id)
        await user.save()

        return res.redirect("/profile")
    } catch (error) {
        return res.status(400).json({
            message: "Error creating post",
            error
        })
    }
})





// register
router.post('/register', function(req, res) {
    try {
        const payload = req.body;
        const data = new modelData({
            username: payload.username,
            email: payload.email,
            contact: payload.number,

        });

        modelData.register(data, req.body.password)
            .then(function() {
                passport.authenticate('local')(req, res, function() {
                    res.redirect('/');
                })
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    message: false,
                    error
                });
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            messgae: false,
            error
        });
    }
});


// login
router.post('/login', passport.authenticate("local", {
    failureRedirect: '/',
    successRedirect: '/profile' // Corrected redirect path
}), function(req, res) {})

// logout function code put from google passport logout code 
//logout 

router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });

})


//islogged
function isloggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}






module.exports = router;