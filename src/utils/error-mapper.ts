import {
  NotFoundException,
  UnknownException,
  BadRequestException,
} from '../exceptions';
import { ServerResponse } from 'http';

export class ErrorMapper {
  public static toErrorResponse(error: Error, response: ServerResponse) {
    let statusCode = 500;
    if (error instanceof UnknownException) {
      statusCode = 500;
    }
    if (error instanceof BadRequestException) {
      statusCode = 400;
    }
    if (error instanceof NotFoundException) {
      statusCode = 404;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
      'Access-Control-Max-Age': 2592000, // 30 days
    };

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({ message: error.message }));
  }
}
