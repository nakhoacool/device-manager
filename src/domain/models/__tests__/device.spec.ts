import { Device, DeviceStatus } from '../device';
// import uuid
import { v4 as uuidv4 } from 'uuid';
describe('Device', () => {
  // Device can be created with valid input
  it('should create a new device with valid input', () => {
    // Arrange
    const deviceProps = {
      id: uuidv4(),
      name: 'Example Device',
      status: DeviceStatus.ON,
    };

    // Act
    const device = new Device(deviceProps);

    // Assert
    expect(device.id).toEqual(deviceProps.id);
    expect(device.name).toEqual('Example Device');
    expect(device.status).toEqual(DeviceStatus.ON);
  });
  it('should throw an error when creating a device with invalid id', () => {
    // Arrange
    const deviceProps = {
      id: 'invalid-id',
      name: 'Example Device',
      status: DeviceStatus.ON,
    };

    // Act and Assert
    expect(() => new Device(deviceProps)).toThrow(
      'Invalid device id: invalid-id',
    );
  });
  it('should throw an error when creating a device with invalid status', () => {
    // Arrange
    const deviceProps = {
      id: uuidv4(),
      name: 'Example Device',
      status: 'INVALID_STATUS' as DeviceStatus,
    };

    // Act and Assert
    expect(() => new Device(deviceProps)).toThrow(
      'Invalid device status: INVALID_STATUS',
    );
  });
});
