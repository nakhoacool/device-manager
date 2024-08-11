import { MemoryDataSource } from '../../data-sources';
import { models as domainModels } from '../../../domain';

export class DeviceRepository {
  static instance: DeviceRepository | null = null;
  private static entity = 'device';
  private readonly memoryDataSource: MemoryDataSource;

  constructor({ memoryDataSource }: { memoryDataSource: MemoryDataSource }) {
    this.memoryDataSource = memoryDataSource;
  }

  async create(
    device: domainModels.device.Device,
  ): Promise<domainModels.device.Device> {
    return this.memoryDataSource.create<domainModels.device.Device>(
      DeviceRepository.entity,
      device,
    );
  }

  async get(id: string): Promise<domainModels.device.Device | null> {
    return this.memoryDataSource.get<domainModels.device.Device>(
      DeviceRepository.entity,
      id,
    );
  }

  async list(): Promise<domainModels.device.Device[]> {
    return this.memoryDataSource.list<domainModels.device.Device>(
      DeviceRepository.entity,
    );
  }

  async pagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ total: number; data: domainModels.device.Device[] }> {
    return this.memoryDataSource.pagination<domainModels.device.Device>(
      DeviceRepository.entity,
      page,
      limit,
    );
  }

  async update(
    device: domainModels.device.Device,
  ): Promise<domainModels.device.Device> {
    return this.memoryDataSource.update<domainModels.device.Device>(
      DeviceRepository.entity,
      device,
    );
  }

  async delete(id: string): Promise<domainModels.device.Device | null> {
    return this.memoryDataSource.delete(DeviceRepository.entity, id);
  }

  static getInstance = (): DeviceRepository => {
    DeviceRepository.instance =
      DeviceRepository.instance ||
      new DeviceRepository({
        memoryDataSource: MemoryDataSource.getInstance(),
      });

    return DeviceRepository.instance;
  };
}
