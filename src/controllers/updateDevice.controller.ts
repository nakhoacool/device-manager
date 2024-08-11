import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { device as deviceUseCases } from '../use-cases';
import { BadRequestException } from '../exceptions';
import { ErrorMapper, SuccessMapper } from '../utils';
import { DeviceStatus } from '../domain/models/device';

export class UpdateDevice {
  static instance: UpdateDevice | null = null;
  private useCaseUpdateDevice: deviceUseCases.Update;

  constructor({
    useCaseUpdateDevice,
  }: {
    useCaseUpdateDevice: deviceUseCases.Update;
  }) {
    this.useCaseUpdateDevice = useCaseUpdateDevice;
  }

  async handle(request: IncomingMessage, response: ServerResponse) {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.pathname.split('/')[2];

        const { name, status } = JSON.parse(body);

        if (name) {
          if (name.trim() === '') {
            throw new BadRequestException('Name cannot be empty');
          }
        }

        if (status) {
          if (status.trim() === '') {
            throw new BadRequestException('Status cannot be empty');
          }

          if (!Object.values(DeviceStatus).includes(status)) {
            throw new BadRequestException('Invalid status');
          }
        }

        const device = await this.useCaseUpdateDevice.handle({
          dto: { id, name, status },
        });

        SuccessMapper.toSuccessResponse(200, device, response);
      } catch (error) {
        console.error(error);
        ErrorMapper.toErrorResponse(error as Error, response);
      }
      response.end();
    });
  }

  static getInstance = (): UpdateDevice => {
    UpdateDevice.instance =
      UpdateDevice.instance ||
      new UpdateDevice({
        useCaseUpdateDevice: deviceUseCases.Update.getInstance(),
      });

    return UpdateDevice.instance;
  };
}
