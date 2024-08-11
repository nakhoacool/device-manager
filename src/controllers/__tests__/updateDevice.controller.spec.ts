import { IncomingMessage, ServerResponse } from 'http';
import { device as deviceUseCases } from '../../use-cases';
import { UpdateDevice } from '../updateDevice.controller';
import { BadRequestException } from '../../exceptions';
import { ErrorMapper, SuccessMapper } from '../../utils';

// prevent console log functions to print log in console
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.mock('../../utils/error-mapper');
jest.mock('../../utils/success-mapper');

describe('UpdateDevice Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should update device with valid name and status', async () => {
    const useCaseUpdateDeviceHandle = jest.fn();
    const useCaseUpdateDevice = {
      handle: useCaseUpdateDeviceHandle,
    } as unknown as deviceUseCases.Update;

    const controller = new UpdateDevice({
      useCaseUpdateDevice: useCaseUpdateDevice,
    });

    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": "Device 1", "status": "ON"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
      url: '/devices/1',
      headers: {
        host: 'localhost',
      },
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;

    useCaseUpdateDeviceHandle.mockResolvedValue({
      id: '1',
      name: 'Device 1',
      status: 'ON',
    });

    await controller.handle(request, response);

    expect(useCaseUpdateDeviceHandle).toHaveBeenCalledWith({
      dto: { id: '1', name: 'Device 1', status: 'ON' },
    });
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      200,
      { id: '1', name: 'Device 1', status: 'ON' },
      response,
    );
  });
  it('should update device with no provided name and valid status', async () => {
    const useCaseUpdateDeviceHandle = jest.fn();
    const useCaseUpdateDevice = {
      handle: useCaseUpdateDeviceHandle,
    } as unknown as deviceUseCases.Update;

    const controller = new UpdateDevice({
      useCaseUpdateDevice: useCaseUpdateDevice,
    });

    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"status": "ON"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
      url: '/devices/1',
      headers: {
        host: 'localhost',
      },
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;

    useCaseUpdateDeviceHandle.mockResolvedValue({
      id: '1',
      name: 'Device 1',
      status: 'ON',
    });

    await controller.handle(request, response);

    expect(useCaseUpdateDeviceHandle).toHaveBeenCalledWith({
      dto: { id: '1', status: 'ON' },
    });
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      200,
      { id: '1', name: 'Device 1', status: 'ON' },
      response,
    );
  });
  it('should update device with valid name and status not provided', async () => {
    const useCaseUpdateDeviceHandle = jest.fn();
    const useCaseUpdateDevice = {
      handle: useCaseUpdateDeviceHandle,
    } as unknown as deviceUseCases.Update;

    const controller = new UpdateDevice({
      useCaseUpdateDevice: useCaseUpdateDevice,
    });

    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": "Device 1 Updated"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
      url: '/devices/1',
      headers: {
        host: 'localhost',
      },
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;

    useCaseUpdateDeviceHandle.mockResolvedValue({
      id: '1',
      name: 'Device 1 Updated',
      status: 'OFF',
    });

    await controller.handle(request, response);

    expect(useCaseUpdateDeviceHandle).toHaveBeenCalledWith({
      dto: { id: '1', name: 'Device 1 Updated' },
    });
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      200,
      { id: '1', name: 'Device 1 Updated', status: 'OFF' },
      response,
    );
  });
  it('should throw BadRequestException when name is empty', async () => {
    const useCaseUpdateDeviceHandle = jest.fn();
    const useCaseUpdateDevice = {
      handle: useCaseUpdateDeviceHandle,
    } as unknown as deviceUseCases.Update;

    const controller = new UpdateDevice({
      useCaseUpdateDevice: useCaseUpdateDevice,
    });

    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": " ", "status": "ON"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
      url: '/devices/1',
      headers: {
        host: 'localhost',
      },
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    const error = new BadRequestException('Name cannot be empty');
    useCaseUpdateDeviceHandle.mockRejectedValue(error);

    await controller.handle(request, response);

    expect(console.error).toHaveBeenCalled();
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
  it('should throw BadRequestException when status is empty', async () => {
    const useCaseUpdateDeviceHandle = jest.fn();
    const useCaseUpdateDevice = {
      handle: useCaseUpdateDeviceHandle,
    } as unknown as deviceUseCases.Update;

    const controller = new UpdateDevice({
      useCaseUpdateDevice: useCaseUpdateDevice,
    });

    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": "Device 1", "status": " "}');
        }
        if (event === 'end') {
          callback();
        }
      }),
      url: '/devices/1',
      headers: {
        host: 'localhost',
      },
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    const error = new BadRequestException('Status cannot be empty');
    useCaseUpdateDeviceHandle.mockRejectedValue(error);

    await controller.handle(request, response);

    expect(console.error).toHaveBeenCalled();
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
  it('should throw BadRequestException when status is invalid', async () => {
    const useCaseUpdateDeviceHandle = jest.fn();
    const useCaseUpdateDevice = {
      handle: useCaseUpdateDeviceHandle,
    } as unknown as deviceUseCases.Update;

    const controller = new UpdateDevice({
      useCaseUpdateDevice: useCaseUpdateDevice,
    });

    const request = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('{"name": "Device 1", "status": "INVALID"}');
        }
        if (event === 'end') {
          callback();
        }
      }),
      url: '/devices/1',
      headers: {
        host: 'localhost',
      },
    } as unknown as IncomingMessage;
    const response = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
    const error = new BadRequestException('Invalid status');
    useCaseUpdateDeviceHandle.mockRejectedValue(error);

    await controller.handle(request, response);

    expect(console.error).toHaveBeenCalled();
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
  it('should return the same instance', () => {
    const instance1 = UpdateDevice.getInstance();
    const instance2 = UpdateDevice.getInstance();

    // Assertions
    expect(instance1).toBeInstanceOf(UpdateDevice);
    expect(instance2).toBeInstanceOf(UpdateDevice);
    expect(instance1).toBe(instance2);
  });
});
