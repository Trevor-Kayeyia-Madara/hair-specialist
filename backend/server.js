import express from 'express';
import process from 'process';
import cors from 'cors';
import usersRouter from './routes/users.js';
import servicesRouter from './routes/services.js';
import appointmentsRouter from './routes/appointments.js';
import reviewsRouter from './routes/reviews.js';
import chatRouter from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/services', servicesRouter);
app.use('/appointments', appointmentsRouter);
app.use('/reviews', reviewsRouter);
app.use('/chat', chatRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
