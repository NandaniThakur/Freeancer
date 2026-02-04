// authenticate token
import jwt from 'jsonwebtoken'; 
export const authenticateToken = (req, res, next) =>  {
    try{
        const token = req.cookies.token;
        if (!token) { 
            return res.status(401).json({ message: 'Access token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid access token', error: err.message });
    }
};

// authorized role
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {   
            return res.status(403).json({
                message: 'Forbidden: You do not have the required role',
                requiredRoles: roles,
                yourRole: req.user?.role || 'none'
             });
        }
        next();
    };
};
