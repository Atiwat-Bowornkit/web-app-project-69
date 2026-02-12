// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. สร้าง User ตัวอย่าง
  const user = await prisma.user.upsert({
    where: { email: 'atiwat@example.com' },
    update: {},
    create: {
      email: 'atiwat@example.com',
      name: 'Atiwat Dev',
      password: 'password123',
    },
  })

  console.log('Created User:', user)

  // 2. สร้างวัตถุดิบ (Master Data)
  const egg = await prisma.ingredient.create({
    data: { name: 'ไข่ไก่', unit: 'ฟอง' }
  })
  const pork = await prisma.ingredient.create({
    data: { name: 'หมูสับ', unit: 'กรัม' }
  })

  // 3. สร้างสูตรอาหาร
  const recipe = await prisma.recipe.create({
    data: {
      title: 'ไข่เจียวหมูสับ',
      category: 'ทอด',
      description: 'เมนูสิ้นคิดแต่อร่อยมาก',
      steps: '1. ตอกไข่\n2. ใส่หมูสับและน้ำปลา\n3. ทอดไฟกลาง',
      authorId: user.id,
      ingredients: {
        create: [
          { ingredientId: egg.id, amount: "2" },
          { ingredientId: pork.id, amount: "50" }
        ]
      }
    }
  })

  console.log('Created Recipe:', recipe)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })