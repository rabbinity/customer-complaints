import { Request, Response, Router } from "express";
import { prisma } from "../../config/db";
import { StatusCodes } from "http-status-codes";
import { sendMail } from "../../utils/mail";

// Initialize router
const router = Router();

/**
 * Create a new complaint.
 * Optionally, a product name can be appended to the subject.
 * Also accepts an optional "image" string.
 */
const createComplaint = async (req: Request, res: Response) => {
  try {
    const { userId, subject, description, productName, image } = req.body;
    const finalSubject = productName ? `${subject} - Product: ${productName}` : subject;

    const complaint = await prisma.complaint.create({
      data: {
        userId,
        subject: finalSubject,
        description,
        image, // optional image field
      },
    });

    // Optionally, send an email confirming complaint creation.
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      const emailOptions = {
        to: user.email,
        subject: "Complaint Received",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
                      background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
            <div style="text-align: center; padding-bottom: 15px;">
              <h2 style="color: #2a9d8f; margin: 0;">Complaint Received</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="color: #333; font-size: 16px;">Dear ${user.username},</p>
              <p style="color: #555; font-size: 15px;">We have received your complaint with the subject:</p>
              <p style="font-weight: bold; text-align: center;">${finalSubject}</p>
              <p style="color: #555; font-size: 15px;">Our team will review it and update you soon.</p>
            </div>
            <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
              Best regards,<br><strong style="color: #2a9d8f;">Management Team</strong>
            </p>
          </div>
        `,
      };
      await sendMail(emailOptions);
    }

    return res.status(StatusCodes.CREATED).json(complaint);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error creating complaint" });
  }
};

/**
 * Get all complaints along with their follow-up notes.
 * For regular users, the client can filter by userId.
 */
const getAllComplaints = async (_req: Request, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { followUps: true },
    });
    return res.status(StatusCodes.OK).json(complaints);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching complaints" });
  }
};

/**
 * Assign a follow-up agent to the complaint and record the initial review note.
 * The assigned user (agent) is identified by reviewerUserId.
 * Sends an email to the complainer informing that the complaint is under review.
 */
const assignComplaint = async (req: Request, res: Response) => {
  try {
    const complaintId = parseInt(req.params.id);
    const { reviewerName, reviewerUserId } = req.body;

    // Update complaint to assign follow-up agent and change status to IN_PROGRESS.
    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        assignedToId: reviewerUserId,
        status: "IN_PROGRESS",
      },
    });

    // Create an initial follow-up note for assignment.
    await prisma.followUp.create({
      data: {
        complaintId,
        userId: reviewerUserId,
        message: `Complaint assigned to reviewer ${reviewerName}.`,
      },
    });

    // Notify the complainer via email.
    const complaintUser = await prisma.user.findUnique({ where: { id: complaint.userId } });
    if (complaintUser?.email) {
      const emailOptions = {
        to: complaintUser.email,
        subject: "Your Complaint is Under Review",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
                      background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
            <div style="text-align: center; padding-bottom: 15px;">
              <h2 style="color: #2a9d8f; margin: 0;">Complaint Under Review</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="color: #333; font-size: 16px;">Dear ${complaintUser.username},</p>
              <p style="color: #555; font-size: 15px;">Your complaint is now under review by our team.</p>
              <p style="color: #555; font-size: 15px;">Reviewer: <strong>${reviewerName}</strong></p>
            </div>
            <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
              Best regards,<br><strong style="color: #2a9d8f;">Management Team</strong>
            </p>
          </div>
        `,
      };
      await sendMail(emailOptions);
    }

    return res.status(StatusCodes.OK).json({ message: "Complaint assigned and under review", complaint });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error assigning complaint" });
  }
};

/**
 * Add a follow-up note on a complaint.
 * This endpoint allows the assigned follow-up agent to add notes at each stage.
 * It sends an email notification to the complainer with the new note.
 */
const addFollowUpNote = async (req: Request, res: Response) => {
  try {
    const complaintId = parseInt(req.params.id);
    const { reviewerUserId, note } = req.body;

    // Create a new follow-up note.
    const followUp = await prisma.followUp.create({
      data: {
        complaintId,
        userId: reviewerUserId,
        message: note,
      },
    });

    // Get complaint and complainer info.
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Complaint not found" });
    }

    const complaintUser = await prisma.user.findUnique({ where: { id: complaint.userId } });
    if (complaintUser?.email) {
      const emailOptions = {
        to: complaintUser.email,
        subject: "Update on Your Complaint",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
                      background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
            <div style="text-align: center; padding-bottom: 15px;">
              <h2 style="color: #2a9d8f; margin: 0;">Complaint Update</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="color: #333; font-size: 16px;">Dear ${complaintUser.username},</p>
              <p style="color: #555; font-size: 15px;">There is a new update on your complaint:</p>
              <blockquote style="border-left: 4px solid #2a9d8f; margin: 10px 0; padding-left: 10px;">
                ${note}
              </blockquote>
            </div>
            <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
              Best regards,<br><strong style="color: #2a9d8f;">Management Team</strong>
            </p>
          </div>
        `,
      };
      await sendMail(emailOptions);
    }

    return res.status(StatusCodes.OK).json({ message: "Follow-up note added", followUp });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error adding follow-up note" });
  }
};

/**
 * Update the complaint status.
 * This endpoint allows the assigned follow-up agent to update the complaint's status
 * (for example, RESOLVED or CLOSED) and sends an email notification accordingly.
 */
const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const complaintId = parseInt(req.params.id);
    const { status, reviewerUserId } = req.body; // status should be one of: PENDING, IN_PROGRESS, RESOLVED, CLOSED

    if (!["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid complaint status" });
    }

    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: { status },
    });

    // Record a follow-up note for the status update.
    await prisma.followUp.create({
      data: {
        complaintId,
        userId: reviewerUserId,
        message: `Complaint status updated to ${status}.`,
      },
    });

    // Notify the complainer.
    const complaintUser = await prisma.user.findUnique({ where: { id: complaint.userId } });
    if (complaintUser?.email) {
      let emailSubject = "Complaint Status Update";
      let emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
                    background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
          <div style="text-align: center; padding-bottom: 15px;">
            <h2 style="color: #2a9d8f; margin: 0;">Complaint Status Update</h2>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${complaintUser.username},</p>
            <p style="color: #555; font-size: 15px;">The status of your complaint has been updated to <strong>${status}</strong>.</p>
          </div>
          <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
            Best regards,<br><strong style="color: #2a9d8f;">Management Team</strong>
          </p>
        </div>
      `;
      if (status === "RESOLVED" || status === "CLOSED") {
        emailSubject = "Your Complaint Has Been Resolved";
        emailHTML = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
                      background-color: #f4f8fb; border-radius: 10px; border: 1px solid #dce6ec;">
            <div style="text-align: center; padding-bottom: 15px;">
              <h2 style="color: #2a9d8f; margin: 0;">Complaint Resolved</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="color: #333; font-size: 16px;">Dear ${complaintUser.username},</p>
              <p style="color: #555; font-size: 15px;">Your complaint has been <strong>${status.toLowerCase()}</strong>. Thank you for your patience.</p>
            </div>
            <p style="text-align: center; color: #777; font-size: 13px; margin-top: 15px;">
              Best regards,<br><strong style="color: #2a9d8f;">Management Team</strong>
            </p>
          </div>
        `;
      }

      const emailOptions = {
        to: complaintUser.email,
        subject: emailSubject,
        html: emailHTML,
      };
      await sendMail(emailOptions);
    }

    return res.status(StatusCodes.OK).json({ message: "Complaint status updated", complaint });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error updating complaint status" });
  }
};

// Define routes
router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.put("/:id/assign", assignComplaint);
router.post("/:id/followup", addFollowUpNote);
router.put("/:id/status", updateComplaintStatus);

export default router;
