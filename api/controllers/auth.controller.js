import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();

        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {    
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });

        console.log(validUser);

        if (!validUser) {
            return next(errorHandler(404, 'User not found!'));
        };

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(401, 'Wrong password or email!'));
        };

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        
        res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);

    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = generateRandomPassword();
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const username = name.trim();

      user = new User({
        username,
        email,
        password: hashedPassword,
        avatar: photo,
      });

      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, ...userData } = user._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

// Генерація випадкового пароля
const generateRandomPassword = () => (
  [...Array(2)].map(() =>
    Math.random().toString(36).substring(2, 10)
  ).join('')
);
