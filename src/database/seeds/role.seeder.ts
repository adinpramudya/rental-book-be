import { Role } from 'src/role/entities/role.entity';
import { getRepository } from 'typeorm';

export const seedRoles = async () => {
  const roleRepository = getRepository(Role);

  const roles = [
    { name: 'Admin', code: 'ADMIN' },
    { name: 'User', code: 'USER' },
  ];

  for (const role of roles) {
    await roleRepository.save(role);
  }
};
