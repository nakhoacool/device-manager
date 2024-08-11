import { models as domainModels } from '../../domain';

export interface DeviceUpdateDTO {
  id: string;
  name?: string;
  status?: domainModels.device.DeviceStatus;
}
