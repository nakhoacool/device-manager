import { device } from '../models';

export interface DeviceRepository {
  create(device: device.Device): Promise<device.Device>;
  get(id: string): Promise<device.Device | null>;
  list(): Promise<Array<device.Device>>;
  update(device: device.Device): Promise<device.Device>;
  delete(id: string): Promise<device.Device | null>;
  pagination(
    page: number,
    limit: number,
  ): Promise<{ total: number; data: device.Device[] }>;
}
