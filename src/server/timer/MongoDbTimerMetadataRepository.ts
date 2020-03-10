import { Collection, MongoClient } from 'mongodb';
import TimerMetadataRepository from './TimerMetadataRepository';
import { TimerMetadata } from './TimerRepository';

const DB_NAME = 'remote-mob-timer';
const COLLECTION_NAME = 'timers';

export default class MongoDbTimerMetadataRepository
  implements TimerMetadataRepository {
  private coll: Collection;

  constructor(mongoClient: MongoClient) {
    this.coll = mongoClient.db(DB_NAME).collection(COLLECTION_NAME);
    this.coll.createIndex({ id: 1 }, { unique: true });
  }

  public async put(metadata: TimerMetadata) {
    this.coll.insertOne(metadata);
  }

  public async list() {
    return (await this.coll.find().toArray()).map(d => ({
      id: d.id,
      name: d.name,
    }));
  }
}
