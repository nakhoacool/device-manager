import { repositories } from '../../data-access';
import {
  repositories as domainRepositories,
  models as domainModels,
} from '../../domain';

export class ListDevices {
  static instance: ListDevices | null = null;
  private readonly repository: domainRepositories.DeviceRepository;

  constructor({
    deviceRepository,
  }: {
    deviceRepository: domainRepositories.DeviceRepository;
  }) {
    this.repository = deviceRepository;
  }

  async handle(
    page?: number,
    pageSize?: number,
  ): Promise<{ total: number; data: domainModels.device.Device[] }> {
    if (page && pageSize) {
      const dbDevices = await this.repository.pagination(page, pageSize);

      return {
        total: dbDevices.total,
        data: dbDevices.data.map(
          (device) => device.toJSON() as domainModels.device.Device,
        ),
      };
    }
    const dbDevices = await this.repository.list();

    return {
      total: dbDevices.length,
      data: dbDevices.map(
        (device) => device.toJSON() as domainModels.device.Device,
      ),
    };
  }

  static getInstance = (): ListDevices => {
    ListDevices.instance =
      ListDevices.instance ||
      new ListDevices({
        deviceRepository: repositories.memory.Device.getInstance(),
      });

    return ListDevices.instance;
  };
}
