// Comprehensive type definitions
export interface HarvestDetails {
  quantity: number;
  unit: string;
  harvest_date: string;
  quality_grade?: string;
}

export interface Product {
  item: string;
  quantity: number;
  price: number;
  unit: string;
  status: boolean;
}

export interface Pricing {
  negotiable: boolean;
  bulk_discount?: string;
  price_per_unit?: string;
}

export interface Logistics {
  delivery_available: boolean;
  delivery_condition: string;
  delivery_cost: string;
}

export interface Ratings {
  farmer_rating: number;
  total_ratings: number;
}

export interface Farm {
  _id: number;
  userId: string;
  pinned: boolean;
  favorite: boolean;
  wishlist: boolean;
  verified: boolean;
  product: Product[];
  description: string;
  image: string;
  additional_images: string[];
  harvest_details: HarvestDetails;
  pricing: Pricing;
  logistics: Logistics;
  posted_at: Date;
  ratings: Ratings;
  tags?: string[];
  status: string;
}

export interface PostedFarmsProps {
  farms?: Farm[];
}

export const farms = [
  {
    _id: 1,
    product: [
      {
        item: "Organic Tomatoes",
        quantity: 500,
        price: 2.5,
        unit: "kg",
        status: true,
      },
      {
        item: "Fresh Eggs",
        quantity: 100,
        price: 0.75,
        unit: "piece",
        status: true,
      },
      {
        item: "Organic Onions",
        quantity: 300,
        price: 1.25,
        unit: "kg",
        status: false,
      },
    ],
    description:
      "A sustainable organic farm producing high-quality vegetables and eggs",
    image:
      "https://images.pexels.com/photos/3963167/pexels-photo-3963167.jpeg?auto=compress&cs=tinysrgb&w=600",
    additional_images: [
      "https://images.pexels.com/photos/14482359/pexels-photo-14482359.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/7611893/pexels-photo-7611893.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    harvest_details: {
      quantity: 500,
      unit: "kg",
      harvest_date: "2024-06-15",
      quality_grade: "A",
    },
    pricing: {
      negotiable: true,
      bulk_discount: "10% off for orders over 100kg",
      price_per_unit: "$2.50/kg",
    },
    logistics: {
      delivery_available: true,
      delivery_condition: "Within 50 miles, refrigerated transport",
      delivery_cost: "$20 flat rate",
    },
    posted_at: "2024-05-20T10:30:00Z",
    ratings: {
      farmer_rating: 4.5,
      total_ratings: 120,
    },
    tags: ["organic", "local", "sustainable"],
    status: "AVAILABLE",
  },
]