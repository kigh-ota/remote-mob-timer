import { TimerMetadata } from './TimerRepository';

export default interface TimerMetadataRepository {
  put(metadata: TimerMetadata): Promise<void>;
}
