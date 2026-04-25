import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const category = await prisma.category.upsert({
    where: { name: 'Électronique' },
    update: {},
    create: {
      name: 'Électronique',
      description: 'Appareils électroniques et gadgets'
    }
  })

  const supplier = await prisma.supplier.create({
    data: {
      name: 'Fournisseur Global Inc',
      email: 'contact@global.com',
      phone: '0102030405',
    }
  })

  console.log('Seed completed!', { admin: admin.email, category: category.name })
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
