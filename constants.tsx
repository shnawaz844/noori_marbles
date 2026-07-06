
import { ProductCategory, Product } from './types';

export const CATEGORIES = Object.values(ProductCategory);

export const PRODUCTS: Product[] = [
  // Tiles & Marbles
  {
    id: '1',
    name: 'Italian Carrara Marble',
    category: ProductCategory.TILES,
    image: 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800',
    description: 'Timeless luxury for your floors and walls.',
    price: 28500,
    inStock: true
  },
  {
    id: '2',
    name: 'Polished Granite Slab',
    category: ProductCategory.TILES,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800',
    description: 'Durable black galaxy granite with golden specs.',
    price: 18900,
    inStock: true
  },
  {
    id: '3',
    name: 'Designer Porcelain Tiles',
    category: ProductCategory.TILES,
    image: 'https://images.unsplash.com/photo-1584622781867-b0a1f8033d47?auto=format&fit=crop&q=80&w=800',
    description: 'Large format vitrified tiles with marble effect.',
    price: 8500,
    inStock: true,
    hotspots: [
      { productId: '10', x: 20, y: 30 },
      { productId: '12', x: 50, y: 50 }
    ]
  },
  {
    id: '4',
    name: 'Ceramic Wall Tiles',
    category: ProductCategory.TILES,
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=800',
    description: 'Premium ceramic tiles for modern bathrooms.',
    price: 4200,
    inStock: true,
    hotspots: [
      { productId: '10', x: 70, y: 40, name: 'Luxury Gold Tap', price: 8500 },
      { productId: '14', x: 30, y: 60, name: 'Minimalist Basin', price: 7200 }
    ]
  },

  // Furniture
  {
    id: '5',
    name: 'Modular Velvet Sofa Set',
    category: ProductCategory.FURNITURE,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    description: 'Bespoke comfort crafted for premium living.',
    price: 65000,
    originalPrice: 85000,
    inStock: true,
    hotspots: [
      { productId: '18', x: 20, y: 30 },
      { productId: '33', x: 80, y: 50 }
    ]
  },
  {
    id: '6',
    name: 'King Size Bed Frame',
    category: ProductCategory.FURNITURE,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    description: 'Contemporary upholstered bed with storage.',
    price: 45000,
    inStock: true
  },
  {
    id: '7',
    name: '6-Seater Dining Set',
    category: ProductCategory.FURNITURE,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant wooden dining table with chairs.',
    price: 52000,
    inStock: true
  },
  {
    id: '8',
    name: 'Sliding Door Wardrobe',
    category: ProductCategory.FURNITURE,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
    description: '3-door wardrobe with mirror and organizers.',
    price: 38000,
    inStock: true
  },
  {
    id: '9',
    name: 'Study Table with Chair',
    category: ProductCategory.FURNITURE,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    description: 'Ergonomic home office desk setup.',
    price: 15500,
    inStock: true
  },

  // Luxury Faucets & Taps
  {
    id: '10',
    name: 'Brushed Gold Faucet',
    category: ProductCategory.TAPS,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    description: 'Precision engineered luxury bathroom fittings.',
    price: 8500,
    inStock: true
  },
  {
    id: '11',
    name: 'Matte Black Rain Shower',
    category: ProductCategory.TAPS,
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800',
    description: 'Premium overhead shower with wall mixer.',
    price: 12500,
    inStock: true
  },
  {
    id: '12',
    name: 'Chrome Kitchen Faucet',
    category: ProductCategory.TAPS,
    image: 'https://images.unsplash.com/photo-1585235480916-3dc1d345e8d6?auto=format&fit=crop&q=80&w=800',
    description: 'Pull-down sprayer with dual function.',
    price: 5800,
    inStock: true
  },

  // Sanitary Wares
  {
    id: '13',
    name: 'Designer Wall-Hung WC',
    category: ProductCategory.SANITARY,
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800',
    description: 'Modern wall-mounted toilet with soft close.',
    price: 18500,
    inStock: true
  },
  {
    id: '14',
    name: 'Countertop Wash Basin',
    category: ProductCategory.SANITARY,
    image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&q=80&w=800',
    description: 'Ceramic basin with matte finish.',
    price: 7200,
    inStock: true
  },
  {
    id: '15',
    name: 'Bathroom Vanity Unit',
    category: ProductCategory.SANITARY,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
    description: 'Complete vanity with sink and storage.',
    price: 25000,
    inStock: true
  },

  // Laminates
  {
    id: '16',
    name: 'Natural Oak Laminates',
    category: ProductCategory.LAMINATES,
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/1/375504357/XR/VN/UT/191113573/wooden-modular-kitchen-cabinets.jpeg',
    description: 'Scratch-resistant high-gloss textures.',
    price: 2200,
    inStock: true
  },
  {
    id: '17',
    name: 'Walnut Wood Veneer',
    category: ProductCategory.LAMINATES,
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800',
    description: 'Premium imported laminate sheets.',
    price: 2800,
    inStock: true
  },
  {
    id: '18',
    name: 'High Gloss Acrylic Sheet',
    category: ProductCategory.LAMINATES,
    image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&q=80&w=800',
    description: 'Mirror finish for modern kitchens.',
    price: 3500,
    inStock: true
  },

  // Ply Boards
  {
    id: '19',
    name: 'Marine Plywood 18mm',
    category: ProductCategory.PLY_BOARDS,
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=800',
    description: 'Waterproof BWP grade marine ply.',
    price: 4800,
    inStock: true
  },
  {
    id: '20',
    name: 'Commercial Ply 12mm',
    category: ProductCategory.PLY_BOARDS,
    image: 'https://images.unsplash.com/photo-1562886812-47090e7f2d6e?auto=format&fit=crop&q=80&w=800',
    description: 'BWR grade for interior work.',
    price: 3200,
    inStock: true
  },
  {
    id: '21',
    name: 'Hardwood Block Board',
    category: ProductCategory.PLY_BOARDS,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800',
    description: 'Solid core for heavy furniture.',
    price: 5500,
    inStock: true
  },

  // Doors
  {
    id: '22',
    name: 'Teak Wood Main Door',
    category: ProductCategory.DOORS,
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=800',
    description: 'Hand-carved elegance for your entrance.',
    price: 45000,
    inStock: true
  },
  {
    id: '23',
    name: 'Flush Interior Door',
    category: ProductCategory.DOORS,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    description: 'Laminated flush doors for rooms.',
    price: 8500,
    inStock: true
  },
  {
    id: '24',
    name: 'Glass Panel Door',
    category: ProductCategory.DOORS,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    description: 'Modern frosted glass with frame.',
    price: 12000,
    inStock: true
  },

  // PVC & Wall Panels
  {
    id: '25',
    name: 'Charcoal PVC Wall Panel',
    category: ProductCategory.PVC_SHEETS,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    description: 'Durable and aesthetic wall transformations.',
    price: 3800,
    inStock: true
  },
  {
    id: '26',
    name: '3D Decorative Panel',
    category: ProductCategory.PVC_SHEETS,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800',
    description: 'Textured wall panels with patterns.',
    price: 4500,
    inStock: true
  },
  {
    id: '27',
    name: 'PVC Ceiling Panel',
    category: ProductCategory.PVC_SHEETS,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    description: 'Easy install ceiling solution.',
    price: 2800,
    inStock: true
  },

  // Hardware
  {
    id: '28',
    name: 'Smart Kitchen Hardware',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    description: 'Smooth movement and long-lasting durability.',
    price: 6500,
    inStock: true
  },
  {
    id: '29',
    name: 'Brass Door Handles',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800',
    description: 'Premium lever handles with lock.',
    price: 2400,
    inStock: true
  },
  {
    id: '30',
    name: 'Telescopic Drawer Channel',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800',
    description: 'Soft-close heavy duty channels.',
    price: 1800,
    inStock: true
  },
  {
    id: '31',
    name: 'Cabinet Hinges Set',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&q=80&w=800',
    description: 'Concealed hydraulic hinges pack of 10.',
    price: 1200,
    inStock: true
  },
  {
    id: '32',
    name: 'Digital Door Lock',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
    description: 'Smart lock with fingerprint and password.',
    price: 12500,
    inStock: true
  },
  {
    id: '33',
    name: 'Luxury Cabinet Knobs',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?auto=format&fit=crop&q=80&w=800',
    description: 'Crystal and brass decorative knobs.',
    price: 850,
    inStock: true
  },
  {
    id: '34',
    name: 'Corner Shelf Brackets',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy duty metal brackets.',
    price: 950,
    inStock: true
  },
  {
    id: '35',
    name: 'LED Profile for Wardrobe',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1573883430060-e31c99b76c6d?auto=format&fit=crop&q=80&w=800',
    description: 'Aluminum profile with LED strip.',
    price: 2200,
    inStock: true
  },
  {
    id: '36',
    name: 'Modular Kitchen Basket',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800',
    description: 'Stainless steel pull-out basket.',
    price: 5800,
    inStock: true
  },
  {
    id: '37',
    name: 'Tower Bolt Premium',
    category: ProductCategory.HARDWARE,
    image: 'https://images.unsplash.com/photo-1580069853317-e791a49aaf57?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy duty door bolt with finish.',
    price: 650,
    inStock: true
  }
];

export const SHOWROOM_DETAILS = {
  name: 'Noori Marbels',
  tagline: 'Crafting Your Dream Spaces with Timeless Elegance',
  address: 'Near Airforce Gate, Bareilly, Uttar Pradesh',
  phone: '+91 8077 028 027',
  email: 'info@noorimarbels.com',
  timings: 'Mon - Sun: 10:00 AM - 8:30 PM'
};
