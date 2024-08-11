import { IncomingMessage, ServerResponse } from 'http';
import { device as deviceUseCases } from '../use-cases';
import { UnknownException } from '../exceptions';
import { ErrorMapper, SuccessMapper } from '../utils';

export class ListDevices {
  static instance: ListDevices | null = null;
  private useCaseListDevices: deviceUseCases.List;

  constructor({
    useCaseListDevices,
  }: {
    useCaseListDevices: deviceUseCases.List;
  }) {
    this.useCaseListDevices = useCaseListDevices;
  }

  async handle(request: IncomingMessage, response: ServerResponse) {
    try {
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const page = Number(url.searchParams.get('page'));
      const pageSize = Number(url.searchParams.get('pageSize'));
      if (page && pageSize) {
        const result = await this.useCaseListDevices.handle(page, pageSize);
        SuccessMapper.toSuccessResponse(200, result, response);
        response.end();
        return;
      }
      const result = await this.useCaseListDevices.handle();
      SuccessMapper.toSuccessResponse(200, result, response);
    } catch (error) {
      console.error(error);
      ErrorMapper.toErrorResponse(
        new UnknownException('List All devices failure'),
        response,
      );
    }

    response.end();
  }

  static getInstance = (): ListDevices => {
    ListDevices.instance =
      ListDevices.instance ||
      new ListDevices({
        useCaseListDevices: deviceUseCases.List.getInstance(),
      });

    return ListDevices.instance;
  };
}
