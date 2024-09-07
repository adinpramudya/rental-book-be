import { Book } from 'src/book/entities/book.entity';
import { getRepository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Category } from 'src/category/entities/category.entity';
import { Publisher } from 'src/publisher/entities/publisher.entity';
import { BookStatus } from 'src/enum/BookState';

export const seedBooks = async () => {
  const bookRepository = getRepository(Book);
  const categoryRepository = getRepository(Category);
  const publisherRepository = getRepository(Publisher);

  // Fetch categories and publishers
  const categories = await categoryRepository.find();
  const publishers = await publisherRepository.find();

  // Check if categories and publishers exist
  if (categories.length === 0 || publishers.length === 0) {
    throw new Error(
      'No categories or publishers found. Please seed them first.',
    );
  }

  // Create books
  const books = Array.from({ length: 20 }).map(() => ({
    title: faker.lorem.words(3),
    author: faker.name.fullName(),
    isbn: faker.datatype.string(10),
    isbn13: faker.datatype.string(13),
    stock: faker.datatype.number({ min: 1, max: 100 }),
    publicationDate: faker.date.past(),
    countPage: faker.datatype.number({ min: 50, max: 1000 }),
    language: faker.word.noun(), // Ensure this returns a string
    description: faker.lorem.paragraph(),
    coverBook: faker.image.imageUrl(),
    state: faker.helpers.arrayElement(Object.values(BookStatus)) as BookStatus, // Correct enum assignment
    category: faker.helpers.arrayElement(categories),
    publisher: faker.helpers.arrayElement(publishers),
  }));

  // Save books to the repository
  await bookRepository.save(books);
};
