import { repositories } from '../../data-access';
import {
  repositories as domainRepositories,
  models as domainModels,
} from '../../domain';
import { DeviceDeleteDTO } from '../../controllers/dto';
import { NotFoundException } from '../../exceptions';

export class DeleteDeviceInput {
  constructor(public readonly dto: DeviceDeleteDTO) {}
}

export class DeleteDevice {
  static instance: DeleteDevice | null = null;
  private readonly repository: domainRepositories.DeviceRepository;

  constructor({
    deviceRepository,
  }: {
    deviceRepository: domainRepositories.DeviceRepository;
  }) {
    this.repository = deviceRepository;
  }

  async handle(
    input: DeleteDeviceInput,
  ): Promise<domainModels.device.Device | string> {
    const { id } = input.dto;
    const device = await this.repository.get(id);

    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    await this.repository.delete(id);

    return `Device with id ${id} has been deleted`;
  }
  static getInstance = (): DeleteDevice => {
    DeleteDevice.instance =
      DeleteDevice.instance ||
      new DeleteDevice({
        deviceRepository: repositories.memory.Device.getInstance(),
      });

    return DeleteDevice.instance;
  };
}
