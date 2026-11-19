import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { SkillCategory, SkillLevel } from '../src/generated/prisma/enums.js';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const skills: { name: string; category: SkillCategory; level: SkillLevel }[] = [
  {
    name: 'TypeScript',
    category: SkillCategory.COMMON,
    level: SkillLevel.EXPERT,
  },
  {
    name: 'Node.js',
    category: SkillCategory.BACKEND,
    level: SkillLevel.EXPERT,
  },
  {
    name: 'NestJS',
    category: SkillCategory.BACKEND,
    level: SkillLevel.ADVANCED,
  },
  {
    name: 'GraphQL',
    category: SkillCategory.BACKEND,
    level: SkillLevel.ADVANCED,
  },
  {
    name: 'PostgreSQL',
    category: SkillCategory.DATABASE,
    level: SkillLevel.ADVANCED,
  },
  {
    name: 'Prisma',
    category: SkillCategory.DATABASE,
    level: SkillLevel.ADVANCED,
  },
  {
    name: 'Docker',
    category: SkillCategory.DEVOPS,
    level: SkillLevel.INTERMEDIATE,
  },
  { name: 'Git', category: SkillCategory.DEVOPS, level: SkillLevel.ADVANCED },
  {
    name: 'React',
    category: SkillCategory.FRONTEND,
    level: SkillLevel.INTERMEDIATE,
  },
  {
    name: 'Коммуникация',
    category: SkillCategory.SOFT_SKILLS,
    level: SkillLevel.ADVANCED,
  },
];

const MY_SKILLS = ['React', 'TypeScript', 'NestJS', 'GraphQL', 'Git'];

async function main() {
  const profile = await prisma.profile.upsert({
    where: { email: 'ale7496@gmail.com' },
    update: {
      fullName: 'Жоголев Антон',
      title: 'Frontend-разработчик (React, Typescript)',
      bio: 'Frontend-разработчик, cпециализируюсь на разработке внутренних банковских сервисов. ',
      email: 'ale7496@gmail.com',
      phone: '+7 (917) 752-26-04',
      location: 'Уфа, Россия',
      github: 'https://github.com/anthonyzhogolev',
      linkedin: 'www.linkedin.com/in/anton-zhogolev-8739b984',
      telegram: 'https://t.me/anthonyzhogolev',
    },
    create: {
      fullName: 'Жоголев Антон',
      title: 'Frontend-разработчик (React, Typescript)',
      bio: 'Frontend-разработчик, cпециализируюсь на разработке внутренних банковских сервисов. ',
      email: 'ale7496@gmail.com',
      phone: '+7 (917) 752-26-04',
      location: 'Уфа, Россия',
      github: 'https://github.com/anthonyzhogolev',
      linkedin: 'www.linkedin.com/in/anton-zhogolev-8739b984',
      telegram: 'https://t.me/anthonyzhogolev',
    },
  });

  await prisma.$transaction([
    prisma.experience.deleteMany({ where: { profileId: profile.id } }),
    prisma.profileSkill.deleteMany({ where: { profileId: profile.id } }),
    prisma.project.deleteMany({ where: { profileId: profile.id } }),
  ]);

  const { id: gpbExpId } = await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'Газпромбанк, АO',
      position: 'Senior Frontend-разработчик',
      description:
        'Дашборд для сотрудников банка, и сотрудников кол-центра для обслуживания физических и юр. лиц',
      startDate: new Date('2023-06-01'),
      endDate: null,
    },
  });

  const { id: itOneExpId } = await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'IT_One',
      position: 'Middle Frontend-разработчик',
      description:
        '"ВТБ. Личный Кабинет" - веб-приложение банка ВТБ для управления финансами',
      startDate: new Date('2021-06-01'),
      endDate: new Date('2023-05-31'),
    },
  });

  const { id: astralExpId } = await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'Астрал-Софт',
      position: 'Junior/Middle Frontend-разработчик',
      description:
        'веб-сервис для сдачи электронной отчетности в контролирующие органы (ФНС, СФР, Росстат)',
      startDate: new Date('2019-02-01'),
      endDate: new Date('2021-06-01'),
    },
  });

  // await prisma.experience.createMany({
  //   data: [
  //     {
  //       profileId: profile.id,
  //       company: 'Газпромбанк, АO',
  //       position: 'Senior Frontend-разработчик',
  //       description:
  //         'Дашборд для сотрудников банка, и сотрудников кол-центра для обслуживания физических и юр. лиц',
  //       startDate: new Date('2023-06-01'),
  //       endDate: null,
  //     },
  //     {
  //       profileId: profile.id,
  //       company: 'IT_One',
  //       position: 'Middle Frontend-разработчик',
  //       description:
  //         '"ВТБ. Личный Кабинет" - веб-приложение банка ВТБ для управления финансами',
  //       startDate: new Date('2021-06-01'),
  //       endDate: new Date('2023-05-31'),
  //     },
  //     {
  //       profileId: profile.id,
  //       company: 'Астрал-Софт',
  //       position: 'Junior/Middle Frontend-разработчик',
  //       description:
  //         'веб-сервис для сдачи электронной отчетности в контролирующие органы (ФНС, СФР, Росстат)',
  //       startDate: new Date('2019-02-01'),
  //       endDate: new Date('2021-06-01'),
  //     },
  //   ],
  // });

  for (const { name, category, level } of skills) {
    const skill = await prisma.skill.upsert({
      where: { name },
      update: { category },
      create: { name, category },
    });
    if (!MY_SKILLS.includes(skill.name)) continue;
    await prisma.profileSkill.upsert({
      where: {
        profileId_skillId: { profileId: profile.id, skillId: skill.id },
      },
      update: { level },
      create: { profileId: profile.id, skillId: skill.id, level },
    });
  }

  await prisma.project.createMany({
    data: [
      {
        profileId: profile.id,
        name: 'Цифровая визитка',
        description:
          'Backend-приложение «цифровая визитка»: GraphQL API с информацией о специалисте — профиль, опыт работы, навыки и проекты.',
        techStack: ['NestJs', 'GraphQL', 'Apollo'],
        repoUrl: null,
        demoUrl: 'https://cv-api-svru.onrender.com/graphql',
      },
      {
        profileId: profile.id,
        experienceId: gpbExpId,
        name: 'Дашборд 360',
        description:
          'Дашборд для сотрудников банка, и сотрудников кол-центра для обслуживания физических и юр. лиц',
      },
      {
        profileId: profile.id,
        experienceId: gpbExpId,
        name: 'МСБ',
        description:
          'Админ-панель для сотрудников для обслуживания малого и среднего бизнеса',
      },
      {
        profileId: profile.id,
        experienceId: itOneExpId,
        name: 'ВТБ Онлайн',
        description:
          'Личный кабинет банка ВТБ',
      },
      {
        profileId: profile.id,
        experienceId: itOneExpId,
        name: 'Реестр Углеродных единиц',
        description:
          'Система учета климатических проектов, углеродных единиц (УЕ) и единиц выполнения квот (ЕВК), а также операций с ними',
      },
    ],
  });
}
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
