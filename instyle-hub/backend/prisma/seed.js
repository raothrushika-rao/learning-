import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.designer.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users & designers
  const designers = [
    {
      name: 'Alexandra Voss',
      email: 'alexandra@example.com',
      password: await bcrypt.hash('password123', 10),
      brandName: 'Alexandra Voss Bridal',
      specialty: 'bridal',
      bio: 'Luxury bridal designer with 10+ years experience creating stunning wedding gowns',
      pricingRange: '$1000-$3000',
      image: 'https://via.placeholder.com/400x300?text=Alexandra+Voss'
    },
    {
      name: 'Monica Soriano',
      email: 'monica@example.com',
      password: await bcrypt.hash('password123', 10),
      brandName: 'Monica Soriano Couture',
      specialty: 'formal',
      bio: 'Evening gown specialist creating red carpet worthy pieces',
      pricingRange: '$800-$2500',
      image: 'https://via.placeholder.com/400x300?text=Monica+Soriano'
    },
    {
      name: 'Rami Al Ali',
      email: 'rami@example.com',
      password: await bcrypt.hash('password123', 10),
      brandName: 'Rami Al Ali',
      specialty: 'bridal',
      bio: 'Designer of luxury bridal and occasion wear',
      pricingRange: '$1200-$3500',
      image: 'https://via.placeholder.com/400x300?text=Rami+Al+Ali'
    },
    {
      name: 'Jenny Packham',
      email: 'jenny@example.com',
      password: await bcrypt.hash('password123', 10),
      brandName: 'Jenny Packham',
      specialty: 'bridal',
      bio: 'Timeless and romantic bridal designs',
      pricingRange: '$1500-$4000',
      image: 'https://via.placeholder.com/400x300?text=Jenny+Packham'
    },
    {
      name: 'Grace Chen',
      email: 'grace@example.com',
      password: await bcrypt.hash('password123', 10),
      brandName: 'Grace Chen Design',
      specialty: 'casual',
      bio: 'Contemporary everyday fashion with artistic flair',
      pricingRange: '$200-$800',
      image: 'https://via.placeholder.com/400x300?text=Grace+Chen'
    },
    {
      name: 'David Tutera',
      email: 'david@example.com',
      password: await bcrypt.hash('password123', 10),
      brandName: 'David Tutera Design',
      specialty: 'formal',
      bio: 'High-end formal wear and custom tailoring',
      pricingRange: '$1000-$5000',
      image: 'https://via.placeholder.com/400x300?text=David+Tutera'
    }
  ];

  // Create designers
  const createdDesigners = [];
  for (const designer of designers) {
    const { name, email, password, brandName, specialty, bio, pricingRange, image } = designer;
    
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        password,
        role: 'designer'
      }
    });

    const designerProfile = await prisma.designer.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        brandName,
        specialty,
        bio,
        pricingRange,
        image,
        rating: Math.random() * (5 - 4) + 4, // Random between 4-5
        followers: Math.floor(Math.random() * 2000) + 500,
        projectCount: Math.floor(Math.random() * 200) + 50
      }
    });

    createdDesigners.push({ user, designerProfile });
  }

  // Create sample customer
  const customer = await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'customer'
    }
  });

  // Create sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      id: uuidv4(),
      customerId: customer.id,
      designerId: createdDesigners[0].designerProfile.id,
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'confirmed',
      notes: 'Wedding dress consultation for spring wedding'
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      id: uuidv4(),
      customerId: customer.id,
      designerId: createdDesigners[1].designerProfile.id,
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      status: 'pending',
      notes: 'Evening gown fitting for gala event'
    }
  });

  // Create sample reviews
  await prisma.review.create({
    data: {
      id: uuidv4(),
      customerId: customer.id,
      designerId: createdDesigners[0].designerProfile.id,
      rating: 5,
      comment: 'Alexandra created the most beautiful wedding dress! Absolutely stunning work and incredible attention to detail.'
    }
  });

  await prisma.review.create({
    data: {
      id: uuidv4(),
      customerId: customer.id,
      designerId: createdDesigners[1].designerProfile.id,
      rating: 5,
      comment: 'Monica is a genius! The evening gown was perfect for my event. Highly recommend!'
    }
  });

  await prisma.review.create({
    data: {
      id: uuidv4(),
      customerId: customer.id,
      designerId: createdDesigners[4].designerProfile.id,
      rating: 4,
      comment: 'Great designer, nice pieces and good communication throughout the process.'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`✨ Created ${createdDesigners.length} designers + 1 customer`);
  console.log('📊 Booked 2 consultations and left 3 reviews');
  console.log('\n🔐 Test Credentials:');
  console.log('   Customer: sarah@example.com / password123');
  console.log('   Designer: alexandra@example.com / password123');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
