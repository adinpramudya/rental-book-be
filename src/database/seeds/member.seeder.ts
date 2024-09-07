import { Member } from 'src/member/entities/member.entity';
import { getRepository } from 'typeorm';
import { faker } from '@faker-js/faker';

export const seedMembers = async () => {
  const memberRepository = getRepository(Member);

  const members = Array.from({ length: 20 }).map(() => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    alamat: faker.address.streetAddress(),
    phoneNumber: faker.phone.number(),
    createdBy: faker.internet.userName(),
    updatedBy: faker.internet.userName(),
    profilePhoto: faker.image.avatar(),
  }));

  await memberRepository.save(members);
};
