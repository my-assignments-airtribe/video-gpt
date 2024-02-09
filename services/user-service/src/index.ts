import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import http from 'http';


const app = express();
app.use(helmet());
let server: http.Server;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello from user-service');
});

server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server running on port 3000');
});