import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Venda database...')

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'phones' }, update: {}, create: { name: 'Phones & Tablets', slug: 'phones' } }),
    prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics' } }),
    prisma.category.upsert({ where: { slug: 'fashion' }, update: {}, create: { name: 'Fashion', slug: 'fashion' } }),
    prisma.category.upsert({ where: { slug: 'home' }, update: {}, create: { name: 'Home & Living', slug: 'home' } }),
    prisma.category.upsert({ where: { slug: 'beauty' }, update: {}, create: { name: 'Beauty', slug: 'beauty' } }),
    prisma.category.upsert({ where: { slug: 'sports' }, update: {}, create: { name: 'Sports', slug: 'sports' } }),
    prisma.category.upsert({ where: { slug: 'food' }, update: {}, create: { name: 'Food & Groceries', slug: 'food' } }),
    prisma.category.upsert({ where: { slug: 'books' }, update: {}, create: { name: 'Books', slug: 'books' } }),
  ])

  console.log('Categories seeded')

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@venda.ng' },
    update: {},
    create: {
      clerkId: 'demo_buyer_001',
      email: 'buyer@venda.ng',
      name: 'Toluwanimi Oyeleke',
      role: 'BUYER',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=buyer',
    },
  })

  const sellerUser1 = await prisma.user.upsert({
    where: { email: 'techhub@venda.ng' },
    update: {},
    create: {
      clerkId: 'demo_seller_001',
      email: 'techhub@venda.ng',
      name: 'Chukwuemeka Obi',
      role: 'SELLER',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    },
  })

  const sellerUser2 = await prisma.user.upsert({
    where: { email: 'ankara@venda.ng' },
    update: {},
    create: {
      clerkId: 'demo_seller_002',
      email: 'ankara@venda.ng',
      name: 'Adaeze Nwosu',
      role: 'SELLER',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    },
  })

  const sellerUser3 = await prisma.user.upsert({
    where: { email: 'sneakers@venda.ng' },
    update: {},
    create: {
      clerkId: 'demo_seller_003',
      email: 'sneakers@venda.ng',
      name: 'Babatunde Adeyemi',
      role: 'SELLER',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller3',
    },
  })

  const sellerUser4 = await prisma.user.upsert({
    where: { email: 'gadgetzone@venda.ng' },
    update: {},
    create: {
      clerkId: 'demo_seller_004',
      email: 'gadgetzone@venda.ng',
      name: 'Funmilayo Adekunle',
      role: 'SELLER',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller4',
    },
  })

  console.log('Users seeded')

  const techHub = await prisma.seller.upsert({
    where: { storeSlug: 'techhub-lagos' },
    update: {},
    create: {
      userId: sellerUser1.id,
      storeName: 'TechHub Lagos',
      storeSlug: 'techhub-lagos',
      description: 'Your number one destination for premium electronics in Nigeria. Genuine products, warranty included.',
      rating: 4.9,
      totalSales: 8200,
      isVerified: true,
    },
  })

  const ankaraHouse = await prisma.seller.upsert({
    where: { storeSlug: 'ankara-house' },
    update: {},
    create: {
      userId: sellerUser2.id,
      storeName: 'Ankara House',
      storeSlug: 'ankara-house',
      description: 'Premium Ankara and African print fashion. Handcrafted with love in Lagos.',
      rating: 4.8,
      totalSales: 3400,
      isVerified: true,
    },
  })

  const sneakerRepublic = await prisma.seller.upsert({
    where: { storeSlug: 'sneaker-republic' },
    update: {},
    create: {
      userId: sellerUser3.id,
      storeName: 'Sneaker Republic',
      storeSlug: 'sneaker-republic',
      description: 'Authentic sneakers and footwear. Nike, Adidas, Jordan and more.',
      rating: 4.7,
      totalSales: 1200,
      isVerified: true,
    },
  })

  const gadgetZone = await prisma.seller.upsert({
    where: { storeSlug: 'gadgetzone-ng' },
    update: {},
    create: {
      userId: sellerUser4.id,
      storeName: 'GadgetZone NG',
      storeSlug: 'gadgetzone-ng',
      description: 'Best prices on phones, laptops and accessories across Nigeria.',
      rating: 4.6,
      totalSales: 5600,
      isVerified: false,
    },
  })

  console.log('Sellers seeded')

  const products = [
    {
      sellerId: techHub.id,
      categoryId: categories[0].id,
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'The ultimate Samsung flagship with 200MP camera, S Pen, and AI features. 256GB storage, Titanium Black.',
      price: 520000,
      comparePrice: 580000,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1610945264803-c22b62831e8b?w=400'],
      tags: ['samsung', 'android', 'flagship', 'camera'],
      rating: 4.9,
      reviewCount: 124,
      isFeatured: true,
      isActive: true,
    },
    {
      sellerId: techHub.id,
      categoryId: categories[1].id,
      name: 'MacBook Air M3 13"',
      slug: 'macbook-air-m3-13',
      description: 'Apple MacBook Air with M3 chip. Incredibly thin, fanless design. 8GB RAM, 256GB SSD. Midnight color.',
      price: 780000,
      comparePrice: 920000,
      stock: 8,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
      tags: ['apple', 'laptop', 'macbook', 'm3'],
      rating: 4.9,
      reviewCount: 67,
      isFeatured: true,
      isActive: true,
    },
    {
      sellerId: techHub.id,
      categoryId: categories[1].id,
      name: 'Sony WH-1000XM5 Headphones',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise cancellation. 30-hour battery life. Crystal clear hands-free calling.',
      price: 120000,
      comparePrice: null,
      stock: 22,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      tags: ['sony', 'headphones', 'noise-cancelling', 'audio'],
      rating: 4.8,
      reviewCount: 89,
      isFeatured: false,
      isActive: true,
    },
    {
      sellerId: techHub.id,
      categoryId: categories[0].id,
      name: 'iPhone 15 Pro 256GB',
      slug: 'iphone-15-pro-256gb',
      description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system. Natural Titanium.',
      price: 750000,
      comparePrice: 940000,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
      tags: ['apple', 'iphone', 'ios', 'flagship'],
      rating: 4.9,
      reviewCount: 201,
      isFeatured: true,
      isActive: true,
    },
    {
      sellerId: gadgetZone.id,
      categoryId: categories[0].id,
      name: 'iPad Pro 12.9" M4',
      slug: 'ipad-pro-12-m4',
      description: 'The most advanced iPad ever. M4 chip, Ultra Retina XDR display, Apple Pencil Pro support.',
      price: 620000,
      comparePrice: null,
      stock: 6,
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
      tags: ['apple', 'ipad', 'tablet', 'm4'],
      rating: 4.8,
      reviewCount: 45,
      isFeatured: true,
      isActive: true,
    },
    {
      sellerId: gadgetZone.id,
      categoryId: categories[1].id,
      name: 'AirPods Pro 2nd Generation',
      slug: 'airpods-pro-2nd-gen',
      description: 'Active noise cancellation, Adaptive Audio, and Personalized Spatial Audio. USB-C charging case.',
      price: 145000,
      comparePrice: 193000,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1588423771073-b8903fead714?w=400'],
      tags: ['apple', 'airpods', 'earphones', 'wireless'],
      rating: 4.8,
      reviewCount: 156,
      isFeatured: false,
      isActive: true,
    },
    {
      sellerId: gadgetZone.id,
      categoryId: categories[1].id,
      name: 'Apple Watch Series 10',
      slug: 'apple-watch-series-10',
      description: 'The thinnest Apple Watch ever. Advanced health sensors, sleep apnea detection, GPS.',
      price: 195000,
      comparePrice: null,
      stock: 18,
      images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400'],
      tags: ['apple', 'watch', 'smartwatch', 'fitness'],
      rating: 4.7,
      reviewCount: 33,
      isFeatured: false,
      isActive: true,
    },
    {
      sellerId: ankaraHouse.id,
      categoryId: categories[2].id,
      name: 'Premium Ankara Midi Dress',
      slug: 'premium-ankara-midi-dress',
      description: 'Handcrafted premium Ankara midi dress. Perfect for owambe parties and formal occasions. Available in sizes S-XL.',
      price: 18500,
      comparePrice: 23000,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=400'],
      tags: ['ankara', 'dress', 'african', 'fashion', 'owambe'],
      rating: 4.8,
      reviewCount: 87,
      isFeatured: true,
      isActive: true,
    },
    {
      sellerId: ankaraHouse.id,
      categoryId: categories[2].id,
      name: 'Agbada 3-Piece Set',
      slug: 'agbada-3-piece-set',
      description: 'Premium hand-embroidered Agbada set. Includes buba, sokoto, and flowing robe. Perfect for ceremonies.',
      price: 45000,
      comparePrice: 55000,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400'],
      tags: ['agbada', 'menswear', 'yoruba', 'traditional'],
      rating: 4.7,
      reviewCount: 54,
      isFeatured: false,
      isActive: true,
    },
    {
      sellerId: ankaraHouse.id,
      categoryId: categories[2].id,
      name: 'Aso-oke Gele Set',
      slug: 'aso-oke-gele-set',
      description: 'Traditional hand-woven Aso-oke fabric with matching Gele headtie. Ideal for weddings and ceremonies.',
      price: 32000,
      comparePrice: null,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400'],
      tags: ['aso-oke', 'gele', 'yoruba', 'wedding', 'traditional'],
      rating: 4.9,
      reviewCount: 41,
      isFeatured: false,
      isActive: true,
    },
    {
      sellerId: sneakerRepublic.id,
      categoryId: categories[5].id,
      name: "Nike Air Force 1 '07",
      slug: 'nike-air-force-1-07',
      description: "The legendary Nike Air Force 1 in classic white. Triple white colorway. UK sizes 40-46 available.",
      price: 65000,
      comparePrice: null,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      tags: ['nike', 'sneakers', 'airforce1', 'white', 'classic'],
      rating: 4.9,
      reviewCount: 203,
      isFeatured: true,
      isActive: true,
    },
    {
      sellerId: sneakerRepublic.id,
      categoryId: categories[5].id,
      name: 'Adidas Yeezy Boost 350 V2',
      slug: 'adidas-yeezy-boost-350-v2',
      description: 'Authentic Yeezy Boost 350 V2 in Zebra colorway. Primeknit upper, full-length Boost midsole.',
      price: 185000,
      comparePrice: 220000,
      stock: 5,
      images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'],
      tags: ['adidas', 'yeezy', 'boost', 'limited', 'rare'],
      rating: 4.8,
      reviewCount: 78,
      isFeatured: false,
      isActive: true,
    },
    {
      sellerId: sneakerRepublic.id,
      categoryId: categories[5].id,
      name: 'Jordan 1 Retro High OG',
      slug: 'jordan-1-retro-high-og',
      description: 'The iconic Air Jordan 1 High in Chicago colorway. Full grain leather upper, Air cushioning.',
      price: 145000,
      comparePrice: 180000,
      stock: 8,
      images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400'],
      tags: ['jordan', 'nike', 'basketball', 'retro', 'chicago'],
      rating: 4.9,
      reviewCount: 112,
      isFeatured: false,
      isActive: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log(`${products.length} products seeded`)
  console.log('')
  console.log('Seed complete! Venda is ready.')
  console.log('')
  console.log('Demo accounts:')
  console.log(`  Buyer:  buyer@venda.ng`)
  console.log(`  Seller: techhub@venda.ng`)

  await prisma.$disconnect()
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})