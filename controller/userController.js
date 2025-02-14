import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
 

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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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

export {userLogin,userRegistration,adminLogin};

