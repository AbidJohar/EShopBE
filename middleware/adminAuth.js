import jwt from 'jsonwebtoken';

const adminAuthMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const { token }= req.headers || req.headers['authorization']?.split(' ')[1]; // Bearer token
       
    // If there's no token, return an error
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized, please login '
        });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Check if the decoded token contains the admin email (or other identifying information)
        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Admins only'
            });
        }
        next();
    });
};

export default adminAuthMiddleware;