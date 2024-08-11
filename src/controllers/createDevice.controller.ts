import { IncomingMessage, ServerResponse } from 'http';
import { device as deviceUseCases } from '../use-cases';
import { BadRequestException } from '../exceptions';
import { ErrorMapper, SuccessMapper } from '../utils';
import { DeviceStatus } from '../domain/models/device';

export class CreateDevice {
  static instance: CreateDevice | null = null;
  private useCaseCreateDevice: deviceUseCases.Create;

  constructor({
    useCaseCreateDevice,
  }: {
    useCaseCreateDevice: deviceUseCases.Create;
  }) {
    this.useCaseCreateDevice = useCaseCreateDevice;
  }

  async handle(request: IncomingMessage, response: ServerResponse) {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const { name, status } = JSON.parse(body);

        if (!name || name.trim() === '') {
          throw new BadRequestException('Name cannot be empty');
        }

        if (!status || status.trim() === '') {
          throw new BadRequestException('Status cannot be empty');
        }

        if (!Object.values(DeviceStatus).includes(status)) {
          throw new BadRequestException('Invalid status');
        }

        const device = await this.useCaseCreateDevice.handle({
          dto: { name, status },
        });
        SuccessMapper.toSuccessResponse(201, device, response);
      } catch (error) {
        console.error(error);
        ErrorMapper.toErrorResponse(error as Error, response);
      }
      response.end();
    });
  }

  static getInstance = (): CreateDevice => {
    CreateDevice.instance =
      CreateDevice.instance ||
      new CreateDevice({
        useCaseCreateDevice: deviceUseCases.Create.getInstance(),
      });

    return CreateDevice.instance;
  };
}
