import { IncomingMessage, ServerResponse } from 'http';
import { device as deviceUseCases } from '../../use-cases';
import { CreateDevice } from '../createDevice.controller';
import { BadRequestException } from '../../exceptions';
import { ErrorMapper, SuccessMapper } from '../../utils';

// prevent console log functions to print log in console
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.mock('../../utils/error-mapper');
jest.mock('../../utils/success-mapper');

const useCaseCreateDeviceHandle = jest.fn();
const useCaseCreateDevice = {
  handle: useCaseCreateDeviceHandle,
} as unknown as deviceUseCases.Create;

const controller = new CreateDevice({
  useCaseCreateDevice: useCaseCreateDevice,
});
describe('CreateDevice Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should create a device', async () => {
    // Arrange
    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": "Device 1", "status": "ON"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;

    const device = {
      id: '1',
      name: 'Device 1',
      status: 'ON',
    };
    useCaseCreateDeviceHandle.mockResolvedValue(device);

    // Act
    await controller.handle(request, response);

    expect(useCaseCreateDevice.handle).toHaveBeenCalledWith({
      dto: { name: 'Device 1', status: 'ON' },
    });
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      201,
      device,
      response,
    );
    expect(console.error).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
  });
  it('should return 400 status code when name is empty', async () => {
    // Arrange
    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": " ", "status": "ON"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    const error = new BadRequestException('Name cannot be empty');
    useCaseCreateDeviceHandle.mockRejectedValue(error);

    // Act
    await controller.handle(request, response);

    expect(useCaseCreateDevice.handle).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
  it('should return 400 status code when status is empty', async () => {
    // Arrange
    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": "Device 1", "status": " "}');
        }
        if (event === 'end') {
          callback();
        }
      }),
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    const error = new BadRequestException('Status cannot be empty');

    useCaseCreateDeviceHandle.mockRejectedValue(error);

    // Act
    await controller.handle(request, response);

    expect(useCaseCreateDevice.handle).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
  it('should return 400 status code when status is invalid', async () => {
    // Arrange
    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": "Device 1", "status": "INVALID"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    const error = new BadRequestException('Invalid status');

    useCaseCreateDeviceHandle.mockRejectedValue(error);

    // Act
    await controller.handle(request, response);

    expect(useCaseCreateDevice.handle).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
  it('should return the same instance of CreateDevice', () => {
    const instance1 = CreateDevice.getInstance();
    const instance2 = CreateDevice.getInstance();

    expect(instance1).toBe(instance2);
  });
});
