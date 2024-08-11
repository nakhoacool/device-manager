import { v4 as uuid } from 'uuid';
import { repositories } from '../../data-access';
import {
  repositories as domainRepositories,
  models as domainModels,
} from '../../domain';
import { DeviceCreateDTO } from '../../controllers/dto';

export class CreateDeviceInput {
  constructor(public readonly dto: DeviceCreateDTO) {}
}

export class CreateDevice {
  static instance: CreateDevice | null = null;
  private readonly repository: domainRepositories.DeviceRepository;

  constructor({
    deviceRepository,
  }: {
    deviceRepository: domainRepositories.DeviceRepository;
  }) {
    this.repository = deviceRepository;
  }

  async handle(input: CreateDeviceInput): Promise<domainModels.device.Device> {
    const { name, status } = input.dto;

    const device = new domainModels.device.Device({
      id: uuid(),
      name,
      status,
    });

    const createdDevice = await this.repository.create(device);
    return createdDevice.toJSON() as domainModels.device.Device;
  }

  static getInstance = (): CreateDevice => {
    CreateDevice.instance =
      CreateDevice.instance ||
      new CreateDevice({
        deviceRepository: repositories.memory.Device.getInstance(),
      });

    return CreateDevice.instance;
  };
}
