const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://Vikash:Vikash@cluster0.ar4ypao.mongodb.net/", {
    useNewurlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb", err);
  });



const User = require("./models/user");
const Order = require("./models/order");

// Function to send the verification Email to the user
const sendVerificationEmail = async (email, verificationToken) => {
  // creat a nodemailer transport
  const transporter = nodemailer.createTransport({
    // configure the email address
    service: "gmail",
    auth: {
      user: "vraj67207@gmail.com",
      pass: "rpam bjtd oudl gbbv",
    },
  });
  // compose the email message
  const mailOption = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: 'Please click the following link to verifiy your email :http://localhost:8000/verify/${verificationToken}',
  };
//   send the email
    try{
        await transporter.sendMail(mailOption);
    }catch(error){
        console.log("Error sending the verification email", error);
    }

};

// endpoint to register in the app
app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;
    // check if the email is already register

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is Already register" });
    }

    // Creat a new user
    const newUser = new User({ name, email, password });

    // grenerat and dstore the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // save the data base to new user data
    await newUser.save();

    // send Verification to the USer
    sendVerificationEmail(newUser.email, newUser.verificationToken);
  } catch (error) {
    console.log("error registering User", error);
    res.status(500).json({ message: "Registration failed" });
  }
});


// endpoint to verifiy the email

app.get("/verify/:token" , async(req, res)=>{
    try{
        const token = req.params.token;
        // find the user with the given verification token
 const user = await User.findOne({verificationToken:token});
        if(!user){
            return res.status(404).json({message:"Invalid verification token"});
        }

        // MArk the user as verified
        user.verified= true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({message:"Email verified successfully"});
    }catch(error){
        res.status(500).json({message:"Email verification is failed"});
    }
})
app.listen(port, () => {
  console.log("Server is running on port 8000");
});

// 
app.post("/login",async(req,res) =>{
  try{

  }catch(error){
    res.status(500).json({message:"Login Failed"});
  }
})
