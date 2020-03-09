import SseClient from '../../common/SseClient';
import { Request, Response } from 'express';

export default class ExpressSseClient implements SseClient {
  private ip: string;
  private userAgent: string;

  constructor(req: Request, private readonly res: Response) {
    this.ip = req.ip;
    this.userAgent = req.header('User-Agent');
  }

  public getInfo() {
    return { ip: this.ip, userAgent: this.userAgent };
  }

  public send(payload: string) {
    this.res.write(payload);
  }
}
