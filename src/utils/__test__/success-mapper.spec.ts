import { Device } from '../../domain/models/device';
import { SuccessMapper } from '../success-mapper';
import { ServerResponse } from 'http';

describe('SuccessMapper', () => {
  it('should return a success response', () => {
    // Arrange
    const statusCode = 200;
    const data = { id: '1', name: 'device 1' };
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
    } as unknown as ServerResponse;
    // Act
    SuccessMapper.toSuccessResponse(statusCode, data as Device, response);
    // Assert
    expect(response.writeHead).toHaveBeenCalledWith(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
      'Access-Control-Max-Age': 2592000,
    });
    expect(response.write).toHaveBeenCalledWith(JSON.stringify(data));
  });
});
