export enum DeviceStatus {
  ON = 'ON',
  OFF = 'OFF',
  UNKNOWN = 'UNKNOWN',
}

export interface DeviceProps {
  id: string;
  name: string;
  status: DeviceStatus;
}

export class Device {
  private static readonly uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get status(): DeviceStatus {
    return this.props.status;
  }

  public toJSON(): DeviceProps {
    return this.props;
  }

  constructor(private props: DeviceProps) {
    /* Validate Id */
    if (!Device.uuidRegex.test(props.id)) {
      throw new Error('Invalid device id: ' + props.id);
    }

    /* Validate status */
    if (!Object.values(DeviceStatus).includes(props.status)) {
      throw new Error('Invalid device status: ' + props.status);
    }
  }
}
