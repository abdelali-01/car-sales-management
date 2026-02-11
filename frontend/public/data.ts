export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  featured: boolean;
  images: string[];
  inStock: boolean;
  discount?: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  images: string[];
  features: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 2999,
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    featured: true,
    images: [
      "/images/product/1.jpg",
    ],
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 3999,
    description: "Advanced smartwatch with health monitoring features",
    category: "Electronics",
    featured: true,
    images: [
      "/images/product/2.jpg"
    ],
    inStock: true,
    discount: 50
  },
  {
    id: 3,
    name: "Professional Camera Kit",
    price: 12299,
    description: "Complete camera kit for professional photography",
    category: "Electronics",
    featured: true,
    images: [
      "/images/product/3.jpg",
    ],
    inStock: true
  },
  {
    id: 4,
    name: "Wireless Earbuds Pro",
    price: 2199,
    description: "Premium wireless earbuds with active noise cancellation",
    category: "Electronics",
    featured: true,
    images: [
      "/images/product/4.jpeg",
    ],
    inStock: true,
    discount: 30
  },
  {
    id: 5,
    name: "Gaming Laptop Pro",
    price: 201499,
    description: "High-performance gaming laptop with RTX graphics",
    category: "Electronics",
    featured: false,
    images: [
      "/hero-image.jpg",
    ],
    inStock: true
  }
];

export const services: Service[] = [
  {
    id: 1,
    title: "Professional Software Development",
    description: "High-quality software development services for all occasions",
    icon: "software",
    images: [
      "/images/carousel/carousel-03.png",
      "/images/carousel/carousel-02.png"
    ],
    features: [
      "Professional equipment",
      "Expert developers",
      "Quick delivery",
      "Digital copies included"
    ]
  },
  {
    id: 2,
    title: "Video Production",
    description: "Complete video production services for your needs",
    icon: "video",
    images: [
      "/images/carousel/carousel-01.png",
      "/images/carousel/carousel-04.png",
    ],
    features: [
      "4K quality",
      "Professional editing",
      "Motion graphics",
      "Sound design"
    ]
  },
  {
    id: 3,
    title: "Event Coverage",
    description: "Comprehensive coverage for all your events",
    icon: "event",
    images: [
      "/images/carousel/carousel-02.png",
      "/images/carousel/carousel-04.png"
    ],
    features: [
      "Live streaming",
      "Photo booth",
      "Social media coverage",
      "Quick delivery"
    ]
  }
];
