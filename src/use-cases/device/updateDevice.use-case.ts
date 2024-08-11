import { repositories } from '../../data-access';
import {
  repositories as domainRepositories,
  models as domainModels,
} from '../../domain';
import { DeviceUpdateDTO } from '../../controllers/dto';
import { NotFoundException } from '../../exceptions';

export class UpdateDeviceInput {
  constructor(public readonly dto: DeviceUpdateDTO) {}
}

export class UpdateDevice {
  static instance: UpdateDevice | null = null;
  private readonly repository: domainRepositories.DeviceRepository;

  constructor({
    deviceRepository,
  }: {
    deviceRepository: domainRepositories.DeviceRepository;
  }) {
    this.repository = deviceRepository;
  }

  async handle(input: UpdateDeviceInput): Promise<domainModels.device.Device> {
    const { id, name, status } = input.dto;
    const device = await this.repository.get(id);

    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    const updatedDevice = new domainModels.device.Device({
      id: device.id,
      name: name || device.name,
      status: status || device.status,
    });

    const executedUpdate = await this.repository.update(updatedDevice);
    return executedUpdate.toJSON() as domainModels.device.Device;
  }

  static getInstance = (): UpdateDevice => {
    UpdateDevice.instance =
      UpdateDevice.instance ||
      new UpdateDevice({
        deviceRepository: repositories.memory.Device.getInstance(),
      });

    return UpdateDevice.instance;
  };
}
