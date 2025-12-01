import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'polyspack_secret_key_2024', {
    expiresIn: '7d',
  });
};

// Register new user
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      password,
      accountType,
      agreeToMarketing,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone number already exists',
      });
    }

    // Validate phone number (Kenyan format)
    if (!/^(\+254|0)[17]\d{8}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Kenyan phone number',
      });
    }

    // Validate password strength
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      phone,
      company,
      passwordHash: hashedPassword,
      accountType,
      agreeToMarketing,
      role: 'customer',
      isVerified: false,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Send welcome email
    await sendWelcomeEmail(newUser);

    // Return user data (without password)
    const userResponse = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      company: newUser.company,
      accountType: newUser.accountType,
      role: newUser.role,
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Attempt for email:', email);

    // Validation
    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Get user with password
    console.log('[LOGIN] Querying for user...');
    let userWithPassword;
    try {
      userWithPassword = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
      console.log('[LOGIN] Query completed, user found:', !!userWithPassword);
    } catch (queryError) {
      console.error('[LOGIN] Query error:', queryError);
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: queryError.message
      });
    }
    
    if (!userWithPassword) {
      console.log('[LOGIN] User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('[LOGIN] User found, checking password');
    console.log('[LOGIN] Has passwordHash:', !!userWithPassword.passwordHash);
    console.log('[LOGIN] isActive:', userWithPassword.isActive);

    // Check password
    const isPasswordValid = await bcrypt.compare(password, userWithPassword.passwordHash);
    console.log('[LOGIN] Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!userWithPassword.isActive) {
      console.log('[LOGIN] Account is not active');
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Update last login
    userWithPassword.lastLogin = new Date();
    await userWithPassword.save();
    
    // Get user without password for response
    const user = await User.findById(userWithPassword._id);

    // Send login notification email (optional)
    try {
      await sendLoginNotificationEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Error sending login notification:', emailError);
      // Don't fail login if email fails
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      company: user.company,
      accountType: user.accountType,
      role: user.role,
      isVerified: user.isVerified,
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message,
    });
  }
};

// Forgot password - send reset code
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account exists with this email, a reset code has been sent',
      });
    }

    // Generate 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset code
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = resetCodeExpiry;
    await user.save();

    // Send reset code email
    await sendResetCodeEmail(user, resetCode);

    res.json({
      success: true,
      message: 'Password reset code sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset code. Please try again.',
      error: error.message,
    });
  }
};

// Verify reset code
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and verification code',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check code
    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Check expiry
    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    res.json({
      success: true,
      message: 'Code verified successfully',
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code. Please try again.',
      error: error.message,
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify code
    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Check expiry
    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired',
      });
    }

    // Validate new password
    if (newPassword.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    user.passwordHash = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    // Send confirmation email
    await sendPasswordChangedEmail(user);

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.',
      error: error.message,
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message,
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

// Helper: Send welcome email
async function sendWelcomeEmail(user) {
  const mailOptions = {
    from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Welcome to Polyspack Enterprises!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Polyspack!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Thank you for creating an account with Polyspack Enterprises. We're excited to have you join Kenya's leading plastic packaging supplier!</p>
            <p><strong>Your Account Details:</strong></p>
            <ul>
              <li>Email: ${user.email}</li>
              <li>Phone: ${user.phone}</li>
              ${user.company ? `<li>Company: ${user.company}</li>` : ''}
            </ul>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://polyspackenterprises.co.ke'}/dashboard" class="button">Go to Dashboard</a>
            </p>
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Browse our extensive product catalog</li>
              <li>Request custom solutions for your needs</li>
              <li>Get instant quotes on bulk orders</li>
              <li>Track your orders in real-time</li>
            </ul>
          </div>
          <div class="footer">
            <p><strong>Polyspack Enterprises</strong><br>Kenya's Leading Rigid Plastic Packaging Manufacturer</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

// Helper: Send reset code email
async function sendResetCodeEmail(user, resetCode) {
  const mailOptions = {
    from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Code - Polyspack',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .code-box { background: white; padding: 20px; border: 2px dashed #2563eb; border-radius: 8px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Code</h1>
          </div>
          <div class="content">
            <p>Dear ${user.firstName},</p>
            <p>We received a request to reset your password. Use the code below to reset your password:</p>
            <div class="code-box">
              <div class="code">${resetCode}</div>
            </div>
            <p><strong>This code will expire in 15 minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
            <p>For security reasons, never share this code with anyone.</p>
          </div>
          <div class="footer">
            <p>Polyspack Enterprises<br>Need help? Contact us at sales@polyspackenterprises.co.ke</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset code email sent successfully');
  } catch (error) {
    console.error('Error sending reset code email:', error);
  }
}

// Helper: Send password changed email
async function sendPasswordChangedEmail(user) {
  const mailOptions = {
    from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Changed Successfully - Polyspack',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Password Changed</h1>
          </div>
          <div class="content">
            <p>Dear ${user.firstName},</p>
            <p>Your password has been successfully changed.</p>
            <p>If you made this change, no further action is needed.</p>
            <p>If you did NOT make this change, please contact us immediately at sales@polyspackenterprises.co.ke or call +254 742 312306.</p>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://polyspackenterprises.co.ke'}/auth/login" class="button">Sign In Now</a>
            </p>
          </div>
          <div class="footer">
            <p>Polyspack Enterprises<br>Kenya's Leading Plastic Packaging Supplier</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password changed email sent successfully');
  } catch (error) {
    console.error('Error sending password changed email:', error);
  }
}

// Helper: Send login notification email
async function sendLoginNotificationEmail(email, firstName) {
  const loginTime = new Date().toLocaleString('en-KE', { 
    timeZone: 'Africa/Nairobi',
    dateStyle: 'full',
    timeStyle: 'long'
  });

  const mailOptions = {
    from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'New Login to Your Account - Polyspack',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .info-box { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome Back!</h1>
          </div>
          <div class="content">
            <p>Hello ${firstName},</p>
            <p>We noticed a successful login to your Polyspack account.</p>
            <div class="info-box">
              <p><strong>Login Details:</strong></p>
              <p>Time: ${loginTime}</p>
            </div>
            <p>If this was you, you can safely ignore this email.</p>
            <p>If you didn't log in, please contact us immediately at:</p>
            <ul>
              <li>Email: sales@polyspackenterprises.co.ke</li>
              <li>Phone: +254 742 312306</li>
              <li>WhatsApp: <a href="https://wa.me/254742312306">+254 742 312306</a></li>
            </ul>
          </div>
          <div class="footer">
            <p><strong>Polyspack Enterprises</strong><br>Kenya's Leading Rigid Plastic Packaging Manufacturer</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Login notification email sent successfully');
  } catch (error) {
    console.error('Error sending login notification email:', error);
    throw error;
  }
}
