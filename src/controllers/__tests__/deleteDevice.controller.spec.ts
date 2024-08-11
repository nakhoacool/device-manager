import { IncomingMessage, ServerResponse } from 'http';
import { device as deviceUseCases } from '../../use-cases';
import { DeleteDevice } from '../deleteDevice.controller';
import { BadRequestException } from '../../exceptions';
import { ErrorMapper, SuccessMapper } from '../../utils';

// prevent console log functions to print log in console
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.mock('../../utils/error-mapper');
jest.mock('../../utils/success-mapper');

const useCaseDeleteDeviceHandle = jest.fn();
const useCaseDeleteDevice = {
  handle: useCaseDeleteDeviceHandle,
} as unknown as deviceUseCases.Delete;

const controller = new DeleteDevice({
  useCaseDeleteDevice: useCaseDeleteDevice,
});

describe('DeleteDevice Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return 200 status code and the device deleted', async () => {
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

    useCaseDeleteDeviceHandle.mockResolvedValue({
      id: '1',
      name: 'device',
    });

    await controller.handle(request, response);

    expect(useCaseDeleteDeviceHandle).toHaveBeenCalledWith({
      dto: { id: '1' },
    });
    expect(SuccessMapper.toSuccessResponse).toHaveBeenCalledWith(
      200,
      { message: { id: '1', name: 'device' } },
      response,
    );
  });
  it('should return the same instance', () => {
    const instance1 = DeleteDevice.getInstance();
    const instance2 = DeleteDevice.getInstance();

    // Assertions
    expect(instance1).toBeInstanceOf(DeleteDevice);
    expect(instance2).toBeInstanceOf(DeleteDevice);
    expect(instance1).toBe(instance2);
  });
  it('should return 400 status code when a BadRequestException is thrown', async () => {
    // Arrange
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

    const error = new BadRequestException('Bad request');
    useCaseDeleteDeviceHandle.mockRejectedValue(error);

    // Act
    await controller.handle(request, response);

    // Assert
    expect(console.error).toHaveBeenCalledWith(error);
    expect(useCaseDeleteDeviceHandle).toHaveBeenCalledWith({
      dto: { id: '1' },
    });
    expect(ErrorMapper.toErrorResponse).toHaveBeenCalledWith(error, response);
  });
});
