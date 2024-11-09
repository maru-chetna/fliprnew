const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 5;

const User = require("../model/user.js");

const JWT_SECRET = 'xyz1234VerySecureKeyThatIsHardToGuess9876';




const userSignup = async (req, res) => {
    try {
        let {ename:namee ,eemail:emaile, epassword:passworde,eaddress:addresse}=req.body;

        const existingUser = await User.findOne({ email: emaile });
        if (existingUser) {
            return res.status(400).send("Email is already registered. Please use a different email.");
        }


        const hashedPassword = await bcrypt.hash(passworde, 
            saltRounds);
    
        let user = new User({
            name:`${namee}`,
            email:`${emaile}`,
            password:`${hashedPassword}`,
            address:`${addresse}`, 
        });
        user.save().then(()=>{
            console.log(user);
        })
    
        let objId = user._id ;
        console.log(objId);
        res.send(`you are registerd with Id: ${objId}`);
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error code
            res.status(400).send("Email is already registered. Please use a different email.");
        } else {
            console.error("Error during registration:", error);
            res.status(500).send("An error occurred while registering. Please try again later.");
        }
    }
};


const userSignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password.");
        }

       
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Invalid email or password.");
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send the token back to the client
        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred while logging in. Please try again later.");
    }
};



module.exports = { userSignup, userSignin };