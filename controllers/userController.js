const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = require('../models/userModel')
const emailSender = require('../services/emailService')
const userLogger = require('../utils/userLogger/userLogger')

module.exports = {
    createUser: async (req, res) => {
        const salt = await bcrypt.genSalt(10)
        try {
            const isUserExist = await userSchema.findOne({
                userEmail: req.body.userEmail
            })
            if (isUserExist) {
                userLogger.log('error', "User already exists with this email")
                res.status(401).send({
                    success: false,
                    message: 'User already exists with this email',
                });
            }
            else {
                const userData = new userSchema(req.body)
                userData.userPassword = await bcrypt.hash(req.body.userPassword, salt)
                userData.userProfilePic = (userData.userGender === 'male') ?
                    'D:/My Space/Node Projects/Expense Tracker/uploads/avatars/maleAvatar.jpg' :
                    'D:/My Space/Node Projects/Expense Tracker/uploads/avatars/femaleAvatar.png';
                userData.usedPasswords.push(userData.userPassword);
                const savedData = await userData.save();
                emailSender.mailOptions(userData.userEmail);
                userLogger.log('info', "User account is created!")
                res.status(201).json({
                    success: true,
                    message: 'Your account is created!',
                    user: savedData,
                });
            }
        }
        catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    userLogin: async (req, res) => {
        try {
            const { userPassword, userEmail } = req.body;
            const userData = await userSchema.findOne({
                userEmail: userEmail
            });
            if (userData) {
                const checkPassword = await bcrypt.compare(userPassword, userData.userPassword);
                if (checkPassword) {
                    const accessToken = jwt.sign({ userData }, process.env.SECRET_KEY, {
                        expiresIn: "1h",
                    });
                    userLogger.log('info', "User login success!")
                    res.status(200).send({
                        success: true,
                        message: "User login success!",
                        token: accessToken
                    });
                } else {
                    userLogger.log('error', "Email or Password is incorrect")
                    res.status(401).send({
                        success: false,
                        message: "Email or Password is incorrect"
                    });
                }
            } else {
                userLogger.log('error', "User email not found")
                res.status(404).send({
                    success: false,
                    message: "User email not found"
                });
            }
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },
    forgetPassword: async (req, res) => {
        try {
            const { userEmail } = req.body;
            const userData = await userSchema.findOne({
                userEmail: userEmail
            });
            if (userData) {
                const accessToken = jwt.sign({ userData }, process.env.SECRET_KEY, {
                    expiresIn: "1h",
                });
                const link = `https://expenseTraker/user/forgetPassword/${userData._id}/${accessToken}`;
                emailSender.mailOptions(userData.userEmail, 1, link);
                userLogger.log('info', "Email has been send")
                res.status(200).send({
                    success: true,
                    message: "Email has been send",
                    userId: userData._id,
                    accessToken: accessToken
                });
            } else {
                userLogger.log('error', "User email not found")
                res.status(404).send({
                    success: false,
                    message: "User email not found"
                });
            }
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    resetPassword: async (req, res) => {
        let isPasswordExist = false
        try {
            const salt = await bcrypt.genSalt(10)
            const { newPassword, confirmPassword } = req.body
            const { userId, token } = req.params
            const isTokenCorrect = jwt.verify(token, process.env.SECRET_KEY);
            if (isTokenCorrect) {
                if (newPassword === confirmPassword) {
                    const userData = await userSchema.findById(userId)
                    for (const oldPassword of userData.usedPasswords) {
                        if (await bcrypt.compare(newPassword, oldPassword)) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    if (isPasswordExist) {
                        userLogger.log('error', "Don't use old passwords, try another password")
                        return res.status(401).json({
                            success: false,
                            message: "Don't use old passwords, try another password",
                        });
                    }
                    const bcryptPassword = await bcrypt.hash(newPassword, salt)
                    userData.userPassword = bcryptPassword
                    userData.usedPasswords.push(bcryptPassword)
                    emailSender.mailOptions(userData.userEmail, 2)
                    await userData.save();
                    userLogger.log('info', "Password Updated")
                    res.status(201).json({
                        success: true,
                        message: "Password Updated",
                    });
                } else {
                    userLogger.log('error', "New password or confirm password is incorrect")
                    res.status(401).send({
                        success: false,
                        message: "New password or confirm password is incorrect"
                    })
                }
            } else {
                userLogger.log('error', 'Token is incorrect or expire')
                res.status(401).send({
                    success: false,
                    message: "Token is incorrect or expire"
                })
            }
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    setNewPassword: async (req, res) => {
        try {
            let isPasswordExist = false;
            const { userId } = req.params;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const userData = await userSchema.findById(userId);
            const checkPassword = await bcrypt.compare(oldPassword, userData.userPassword);
            if (checkPassword) {
                if (confirmPassword === newPassword) {
                    for (const usedPassword of userData.usedPasswords) {
                        if (usedPassword === newPassword) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    if (isPasswordExist) {
                        userLogger.log('error', "This password you already used in the past")
                        return res.status(401).json({
                            success: false,
                            message: "This password you already used in the past",
                        });
                    } else {
                        const salt = await bcrypt.genSalt(10);
                        const bcryptPassword = await bcrypt.hash(newPassword, salt);
                        userData.userPassword = bcryptPassword;
                        userData.usedPasswords.push(newPassword);
                        emailSender.mailOptions(userData.userEmail, 2)
                        await userData.save();
                        userLogger.log('info', "Your Password is updated!")
                        res.status(200).json({
                            success: true,
                            message: "Your Password is updated!",
                        });
                    }
                } else {
                    userLogger.log('error', "New password and Confirm password do not match")
                    res.status(401).json({
                        success: false,
                        message: "New password and Confirm password do not match",
                    });
                }
            } else {
                userLogger.log('error', "Old Password is incorrect")
                res.status(401).json({
                    success: false,
                    message: "Old password is incorrect",
                });
            }
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    }
}
