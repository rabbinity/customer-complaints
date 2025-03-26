
  // server.js
  const express = require('express');
  const dotenv = require('dotenv');
  const userRouter = require('./routes/userRoutes');
  
  dotenv.config();
  
  const app = express();
  app.use(express.json());
  
  // Routes
  app.use('/api/user', userRouter);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // config/db.js
  const { PrismaClient } = require('@prisma/client');
  
  const prisma = new PrismaClient();
  
  module.exports = { prisma };
  
  // utils/
 