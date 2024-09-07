import { Publisher } from 'src/publisher/entities/publisher.entity';
import { getRepository } from 'typeorm';
import { faker } from '@faker-js/faker';

export const seedPublishers = async () => {
  const publisherRepository = getRepository(Publisher);

  const publishers = Array.from({ length: 5 }).map(() => ({
    name: faker.company.name(),
    address: faker.address.streetAddress(),
  }));

  await publisherRepository.save(publishers);
};
