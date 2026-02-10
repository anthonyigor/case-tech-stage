import { PrismaClient, ProcessStatus, ProcessType, ToolType } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Limpeza
  await prisma.processOwner.deleteMany();
  await prisma.processTool.deleteMany();
  await prisma.processDoc.deleteMany();
  await prisma.process.deleteMany();
  await prisma.people.deleteMany();
  await prisma.team.deleteMany();
  await prisma.area.deleteMany();

  //users
  await prisma.user.create({
    data: {
      username: "master",
      password: await bcrypt.hash('123456', 10),
      email: 'master@stage.com'
    }
  })

  // Teams
  const rhTeam = await prisma.team.create({
    data: { name: 'RH', description: 'Recursos Humanos' },
  });

  const finTeam = await prisma.team.create({
    data: { name: 'Financeiro', description: 'Financeiro Corporativo' },
  });

  // People
  const ana = await prisma.people.create({
    data: { name: 'Ana Souza', email: 'ana@empresa.com', team_id: rhTeam.id },
  });

  const bruno = await prisma.people.create({
    data: { name: 'Bruno Lima', email: 'bruno@empresa.com', team_id: rhTeam.id },
  });

  const carla = await prisma.people.create({
    data: { name: 'Carla Mendes', email: 'carla@empresa.com', team_id: finTeam.id },
  });

  const diego = await prisma.people.create({
    data: { name: 'Diego Alves', email: 'diego@empresa.com', team_id: finTeam.id },
  });

  // Areas
  const areaPeople = await prisma.area.create({
    data: { name: 'Pessoas', description: 'Processos de RH' },
  });

  const areaFinance = await prisma.area.create({
    data: { name: 'Financeiro', description: 'Processos financeiros' },
  });

  // Processes – Área Pessoas
  const recrutamento = await prisma.process.create({
    data: {
      title: 'Recrutamento e Seleção',
      area_id: areaPeople.id,
      type: ProcessType.MANUAL,
      status: ProcessStatus.ACTIVE,
      position: 0,
    },
  });

  const triagem = await prisma.process.create({
    data: {
      title: 'Triagem de Currículos',
      area_id: areaPeople.id,
      parent_id: recrutamento.id,
      position: 0,
    },
  });

  const entrevistas = await prisma.process.create({
    data: {
      title: 'Entrevistas',
      area_id: areaPeople.id,
      parent_id: recrutamento.id,
      position: 1,
    },
  });

   await prisma.process.create({
    data: {
      title: 'Entrevista Técnica',
      area_id: areaPeople.id,
      parent_id: entrevistas.id,
      position: 0,
    },
  });

  await prisma.process.create({
    data: {
      title: 'Entrevista Comportamental',
      area_id: areaPeople.id,
      parent_id: entrevistas.id,
      position: 1,
    },
  });

  await prisma.process.create({
    data: {
      title: 'Proposta ao Candidato',
      area_id: areaPeople.id,
      parent_id: recrutamento.id,
      position: 2,
    },
  });

  // Processes – Área Financeiro
  const contasPagar = await prisma.process.create({
    data: {
      title: 'Contas a Pagar',
      area_id: areaFinance.id,
      status: ProcessStatus.ACTIVE,
      position: 0,
    },
  });

  await prisma.process.create({
    data: {
      title: 'Recebimento de Notas',
      area_id: areaFinance.id,
      parent_id: contasPagar.id,
      position: 0,
    },
  });

  const pagamentos = await prisma.process.create({
    data: {
      title: 'Pagamentos',
      area_id: areaFinance.id,
      parent_id: contasPagar.id,
      position: 1,
    },
  });

  // Tools
  await prisma.processTool.createMany({
    data: [
      {
        process_id: recrutamento.id,
        name: 'ATS Gupy',
        type: ToolType.SYSTEM,
        url: 'https://gupy.io',
      },
      {
        process_id: triagem.id,
        name: 'Excel',
        type: ToolType.TOOL,
      },
      {
        process_id: pagamentos.id,
        name: 'ERP Totvs',
        type: ToolType.SYSTEM,
      },
    ],
  });

  // Docs
  await prisma.processDoc.createMany({
    data: [
      {
        process_id: recrutamento.id,
        title: 'Política de Recrutamento',
        url: 'https://docs.empresa.com/politica-recrutamento',
      },
      {
        process_id: entrevistas.id,
        title: 'Roteiro de Entrevistas',
        url: 'https://docs.empresa.com/roteiro-entrevistas',
      },
    ],
  });

  // Owners
  await prisma.processOwner.createMany({
    data: [
      { process_id: recrutamento.id, people_id: ana.id },
      { process_id: entrevistas.id, people_id: bruno.id },
      { process_id: contasPagar.id, people_id: carla.id },
      { process_id: pagamentos.id, people_id: diego.id },
    ],
  });

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
