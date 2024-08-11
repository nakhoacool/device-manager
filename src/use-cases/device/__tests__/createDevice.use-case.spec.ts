import { DeviceStatus, Device } from '../../../domain/models/device';
import { CreateDevice, CreateDeviceInput } from '../createDevice.use-case';
import { v4 as uuidv4 } from 'uuid';
describe('Create Device Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should create a new device with valid input and return it', async () => {
    // Arrange
    const inputDTO = {
      name: 'Test Device',
      status: DeviceStatus.ON,
    };

    const input = new CreateDeviceInput(inputDTO);

    const expectedDevice = new Device({
      id: uuidv4(),
      name: 'Test Device',
      status: DeviceStatus.ON,
    });

    const deviceRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(expectedDevice),
      get: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      pagination: jest.fn(),
    };

    const createDevice = new CreateDevice({
      deviceRepository: deviceRepositoryMock,
    });

    // Act
    const result = await createDevice.handle(input);

    // Assert
    expect(deviceRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedDevice.toJSON());
  });
  it('should return the same instance of CreateDevice when getInstance is called multiple times', () => {
    // Act
    const instance1 = CreateDevice.getInstance();
    const instance2 = CreateDevice.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
  });
});
