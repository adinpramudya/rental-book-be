import 'reflect-metadata';
import { seedCategories } from './category.seeder';
import { seedPublishers } from './publisher.seeder';
import { seedBooks } from './book.seeder';
import { seedMembers } from './member.seeder';
import { seedRoles } from './role.seeder';
import { seedUsers } from './user.seeder';
import { AppDataSource } from 'src/data-source';

const runSeeders = async () => {
  try {
    await AppDataSource.initialize(); // Use AppDataSource for initialization
    await seedCategories();
    await seedPublishers();
    await seedBooks();
    await seedMembers();
    await seedRoles();
    await seedUsers();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit();
  }
};

runSeeders();
