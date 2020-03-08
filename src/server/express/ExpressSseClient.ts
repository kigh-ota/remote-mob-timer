import { Response } from 'express';
import SseClient from '../../common/SseClient';

export default interface ExpressSseClient extends SseClient {
  response: Response;
}
