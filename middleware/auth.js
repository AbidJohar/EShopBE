import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    try {
        const token = req.headers;

        console.log("token in auth:",token);
        

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized to access",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach userId to request object
        req.body.userId = decoded.id;

        next(); // Proceed to next middleware or controller
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

export default authUser;
