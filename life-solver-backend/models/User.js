/**
 * User Model
 * Handles user data structure and authentication methods
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// If MongoDB is available, use Mongoose
let User;

try {
  if (process.env.MONGODB_URI) {
    const mongoose = require('mongoose');
    
    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('📦 MongoDB Connected');
    }).catch(err => {
      console.log('❌ MongoDB Connection Failed:', err.message);
    });

    const userSchema = new mongoose.Schema({
      name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
      },
      email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email'
        ]
      },
      password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    // Encrypt password using bcrypt
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) {
        next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    // Sign JWT and return
    userSchema.methods.getSignedJwtToken = function() {
      return jwt.sign(
        { id: this._id, email: this.email, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
    };

    // Match user entered password to hashed password in database
    userSchema.methods.matchPassword = async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };

    User = mongoose.model('User', userSchema);
  }
} catch (error) {
  console.log('⚠️  MongoDB not available, using JSON storage for users');
}

// Fallback: JSON file storage for users (if no MongoDB)
if (!User) {
  const fs = require('fs');
  const path = require('path');
  
  const usersFile = path.join(__dirname, '../data/users.json');
  
  // Ensure data directory exists
  const dataDir = path.dirname(usersFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Initialize users file if it doesn't exist
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }

  User = {
    // Find user by email
    findOne: async (query) => {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      return users.find(user => user.email === query.email);
    },

    // Find user by ID
    findById: async (id) => {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      return users.find(user => user.id === id);
    },

    // Create new user
    create: async (userData) => {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return {
        ...userWithoutPassword,
        getSignedJwtToken: function() {
          return jwt.sign(
            { id: this.id, email: this.email, name: this.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
          );
        },
        matchPassword: async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, newUser.password);
        }
      };
    }
  };
}

module.exports = User;