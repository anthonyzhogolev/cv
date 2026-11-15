import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { SkillCategory, SkillLevel } from '../src/generated/prisma/enums.js';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const skills: { name: string; category: SkillCategory; level: SkillLevel }[] = [
  { name: 'TypeScript', category: SkillCategory.BACKEND, level: SkillLevel.EXPERT },
  { name: 'Node.js', category: SkillCategory.BACKEND, level: SkillLevel.EXPERT },
  { name: 'NestJS', category: SkillCategory.BACKEND, level: SkillLevel.ADVANCED },
  { name: 'GraphQL', category: SkillCategory.BACKEND, level: SkillLevel.ADVANCED },
  { name: 'PostgreSQL', category: SkillCategory.DATABASE, level: SkillLevel.ADVANCED },
  { name: 'Prisma', category: SkillCategory.DATABASE, level: SkillLevel.ADVANCED },
  { name: 'Docker', category: SkillCategory.DEVOPS, level: SkillLevel.INTERMEDIATE },
  { name: 'Git', category: SkillCategory.DEVOPS, level: SkillLevel.ADVANCED },
  { name: 'React', category: SkillCategory.FRONTEND, level: SkillLevel.INTERMEDIATE },
  { name: 'Коммуникация', category: SkillCategory.SOFT_SKILLS, level: SkillLevel.ADVANCED },
];

async function main() {
  const profile = await prisma.profile.upsert({
    where: { email: 'ivan.ivanov@example.com' },
    update: {},
    create: {
      fullName: 'Иван Иванов',
      title: 'Backend Developer (Node.js / TypeScript)',
      bio: 'Backend-разработчик, специализируюсь на Node.js, TypeScript и проектировании API. Люблю чистую архитектуру и автоматизацию.',
      email: 'ivan.ivanov@example.com',
      phone: '+7 (900) 123-45-67',
      location: 'Екатеринбург, Россия',
      github: 'https://github.com/ivanivanov',
      linkedin: 'https://linkedin.com/in/ivanivanov',
      telegram: 'https://t.me/ivanivanov',
    },
  });

  await prisma.$transaction([
    prisma.experience.deleteMany({ where: { profileId: profile.id } }),
    prisma.profileSkill.deleteMany({ where: { profileId: profile.id } }),
    prisma.project.deleteMany({ where: { profileId: profile.id } }),
  ]);

  await prisma.experience.createMany({
    data: [
      {
        profileId: profile.id,
        company: 'ООО «ТехноСофт»',
        position: 'Backend Developer',
        description: 'Разработка и поддержка микросервисов на NestJS, проектирование GraphQL API, работа с PostgreSQL.',
        startDate: new Date('2023-06-01'),
        endDate: null,
      },
      {
        profileId: profile.id,
        company: 'АО «Диджитал Решения»',
        position: 'Node.js Developer',
        description: 'Разработка REST API на Express/NestJS, интеграции с внешними сервисами, покрытие кода тестами.',
        startDate: new Date('2021-09-01'),
        endDate: new Date('2023-05-31'),
      },
      {
        profileId: profile.id,
        company: 'Стартап «АппИдея»',
        position: 'Junior Backend Developer',
        description: 'Участие в разработке MVP: авторизация, CRUD-сервисы, первые шаги с Docker и CI.',
        startDate: new Date('2020-03-01'),
        endDate: new Date('2021-08-31'),
      },
    ],
  });

  for (const { name, category, level } of skills) {
    const skill = await prisma.skill.upsert({
      where: { name },
      update: { category },
      create: { name, category },
    });
    await prisma.profileSkill.upsert({
      where: { profileId_skillId: { profileId: profile.id, skillId: skill.id } },
      update: { level },
      create: { profileId: profile.id, skillId: skill.id, level },
    });
  }

  await prisma.project.createMany({
    data: [
      {
        profileId: profile.id,
        name: 'Цифровая визитка',
        description: 'Backend-приложение на NestJS с GraphQL API и Prisma, автоматическое наполнение БД при запуске в Docker.',
        techStack: ['NestJS', 'GraphQL', 'Prisma', 'PostgreSQL', 'Docker'],
        repoUrl: 'https://github.com/ivanivanov/cv',
        demoUrl: null,
      },
      {
        profileId: profile.id,
        name: 'Сервис уведомлений',
        description: 'Микросервис рассылки уведомлений через email и Telegram с очередями и повторными попытками.',
        techStack: ['Node.js', 'NestJS', 'BullMQ', 'Redis'],
        repoUrl: 'https://github.com/ivanivanov/notifier',
        demoUrl: null,
      },
      {
        profileId: profile.id,
        name: 'API для интернет-магазина',
        description: 'GraphQL API каталога и заказов с фильтрацией, пагинацией и кэшированием.',
        techStack: ['NestJS', 'GraphQL', 'PostgreSQL', 'Prisma'],
        repoUrl: 'https://github.com/ivanivanov/shop-api',
        demoUrl: 'https://shop-api.example.com/graphql',
      },
      {
        profileId: profile.id,
        name: 'Бот-помощник в Telegram',
        description: 'Бот для трекинга привычек с напоминаниями и статистикой.',
        techStack: ['TypeScript', 'grammY', 'SQLite'],
        repoUrl: 'https://github.com/ivanivanov/habit-bot',
        demoUrl: 'https://t.me/habit_helper_bot',
      },
    ],
  });

  console.log('Seed completed: profile, experience, skills and projects are in place.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
