import { Category } from 'src/category/entities/category.entity';
import { getRepository } from 'typeorm';
import { faker } from '@faker-js/faker';

export const seedCategories = async () => {
  const categoryRepository = getRepository(Category);

  const categories = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.department(),
    description: faker.lorem.sentence(),
  }));

  await categoryRepository.save(categories);
};
