import {
  UnknownException,
  BadRequestException,
  NotFoundException,
} from '../../exceptions';
import { ServerResponse } from 'http';
import { ErrorMapper } from '../error-mapper';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
  'Access-Control-Max-Age': 2592000, // 30 days
};

describe('Error Mapper', () => {
  // Returns 500 status code and error message when UnknownException is thrown
  it('should return 500 status code and error message when UnknownException is thrown', () => {
    // Arrange
    const error = new UnknownException();
    const response = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    // Act
    ErrorMapper.toErrorResponse(error, response);
    // Assert
    expect(response.writeHead).toHaveBeenCalledWith(500, headers);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ message: error.message }),
    );
  });
  // Returns 500 status code and error message when error is not an instance of any known exception
  it('should return 500 status code and error message when error is not an instance of any known exception', () => {
    // Arrange
    const error = new Error();
    const response = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    // Act
    ErrorMapper.toErrorResponse(error, response);
    // Assert
    expect(response.writeHead).toHaveBeenCalledWith(500, headers);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ message: error.message }),
    );
  });
  // Returns 400 status code and error message when BadRequestException is thrown
  it('should return 400 status code and error message when BadRequestException is thrown', () => {
    // Arrange
    const error = new BadRequestException();
    const response = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    // Act
    ErrorMapper.toErrorResponse(error, response);
    // Assert
    expect(response.writeHead).toHaveBeenCalledWith(400, headers);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ message: error.message }),
    );
  });
  // Returns 404 status code and error message when NotFoundException is thrown
  it('should return 404 status code and error message when NotFoundException is thrown', () => {
    // Arrange
    const error = new NotFoundException();
    const response = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    // Act
    ErrorMapper.toErrorResponse(error, response);
    // Assert
    expect(response.writeHead).toHaveBeenCalledWith(404, headers);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ message: error.message }),
    );
  });
});
