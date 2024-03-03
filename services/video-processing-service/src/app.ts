import express, { Express } from 'express';
import helmet from 'helmet';
import routes from './api/routes';
import config from './config';
import "./config/db";


const app: Express = express();


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

const port: number = parseInt(config.port, 10);
app.listen(port, () => {
  console.log(`Video Processing Service running at http://localhost:${port}`);
});

export default app;
