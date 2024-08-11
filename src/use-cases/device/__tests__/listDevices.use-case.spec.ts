import { ListDevices } from '../listDevices.use-case';
import { Device, DeviceStatus } from '../../../domain/models/device';
import { v4 as uuidv4 } from 'uuid';

describe('List Devices Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return a list of devices when handle method is called', async () => {
    // Arrange
    const deviceMock = [
      new Device({
        id: uuidv4(),
        name: 'Test Device',
        status: DeviceStatus.ON,
      }),
      new Device({
        id: uuidv4(),
        name: 'Test Device 2',
        status: DeviceStatus.OFF,
      }),
    ];
    const deviceRepository = {
      list: jest.fn().mockResolvedValue(deviceMock),
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      pagination: jest.fn(),
    };
    const listDevices = new ListDevices({ deviceRepository });

    // Act
    const result = await listDevices.handle();

    // Assert
    expect(result).toEqual({
      total: deviceMock.length,
      data: deviceMock.map((device) => device.toJSON()),
    });
    expect(deviceRepository.list).toHaveBeenCalledTimes(1);
  });
  it('should return a list of devices when handle method is called with valid pagination parameters', async () => {
    // Arrange
    const deviceMock = {
      total: 2,
      data: [
        new Device({
          id: uuidv4(),
          name: 'Test Device',
          status: DeviceStatus.ON,
        }),
        new Device({
          id: uuidv4(),
          name: 'Test Device 2',
          status: DeviceStatus.OFF,
        }),
      ],
    };
    const deviceRepository = {
      pagination: jest.fn().mockResolvedValue(deviceMock),
      list: jest.fn(),
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const listDevices = new ListDevices({ deviceRepository });

    // Act
    const result = await listDevices.handle(1, 10);

    // Assert
    expect(result).toEqual({
      total: deviceMock.total,
      data: deviceMock.data.map((device) => device.toJSON()),
    });
    expect(deviceRepository.pagination).toHaveBeenCalledTimes(1);
  });
  it('should return the same instance of ListDevices when getInstance is called multiple times', () => {
    // Act
    const instance1 = ListDevices.getInstance();
    const instance2 = ListDevices.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
  });
});
