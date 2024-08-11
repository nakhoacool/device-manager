import { ServerResponse } from 'http';
import { Device } from '../domain/models/device';

export class SuccessMapper {
  public static toSuccessResponse(
    statusCode: number,
    data: Device | Device[] | Record<string, unknown>,
    response: ServerResponse,
  ) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
      'Access-Control-Max-Age': 2592000, // 30 days
    };

    response.writeHead(statusCode, headers);
    response.write(JSON.stringify(data));
  }
}
