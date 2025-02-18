import jwt from "jsonwebtoken";

const authUser =  (req, res, next) => {
    try {
        const {token} = req.headers;

        // console.log("token in auth:",token);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized to access",
            });
        }
  
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded token:", decoded);
        } catch (error) {
            console.error("JWT Verification Failed:", error.message);
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        
        // Attach userId to request object
        req.body.userId = decoded.id;
        // console.log(req.body.userId);
        
        next(); // Proceed to next middleware or controller
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

export default authUser;
