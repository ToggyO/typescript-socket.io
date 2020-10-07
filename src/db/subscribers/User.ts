import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';

@EventSubscriber()
export class User implements EntitySubscriberInterface<any> {}
