import { createServer, Server } from 'http';
import { router } from './controllers';
import serverless, { Application } from 'serverless-http';

export class App {
  private server: Server;

  constructor() {
    this.server = createServer((request, response) => {
      if (request.method === 'OPTIONS') {
        response.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': 2592000,
        });
        response.end();
        return;
      }
      router(request, response);
    });
  }

  getServerlessHandler() {
    return serverless(this.server as Application);
  }

  start(port: number) {
    this.server.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  }
}
