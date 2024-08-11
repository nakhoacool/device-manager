import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { device as deviceUseCases } from '../use-cases';
import { ErrorMapper, SuccessMapper } from '../utils';

export class DeleteDevice {
  static instance: DeleteDevice | null = null;
  private useCaseDeleteDevice: deviceUseCases.Delete;

  constructor({
    useCaseDeleteDevice,
  }: {
    useCaseDeleteDevice: deviceUseCases.Delete;
  }) {
    this.useCaseDeleteDevice = useCaseDeleteDevice;
  }

  async handle(request: IncomingMessage, response: ServerResponse) {
    try {
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const id = url.pathname.split('/')[2];

      const device = await this.useCaseDeleteDevice.handle({ dto: { id } });

      SuccessMapper.toSuccessResponse(200, { message: device }, response);
    } catch (error) {
      console.error(error);
      ErrorMapper.toErrorResponse(error as Error, response);
    }

    response.end();
  }

  static getInstance = (): DeleteDevice => {
    DeleteDevice.instance =
      DeleteDevice.instance ||
      new DeleteDevice({
        useCaseDeleteDevice: deviceUseCases.Delete.getInstance(),
      });

    return DeleteDevice.instance;
  };
}
