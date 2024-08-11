import { models as domainModels } from '../../domain';

export interface DeviceCreateDTO {
  name: string;
  status: domainModels.device.DeviceStatus;
}
