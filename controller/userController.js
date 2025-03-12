import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import validator from 'validator';
import jwt from 'jsonwebtoken';
// import axios from "axios";
// import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

 

const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required fields.',
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  // Validate password strength
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Password must be at least 8 characters long, with at least one lowercase letter, one uppercase letter, one number, and one special character.',
  //   });
  // }

  if (password.length < 8 || password.length > 12) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 8 and 12 characters"
    });
  }

  // Check if the user already exists
  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists.',
    });
  }
   
  

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
     
    const hashPassword = await bcrypt.hash(password, salt);
     
    
    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    });

    // Save the user
    const user = await newUser.save();

    // Respond with success
    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};



const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist.",
      });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);
    if (!isMatchPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
const adminLogin =  async (req,res)=>{

  const {email,password} = req.body;

  if(email.trim() === process.env.ADMIN_EMAIL && password.trim() === process.env.ADMIN_PASSWORD){
   const token = jwt.sign(email+password, process.env.JWT_SECRET);
   return res.json({
    success: true,
    message: "Admin successfully login",
    token: token
   })

  } 
return res.json({
  success:false,
  message: "incorrect credientials"
})
}

const googleLogin = async (req, res) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

console.log("goole redirect uri:",process.env.GOOGLE_REDIRECT_URI);


  try {
    const { code } = req.body;
    console.log("Received Code:", code);

    // Exchange authorization code for access token
    // const { tokens } = await client.getToken(code, {
    //   redirect_uri: process.env.GOOGLE_REDIRECT_URI
    // }); 
    
    const { tokens } = await client.getToken(code); 
    console.log("google tokens:",tokens);
    
    const ticket =  client.verifyIdToken({
      idToken: tokens.id_token, // Fix: Use tokens.id_token instead of 'token'
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("Google response:", ticket);

    const { email, name } = ticket.getPayload(); // Extract user info

    let user = await userModel.findOne({ email });

    if (!user) {
      // Register new Google user
      user = new userModel({
        name,
        email,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({
      success: true,
      message: "Google login successful.",
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed.",
    });
  }
};


 


 
export {userLogin,userRegistration,adminLogin,googleLogin};

