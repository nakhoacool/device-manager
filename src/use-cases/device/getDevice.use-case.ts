import { repositories } from '../../data-access';
import {
  repositories as domainRepositories,
  models as domainModels,
} from '../../domain';
import { DeviceGetIdDTO } from '../../controllers/dto/device.getid';
import { NotFoundException } from '../../exceptions';

export class GetDeviceInput {
  constructor(public readonly dto: DeviceGetIdDTO) {}
}

export class GetDevice {
  static instance: GetDevice | null = null;
  private readonly repository: domainRepositories.DeviceRepository;

  constructor({
    deviceRepository,
  }: {
    deviceRepository: domainRepositories.DeviceRepository;
  }) {
    this.repository = deviceRepository;
  }

  async handle(input: GetDeviceInput): Promise<domainModels.device.Device> {
    const { id } = input.dto;
    const device = await this.repository.get(id);

    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    return device.toJSON() as domainModels.device.Device;
  }

  static getInstance = (): GetDevice => {
    GetDevice.instance =
      GetDevice.instance ||
      new GetDevice({
        deviceRepository: repositories.memory.Device.getInstance(),
      });

    return GetDevice.instance;
  };
}
