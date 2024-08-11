import { DeviceStatus, Device } from '../../../domain/models/device';
import { UpdateDevice, UpdateDeviceInput } from '../updateDevice.use-case';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '../../../exceptions';

describe('Update Device Use Case', () => {
  it('should update a device', async () => {
    const device = new Device({
      id: uuidv4(),
      name: 'Device 1',
      status: DeviceStatus.ON,
    });

    const updatedDevice = new Device({
      id: device.id,
      name: 'Device 1 Updated',
      status: DeviceStatus.OFF,
    });

    const deviceRepository = {
      get: jest.fn().mockResolvedValue(device),
      update: jest.fn().mockResolvedValue(updatedDevice),
      create: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      pagination: jest.fn(),
    };

    const updateDevice = new UpdateDevice({ deviceRepository });
    const input = new UpdateDeviceInput({
      id: device.id,
      name: updatedDevice.name,
      status: updatedDevice.status,
    });

    const result = await updateDevice.handle(input);

    expect(result).toEqual(updatedDevice.toJSON());
    expect(device.id).toEqual(updatedDevice.id);
    expect(deviceRepository.get).toHaveBeenCalledWith(device.id);
    expect(deviceRepository.update).toHaveBeenCalledWith(updatedDevice);
  });
  it('should throw an error when the device does not exist', async () => {
    const deviceRepository = {
      get: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      pagination: jest.fn(),
    };

    const updateDevice = new UpdateDevice({ deviceRepository });
    const input = new UpdateDeviceInput({
      id: uuidv4(),
      name: 'Device 1 Updated',
      status: DeviceStatus.OFF,
    });

    await expect(updateDevice.handle(input)).rejects.toThrow(
      new NotFoundException(`Device with id ${input.dto.id} not found`),
    );
    expect(deviceRepository.get).toHaveBeenCalledWith(input.dto.id);
    expect(deviceRepository.update).not.toHaveBeenCalled();
  });
  it('should update a device with only name', async () => {
    const device = new Device({
      id: uuidv4(),
      name: 'Device 1',
      status: DeviceStatus.ON,
    });

    const updatedDevice = new Device({
      id: device.id,
      name: 'Device 1 Updated',
      status: DeviceStatus.ON,
    });

    const deviceRepository = {
      get: jest.fn().mockResolvedValue(device),
      update: jest.fn().mockResolvedValue(updatedDevice),
      create: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      pagination: jest.fn(),
    };

    const updateDevice = new UpdateDevice({ deviceRepository });
    const input = new UpdateDeviceInput({
      id: device.id,
      name: updatedDevice.name,
      status: undefined,
    });

    const result = await updateDevice.handle(input);

    expect(result).toEqual(updatedDevice.toJSON());
    expect(device.id).toEqual(updatedDevice.id);
    expect(device.status).toEqual(updatedDevice.status);
    expect(deviceRepository.get).toHaveBeenCalledWith(device.id);
    expect(deviceRepository.update).toHaveBeenCalledWith(updatedDevice);
  });
  it('should update a device with only status', async () => {
    const device = new Device({
      id: uuidv4(),
      name: 'Device 1',
      status: DeviceStatus.ON,
    });

    const updatedDevice = new Device({
      id: device.id,
      name: 'Device 1',
      status: DeviceStatus.OFF,
    });

    const deviceRepository = {
      get: jest.fn().mockResolvedValue(device),
      update: jest.fn().mockResolvedValue(updatedDevice),
      create: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      pagination: jest.fn(),
    };

    const updateDevice = new UpdateDevice({ deviceRepository });
    const input = new UpdateDeviceInput({
      id: device.id,
      name: undefined,
      status: updatedDevice.status,
    });

    const result = await updateDevice.handle(input);

    expect(result).toEqual(updatedDevice.toJSON());
    expect(device.id).toEqual(updatedDevice.id);
    expect(device.name).toEqual(updatedDevice.name);
    expect(deviceRepository.get).toHaveBeenCalledWith(device.id);
    expect(deviceRepository.update).toHaveBeenCalledWith(updatedDevice);
  });
  it('should return the same instance of UpdateDevice when getInstance is called multiple times', () => {
    const instance1 = UpdateDevice.getInstance();
    const instance2 = UpdateDevice.getInstance();

    expect(instance1).toBe(instance2);
  });
});
