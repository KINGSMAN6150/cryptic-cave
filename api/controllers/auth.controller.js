const User = require('../models/user.model'); 
const bcrypt = require('bcryptjs'); //chavikant web tokens dalne hai to dekh lena
const jwt = require('jsonwebtoken');

//bhai tune username diya hai vanha kya fill karenge 
//email ke piche mit laga ho uske liye loop dalun??


exports.signup = async (req, res) => {
    try {
      const { username, email, password, yearOfGraduation, program } = req.body;
  
      if (!username || !email || !password || !yearOfGraduation || !program) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        yearOfGraduation,
        program
      });
      //agar tereko defination chahiyeh toh bata dena aage se comment kar dunga

      await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',//yeh new function hai mere liye bhi and it gives token which expiers in time
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
//isme kuch aur change karna hai toh bata dena sir && good night .