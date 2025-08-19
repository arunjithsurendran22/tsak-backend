import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use('/download', express.static('download'));

export default app;
