import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { device as deviceUseCases } from '../use-cases';
import { ErrorMapper, SuccessMapper } from '../utils';

export class GetDevice {
  static instance: GetDevice | null = null;
  private useCaseGetDevice: deviceUseCases.Get;

  constructor({ useCaseGetDevice }: { useCaseGetDevice: deviceUseCases.Get }) {
    this.useCaseGetDevice = useCaseGetDevice;
  }

  async handle(request: IncomingMessage, response: ServerResponse) {
    try {
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const id = url.pathname.split('/')[2];

      const device = await this.useCaseGetDevice.handle({ dto: { id } });

      SuccessMapper.toSuccessResponse(200, device, response);
    } catch (error) {
      console.error(error);
      ErrorMapper.toErrorResponse(error as Error, response);
    }
    response.end();
  }

  static getInstance = (): GetDevice => {
    GetDevice.instance =
      GetDevice.instance ||
      new GetDevice({
        useCaseGetDevice: deviceUseCases.Get.getInstance(),
      });

    return GetDevice.instance;
  };
}
