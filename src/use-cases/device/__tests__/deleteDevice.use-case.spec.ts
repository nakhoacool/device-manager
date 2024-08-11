import { DeleteDevice, DeleteDeviceInput } from '../deleteDevice.use-case';
import { NotFoundException } from '../../../exceptions';
describe('Delete Device Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should delete a device when given a valid id', async () => {
    // Arrange
    const id = 'validId';
    const deviceRepository = {
      get: jest.fn().mockResolvedValue({ id: 'validId' }),
      delete: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      pagination: jest.fn(),
    };
    const deleteDevice = new DeleteDevice({ deviceRepository });

    // Act
    const result = await deleteDevice.handle(new DeleteDeviceInput({ id }));

    // Assert
    expect(deviceRepository.get).toHaveBeenCalledWith(id);
    expect(deviceRepository.delete).toHaveBeenCalledWith(id);
    expect(result).toBe(`Device with id ${id} has been deleted`);
  });
  it('should throw error Not Found if the device with the given id does not exist', async () => {
    // Arrange
    const id = 'invalidId';
    const deviceRepository = {
      get: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      pagination: jest.fn(),
    };

    // Act
    const deleteDevice = new DeleteDevice({ deviceRepository });

    // Assert
    await expect(
      deleteDevice.handle(new DeleteDeviceInput({ id })),
    ).rejects.toThrow(new NotFoundException(`Device with id ${id} not found`));
    expect(deviceRepository.get).toHaveBeenCalledWith(id);
    expect(deviceRepository.delete).not.toHaveBeenCalled();
  });
  it('should return the same instance of DeleteDevice when getInstance is called multiple times', () => {
    // Act
    const instance1 = DeleteDevice.getInstance();
    const instance2 = DeleteDevice.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
  });
});
