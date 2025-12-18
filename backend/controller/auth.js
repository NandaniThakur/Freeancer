import 
{User} from '../models/User.js';

export const signUp = async (req, res) => {
    try {   
        console.log("signup Request received:", req.body);

        const { fullname, email, password, confirmPassword, role } = req.body;
        //validate required fielsds
        if(!fullname || !email || !password || !confirmPassword){
            return res.status(400).json({ message: "All fields are required." });
        }  
        
        // valiate password match
        if(password !== confirmPassword){
            return res.status(400).json({ message: "Passwords do not match." });
        }

        //validat role if provided
        const validRoles = ['user', 'client'];
        if(role && !validRoles.includes(role)){
            return res.status(400).json({ message: "Invalid role specified." });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }   

        // Create new user

        //create user with specified role or default user schema to 'user'
        const userData = { fullname, email, password, confirmPassword, role } : { fullname, email, password, confirmPassword };
        
        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error during signup.",error: error.message });
    }       
};