import { IncomingMessage, ServerResponse } from 'http';
import { device as deviceUseCases } from '../../use-cases';
import { ListDevices } from '../listDevices.controller';
import { UnknownException } from '../../exceptions';
import { ErrorMapper, SuccessMapper } from '../../utils';

// prevent console log functions to print log in console
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.mock('../../utils/error-mapper');
jest.mock('../../utils/success-mapper');

const useCaseListDevicesHandle = jest.fn();
const useCaseListDevices = {
  handle: useCaseListDevicesHandle,
} as unknown as deviceUseCases.List;

const controller = new ListDevices({
  useCaseListDevices: useCaseListDevices,
});

describe('ListDevices Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return a list of devices when valid page and pageSize are provided', async () => {
    // Arrange
    const request = {
      url: 'http://localhost:3000/devices?page=1&pageSize=10',
      headers: {
        host: 'localhost:3000',
      },
    } as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;

    const devices = [
      {
        id: '1',
        name: 'Device 1',
        status: 'active',
      },
      {
        id: '2',
        name: 'Device 2',
        status: 'inactive',
      },
    ];

    useCaseListDevicesHandle.mockResolvedValue(devices);

    // Act
    await controller.handle(request, response);

    // Assert
    expect(useCaseListDevicesHandle).toHaveBeenCalledTimes(1);
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      200,
      devices,
      response,
    );
    expect(response.end).toHaveBeenCalledTimes(1);
  });
  it('should return a list of devices when no page and pageSize are provided', async () => {
    // Arrange
    const request = {
      url: 'http://localhost:3000/devices',
      headers: {
        host: 'localhost:3000',
      },
    } as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;

    const devices = [
      {
        id: '1',
        name: 'Device 1',
        status: 'active',
      },
      {
        id: '2',
        name: 'Device 2',
        status: 'inactive',
      },
    ];

    useCaseListDevicesHandle.mockResolvedValue(devices);

    // Act
    await controller.handle(request, response);

    // Assert
    expect(useCaseListDevicesHandle).toHaveBeenCalledTimes(1);
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      200,
      devices,
      response,
    );
    expect(response.end).toHaveBeenCalledTimes(1);
  });
  it('should return the same instance of ListDevices', () => {
    const instance1 = ListDevices.getInstance();
    const instance2 = ListDevices.getInstance();

    expect(instance1).toBe(instance2);
  });
  it('should return a 500 status code when an UnknownException is thrown', async () => {
    // Arrange
    const request = {} as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;

    const error = new UnknownException('List All devices failure');
    useCaseListDevicesHandle.mockRejectedValue(error);

    // Act
    await controller.handle(request, response);

    // Assert
    expect(console.error).toHaveBeenCalled();
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
});
