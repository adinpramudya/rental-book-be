import { User } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';

export const seedUsers = async () => {
  const userRepository = getRepository(User);
  const roleRepository = getRepository(Role);

  const roles = await roleRepository.find();

  const users = [
    {
      name: 'admin',
      email: 'admin@gmail.com',
      password: 'password123',
      username: 'usera',
      createdBy: 'admin',
      updatedBy: 'admin',
      role: roles.find((role) => role.code === 'USER'),
    },
    // Add more users if needed
  ];

  for (const user of users) {
    await userRepository.save(user);
  }
};
