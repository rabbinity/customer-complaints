
import { prisma } from "../../config/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { hash, compare } from "bcrypt";
import { sendMail } from "../../utils/mail";
import { generateOTP } from "../../utils/otp";
import dotenv from "dotenv";
dotenv.config();

import { VerifyEmailAndOTPRequest } from '../../types/interface'







export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(StatusCodes.FORBIDDEN).json("User already exists");
    }

    const hashedPassword = await hash(password, 10);
    const verificationToken = generateOTP(); // Using the same OTP generator

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        emailVerificationToken: verificationToken,
        isEmailVerified: false,
      },
    });

    const emailOptions = {
      to: user.email,
      subject: "Welcome to Management - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; 
                    background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
          <div style="text-align: center; padding-bottom: 15px;">
            <h2 style="color: #2a9d8f; margin: 0;">Welcome to Management!</h2>
            <p style="color: #555; font-size: 15px; margin-top: 5px;">
              We're thrilled to have you on board. To get started, please verify your email address below.
            </p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${user.username},</p>
            <p style="color: #555; font-size: 15px;">Thank you for registering with us. We're excited to have you join our community.</p>
            <p style="color: #555; font-size: 15px;">Please verify your email by using the following code:</p>
            <div style="text-align: center; font-size: 18px; font-weight: bold; 
                        color: #264653; padding: 10px; background: #e0f2f1; 
                        border-radius: 5px; margin: 15px auto; max-width: 200px;">
              ${verificationToken}
            </div>
            <p style="color: #555; font-size: 15px;">Or click on this link to verify your email:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="https://inventory-management-smoky-nu.vercel.app//verify/email/${verificationToken}" 
                 style="background-color: #2a9d8f; color: white; text-decoration: none; padding: 10px 20px; 
                        font-size: 16px; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </p>
          </div>
          <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
            Best regards, <br><strong style="color: #2a9d8f;">Management Team</strong>
          </p>
        </div>
      `,
    };
    
    await sendMail(emailOptions);
    
    await sendMail(emailOptions);

    if (role === "ADMIN") {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          group: user.id,
        },
      });
    }

    return res.status(StatusCodes.OK).json({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      message: "Registration successful. Please verify your email."
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to register user",
      error: error?.stack || error?.message || error,
    });
  }
};





export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }

    const verifyPassword = await compare(password, user.password);

    if (!verifyPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Invalid Password");
    }

    // Optionally, check if email is verified
    if (!user.isEmailVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Email not verified. Please verify your email before logging in.",
        needsVerification: true
      });
    } 

    // Return user details including all relevant data
    return res.status(StatusCodes.OK).json({
      userId: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      group: user.group,
      bloodGroup: user.bloodGroup,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      emergencyContact: user.emergencyContact,
      isEmailVerified: user.isEmailVerified
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to authenticate user",
      error: error?.stack || error?.message || error,
    });
  }
};






export const userForgotPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }

    const otp = generateOTP(); // Generate OTP here

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: otp,
      },
    });

    // Send OTP to user through your preferred method (e.g., email or SMS)
    // Example email sending code:
    const emailOptions = {
      to: user.email,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; 
                    background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
          <div style="text-align: center; padding-bottom: 15px;">
            <h2 style="color: #2a9d8f; margin: 0;">Password Reset Request</h2>
            <p style="color: #555; font-size: 15px; margin-top: 5px;">
              You have requested to reset your password. Use the OTP below to proceed.
            </p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${updatedUser.username},</p>
            <p style="color: #555; font-size: 15px;">Your OTP for password reset is:</p>
            <div style="text-align: center; font-size: 18px; font-weight: bold; 
                        color: #264653; padding: 10px; background: #e0f2f1; 
                        border-radius: 5px; margin: 15px auto; max-width: 200px;">
              ${otp}
            </div>
            <p style="color: #555; font-size: 15px;">If you did not request this, please ignore this message.</p>
            <p style="color: #555; font-size: 15px;">Use this link to update your password or use the matero:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href=""https://inventory-management-smoky-nu.vercel.app/update/password" 
                 style="background-color: #2a9d8f; color: white; text-decoration: none; padding: 10px 20px; 
                        font-size: 16px; border-radius: 5px; display: inline-block;">
                Update Password
              </a>
            </p>
          </div>
          <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
            Best regards, <br><strong style="color: #2a9d8f;">Management Team</strong>
          </p>
        </div>
      `,
    };
    
    await sendMail(emailOptions);
    

  

    return res
      .status(StatusCodes.OK)
      .json("OTP sent to your email account for password reset");
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to send OTP for password reset",
      error: error?.stack || error?.message || error,
    });
  }
};






export const verifyEmailAndOTP = async (req: Request, res: Response) => {
  try {
    const { otp, email, password } = req.body as VerifyEmailAndOTPRequest;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json("Invalid email");
    }

    // Verify OTP
    if (user.token !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json("Invalid OTP");
    }

    // Clear the OTP after successful verification
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
    });

    // Update the password
    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Send email notification
    const emailOptions = {
      to: user.email,
      subject: "Password Reset Successful",
      html: `<p>Dear ${user.username},</p>
              <p>Your password has been successfully reset.</p>
              <p>If you did not perform this action, please contact support immediately.</p>
             
              <p>Best regards,<br>management Team</p>`,
    };

    await sendMail(emailOptions);

    return res.status(StatusCodes.OK).json("Password updated successfully");
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to verify email and OTP or update password",
      error: error?.stack || error?.message || error,
    });
  }
};

    
export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { 
      userId, 
      username, 
      email, 
      phoneNumber, 
      bloodGroup, 
      address, 
      dateOfBirth, 
      gender, 
      emergencyContact,
      role,               // added
      isEmailVerified     // added
    } = req.body;

    // Use the userId from the request body
    const id = userId;
    console.log("Request Body:", req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }

    // Prepare update data with fields that can be updated
    let updateData: any = {
      username,
      phoneNumber,
      bloodGroup,
      address,
      gender,
      emergencyContact,
    };

    // Include role if provided
    if (role) {
      updateData.role = role;
    }

    // Include isEmailVerified if provided and email is not changing
    if (isEmailVerified !== undefined && email === existingUser.email) {
      updateData.isEmailVerified = isEmailVerified;
    }

    // Handle date of birth if provided
    if (dateOfBirth) {
      updateData.dateOfBirth = new Date(dateOfBirth);
    }

    // If the email is changing, update email, reset verification and send verification email
    if (email && email !== existingUser.email) {
      const verificationToken = generateOTP();
      updateData.email = email;
      updateData.isEmailVerified = false;
      updateData.emailVerificationToken = verificationToken;
      
      // Send verification email for the new email address
      const emailOptions = {
        to: email,
        subject: "Verify Your New Email Address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; 
                      background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
            <div style="text-align: center; padding-bottom: 15px;">
              <h2 style="color: #2a9d8f; margin: 0;">Welcome to Our Community!</h2>
              <p style="color: #555; font-size: 15px; margin-top: 5px;">
                We're excited to have you on board. To fully access our features, please verify your new email address below.
              </p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="color: #333; font-size: 16px;">Dear ${username || existingUser.username},</p>
              <p style="color: #555; font-size: 15px;">Please verify your new email address by using the following code:</p>
              <div style="text-align: center; font-size: 18px; font-weight: bold; 
                          color: #264653; padding: 10px; background: #e0f2f1; 
                          border-radius: 5px; margin: 15px auto; max-width: 200px;">
                ${verificationToken}
              </div>
              <p style="color: #555; font-size: 15px;">Or click on this link to verify your email:</p>
              <p style="text-align: center; margin: 20px 0;">
                <a href="https://inventory-management-smoky-nu.vercel.app/verify/email/${verificationToken}" 
                   style="background-color: #2a9d8f; color: white; text-decoration: none; padding: 10px 20px; 
                          font-size: 16px; border-radius: 5px; display: inline-block;">
                  Verify Email
                </a>
              </p>
              <p style="color: #555; font-size: 15px;">If you did not request this change, please contact support immediately.</p>
            </div>
            <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
              Best regards, <br><strong style="color: #2a9d8f;">Management Team</strong>
            </p>
          </div>
        `,
      };
      await sendMail(emailOptions);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    // Send an email notification after the profile update
    const notificationEmailOptions = {
      to: updatedUser.email,
      subject: "Profile Updated",
      html: `<p>Dear ${updatedUser.username},</p>
             <p>Your profile has been successfully updated.</p>
             ${email && email !== existingUser.email ? 
               "<p>Please note that you need to verify your new email address.</p>" : ""}
             <p>Thank you for keeping your information up-to-date.</p>
             <p>Best regards,<br>Management Team</p>`,
    };
    await sendMail(notificationEmailOptions);

    // Return only the non-sensitive user fields
    const userResponse = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      bloodGroup: updatedUser.bloodGroup,
      address: updatedUser.address,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      emergencyContact: updatedUser.emergencyContact,
      isEmailVerified: updatedUser.isEmailVerified,
      role: updatedUser.role,
    };

    return res.status(StatusCodes.OK).json({
      user: userResponse,
      message: email && email !== existingUser.email ? 
        "Profile updated. Please verify your new email address." : 
        "Profile updated successfully.",
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update user profile",
      error: error?.stack || error?.message || error,
    });
  }
};


export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }

    if (user.emailVerificationToken !== token) {
      return res.status(StatusCodes.BAD_REQUEST).json("Invalid verification token");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    const emailOptions = {
      to: user.email,
      subject: "Email Verification Successful 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; 
                    background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
          <div style="text-align: center; padding-bottom: 15px;">
            <h2 style="color: #2a9d8f; margin: 0;">🎉 Email Verification Successful!</h2>
            <p style="color: #555; font-size: 15px; margin-top: 5px;">
              Welcome aboard! Your email has been successfully verified.
            </p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${user.username},</p>
            <p style="color: #555; font-size: 15px;">Your email has been successfully verified. Thank you!</p>
            <p style="color: #555; font-size: 15px;">You can now access all the features of our application.</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="https://apllications-server4.vercel.app" 
                 style="background-color: #2a9d8f; color: white; text-decoration: none; padding: 10px 20px; 
                        font-size: 16px; border-radius: 5px; display: inline-block;">
                Go to Dashboard
              </a>
            </p>
          </div>
          <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
            Best regards, <br><strong style="color: #2a9d8f;">Management Team</strong>
          </p>
        </div>
      `,
    };
    
    await sendMail(emailOptions);
    

    return res.status(StatusCodes.OK).json("Email verified successfully");
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to verify email",
      error: error?.stack || error?.message || error,
    });
  }
};




export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    // Optional query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get users with selected fields only
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isEmailVerified: true,
        role: true,
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count();
    
    return res.status(StatusCodes.OK).json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to retrieve users",
      error: error?.stack || error?.message || error,
    });
  }
};


export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Retrieve the userId from the request parameters
    
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }

    // Delete the user from the database
    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    // Optionally, send a confirmation email to the deleted user
    const emailOptions = {
      to: existingUser.email,
      subject: "Account Deletion Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; 
                    background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
          <div style="text-align: center; padding-bottom: 15px;">
            <h2 style="color: #2a9d8f; margin: 0;">Account Deletion Confirmation</h2>
            <p style="color: #555; font-size: 15px; margin-top: 5px;">
              Your account has been successfully deleted.
            </p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${existingUser.username},</p>
            <p style="color: #555; font-size: 15px;">Your account has been deleted from our system.</p>
            <p style="color: #555; font-size: 15px;">If you believe this was a mistake, please contact support immediately.</p>
          </div>
          <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
            Best regards, <br><strong style="color: #2a9d8f;">Management Team</strong>
          </p>
        </div>
      `,
    };

    await sendMail(emailOptions);

    return res.status(StatusCodes.OK).json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete user",
      error: error?.stack || error?.message || error,
    });
  }
};
