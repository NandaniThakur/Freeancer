import {User} from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {
    try {   
        console.log("signup Request received:", req.body);

        const { fullname, email, password, confirmPassword, role } = req.body;
        
        // Validate required fields
        if (!fullname || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }  
        
        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Validate role if provided
        const validRoles = ['user', 'client'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role specified." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }   

        // Create new user with specified role or default to 'user'
        const userData = { 
            fullname, 
            email, 
            password, 
            role: role || 'user'
        };
        
        const user = await User.create(userData);

        res.status(201).json({ 
            message: "User registered successfully.",
            user: { 
                id: user._id, 
                fullname: user.fullname,  
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ 
            message: "Server error during signup.",
            error: error.message 
        });
    }       
};




//login controller
export const logIn = async (req, res) => {
    try {   
        console.log("login Request received:", req.body);   
        const { email, password } = req.body;

        //validate required fielsds
        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required." });
        }   
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }   
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }



        // advance login logic

        //  const user=await User.findOne({email:req.body.email});
        // if(!user){
        //     return res.status(404).json({message:"User not found"});
        // }
        // const isPasswordValid=await bcrypt.compare(req.body.password,user.password);
        // if(!isPasswordValid){
        //     return res.status(401).json({message:"Invalid password"});
        // }

        // Create JWT token with user ID and role
        const token= jwt.sign(
            {userId:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'strict',
            maxAge:3600000 // 1 hour
        });


        // Set different session times based on role


        // Successful login
        res.status(200).json({ message: "Login successful.",
            user: { 
                id: user._id,       
                fullname: user.fullname,  
                email: user.email,
                role: user.role
            }
         });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error during login.", error: error.message });
    }   
};

// logout controller
export const logOut = (req, res) => {
    try {   
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Server error during logout.", error: error.message });
    }   
};


// controller for refreshing jwt token Without user intervention again and again and also for security - this will be running i the background without user intervention

// export const refreshToken = (req, res) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(401).json({ message: "No token provided." });
//         }
//         // Verify existing token
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {  
//                 return res.status(401).json({ message: "Invalid token." });
//             }
//             // Create new token
//             const newToken = jwt.sign(
//                 { userId: decoded.userId, role: decoded.role },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '1h' } 
//             );
//             res.cookie('token', newToken, {
//                 httpOnly: true, 
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: 'strict',
//                 maxAge: 3600000 
//             });
//             res.status(200).json({ message: "Token refreshed successfully." });
//         }
//         );
//     } catch (error) {
//         console.error("Error during token refresh:", error);
//         res.status(500).json({ message: "Server error during token refresh.", error: error.message });
//     }
// };


// controller refreshing the token (since in mvp user can stay loggd in for like 5-6 hours and i dont want to make it unsecure by long token life so this will refresh the token in background)
export const refreshToken = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }   
        // Verify existing token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token." });
            }
            // Create new token
            const newToken = jwt.sign(
                { userId: decoded.userId, role: decoded.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } // New token valid for 1 hour
            );  
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  
                sameSite: 'strict',
                maxAge: 3600000 // 1 hour
            }); 
            res.status(200).json({ message: "Token refreshed successfully." });
        }
        );
    } catch (error) {
        console.error("Error during token refresh:", error);
        res.status(500).json({ message: "Server error during token refresh.", error: error.message });
    }   
};