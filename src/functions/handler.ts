import { App } from '../app';

const app = new App();

export const handler = app.getServerlessHandler();
