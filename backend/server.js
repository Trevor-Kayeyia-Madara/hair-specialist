// eslint-disable-next-line no-undef
require('dotenv').config();
import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import serviceRoutes from './routes/services';
import appointmentRoutes from './routes/appointments';
import reviewRoutes from './routes/reviews';
import chatRoutes from './routes/chat';
import notificationRoutes from './routes/notifications';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});