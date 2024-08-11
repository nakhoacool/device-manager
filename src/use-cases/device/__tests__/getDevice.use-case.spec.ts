import { Device, DeviceStatus } from '../../../domain/models/device';
import { GetDevice, GetDeviceInput } from '../getDevice.use-case';
import { NotFoundException } from '../../../exceptions';
import { v4 as uuidv4 } from 'uuid';
describe('Get Device Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return the device with the given id', async () => {
    // Arrange
    const inputDTO = {
      id: '123',
    };
    const getDeviceMock = new Device({
      id: uuidv4(),
      name: 'Test Device',
      status: DeviceStatus.ON,
    });
    const input = new GetDeviceInput(inputDTO);
    const deviceRepositoryMock = {
      get: jest.fn().mockResolvedValueOnce(getDeviceMock),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      pagination: jest.fn(),
    };
    const getDevice = new GetDevice({
      deviceRepository: deviceRepositoryMock,
    });

    // Act
    const device = await getDevice.handle(input);

    // Assert
    expect(device).toEqual(getDeviceMock.toJSON());
    expect(deviceRepositoryMock.get).toHaveBeenCalledWith('123');
    expect(deviceRepositoryMock.get).toHaveBeenCalledTimes(1);
  });
  it('should throw a NotFoundException when the device with the given id is not found', async () => {
    // Arrange
    const inputDTO = {
      id: '123',
    };
    const input = new GetDeviceInput(inputDTO);
    const deviceRepositoryMock = {
      get: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      pagination: jest.fn(),
    };
    const getDevice = new GetDevice({
      deviceRepository: deviceRepositoryMock,
    });

    await expect(getDevice.handle(input)).rejects.toThrow(
      new NotFoundException('Device with id 123 not found'),
    );
    expect(deviceRepositoryMock.get).toHaveBeenCalledWith('123');
  });
  it('should return the same instance of GetDevice when getInstance is called multiple times', () => {
    // Act
    const instance1 = GetDevice.getInstance();
    const instance2 = GetDevice.getInstance();
    // Assert
    expect(instance1).toBe(instance2);
  });
});
