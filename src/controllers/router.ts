import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { ListDevices } from './listDevices.controller';
import { CreateDevice } from './createDevice.controller';
import { GetDevice } from './getDevice.controller';
import { UpdateDevice } from './updateDevice.controller';
import { DeleteDevice } from './deleteDevice.controller';
import { ErrorMapper } from '../utils/error-mapper';
import { NotFoundException } from '../exceptions';

type RouteHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => void;

interface Route {
  method: string;
  path: RegExp;
  handler: RouteHandler;
}

const routes: Route[] = [
  {
    method: 'GET',
    path: /^\/devices$/,
    handler: (request: IncomingMessage, response: ServerResponse) =>
      ListDevices.getInstance().handle(request, response),
  },
  {
    method: 'GET',
    path: /^\/devices\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
    handler: (request: IncomingMessage, response: ServerResponse) =>
      GetDevice.getInstance().handle(request, response),
  },
  {
    method: 'POST',
    path: /^\/devices$/,
    handler: (request: IncomingMessage, response: ServerResponse) =>
      CreateDevice.getInstance().handle(request, response),
  },
  {
    method: 'PUT',
    path: /^\/devices\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
    handler: (request: IncomingMessage, response: ServerResponse) =>
      UpdateDevice.getInstance().handle(request, response),
  },
  {
    method: 'DELETE',
    path: /^\/devices\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
    handler: (request: IncomingMessage, response: ServerResponse) =>
      DeleteDevice.getInstance().handle(request, response),
  },
];

export const router = (request: IncomingMessage, response: ServerResponse) => {
  const url = new URL(request.url!, `http://${request.headers.host}`);
  const pathname = url.pathname;

  for (const route of routes) {
    if (request.method === route.method && route.path.test(pathname)) {
      route.handler(request, response);
      return;
    }
  }

  ErrorMapper.toErrorResponse(
    new NotFoundException('Route not found'),
    response,
  );
};
