import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';


// signup or register
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    const userExists = await User.findOne({email: email});

    if(userExists){
        res.status(400);
        throw new Error('user already exists');
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password
    })

    if(user){
        generateToken(res,user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }
    else{
        res.status(400);
        throw new Error('invalid user data');
    }
});


// login user
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401);
        throw new Error('invalid email or password');
    }
});

// logout user
const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{expires: new Date(0)});

    res.status(200).json({message: 'User logged out successfully'});
});

export {
    registerUser,
    authUser,
    logout
};

// get user details
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        name : req.user.name,
        email: req.user.email
    }
    res.status(200).json(user);
});


// update user details
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || req.name;
        user.email = req.body.email || req.email;
        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    }else{
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ message: 'Update User profile' });
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};