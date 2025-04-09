// chatRoutes.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const chatrouter = express.Router();
const prisma = new PrismaClient();

/**
 * POST /chat/send
 * Sends a new chat message. Supports text messages and file attachments.
 * Request body must include:
 * - senderId: number
 * - receiverId: number
 * - message?: string
 * - attachment?: string
 */
chatrouter.post('/chat/send', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { senderId, receiverId, message, attachment } = req.body;
    if (!senderId || !receiverId || (!message && !attachment)) {
      return res.status(400).json({ error: 'Missing required fields: senderId, receiverId, and either message or attachment are required.' });
    }

    const chat = await prisma.chat.create({
      data: {
        senderId,
        receiverId,
        message,
        attachment,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return res.status(201).json(chat);
  } catch (error) {
    console.error('Error sending chat message:', error);
    return res.status(500).json({ error: 'Failed to send chat message.' });
  }
});

/**
 * GET /chat/conversation
 * Retrieves the full conversation history between two users.
 * Expects query parameters:
 * - user1: number
 * - user2: number
 */
chatrouter.get('/chat/conversation', async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ error: 'Missing required query parameters: user1 and user2.' });
    }

    const userId1 = parseInt(user1 as string, 10);
    const userId2 = parseInt(user2 as string, 10);

    const conversation = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return res.json(conversation);
  } catch (error) {
    console.error('Error retrieving conversation:', error);
    return res.status(500).json({ error: 'Failed to retrieve conversation.' });
  }
});

/**
 * GET /chat/conversations/:userId
 * Lists all conversations a user is participating in.
 * Returns the latest message for each conversation partner along with their user details.
 */
chatrouter.get('/chat/conversations/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    // Get all messages where the user is either the sender or receiver.
    const messages = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // Group messages by the conversation partner.
    const conversationMap = new Map<number, any>();
    messages.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      // Only store the latest message for each unique conversation partner.
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, msg);
      }
    });

    const conversations = Array.from(conversationMap.values());

    return res.json(conversations);
  } catch (error) {
    console.error('Error listing conversations:', error);
    return res.status(500).json({ error: 'Failed to list conversations.' });
  }
});

export default chatrouter;
