import { IncomingMessage, ServerResponse } from 'http';
import { device as deviceUseCases } from '../../use-cases';
import { GetDevice } from '../getDevice.controller';
import { BadRequestException } from '../../exceptions';
import { ErrorMapper, SuccessMapper } from '../../utils';

// prevent console log functions to print log in console
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.mock('../../utils/error-mapper');
jest.mock('../../utils/success-mapper');

describe('GetDevice Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return the device with the given id', async () => {
    const useCaseGetDeviceHandle = jest.fn();
    const useCaseGetDevice = {
      handle: useCaseGetDeviceHandle,
    } as unknown as deviceUseCases.Get;

    const controller = new GetDevice({
      useCaseGetDevice: useCaseGetDevice,
    });

    const request = {
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

    useCaseGetDeviceHandle.mockResolvedValue({
      id: '1',
      name: 'device',
    });

    await controller.handle(request, response);

    expect(useCaseGetDeviceHandle).toHaveBeenCalledWith({
      dto: { id: '1' },
    });
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      200,
      { id: '1', name: 'device' },
      response,
    );
  });
  it('should return 404 status code when the device is not found', async () => {
    const useCaseGetDeviceHandle = jest.fn();
    const useCaseGetDevice = {
      handle: useCaseGetDeviceHandle,
    } as unknown as deviceUseCases.Get;

    const controller = new GetDevice({
      useCaseGetDevice: useCaseGetDevice,
    });

    const request = {
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

    const error = new BadRequestException('Device not found');

    useCaseGetDeviceHandle.mockRejectedValue(error);

    await controller.handle(request, response);

    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
  it('should return the same instance', () => {
    const instance1 = GetDevice.getInstance();
    const instance2 = GetDevice.getInstance();

    // Assertions
    expect(instance1).toBeInstanceOf(GetDevice);
    expect(instance2).toBeInstanceOf(GetDevice);
    expect(instance1).toBe(instance2);
  });
});
