import type { MyOrdersData } from "@/types/myOrders";

const projectHailMaryCover =
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=200&q=80";

export const fakeMyOrdersData: MyOrdersData = {
  title: "My Orders",
  subtitle: "Track and manage all your book purchases",
  filters: [
    { id: "all", label: "All Orders", status: "all", count: 4 },
    { id: "processing", label: "Processing", status: "processing", count: 1 },
    { id: "in-transit", label: "In Transit", status: "in-transit", count: 1 },
    { id: "delivered", label: "Delivered", status: "delivered", count: 2 },
  ],
  orders: [
    {
      id: "1",
      orderNumber: "FLO-B5RX7N",
      placedAt: "Placed Jul 30, 2026",
      status: "in-transit",
      currentStep: "in-transit",
      item: {
        title: "Project Hail Mary",
        author: "Andy Weir",
        coverImage: projectHailMaryCover,
        quantity: 2,
        price: 1020,
        currency: "৳",
        seller: { name: "Rocket", icon: "🚀" },
      },
      deliveryAddress: "Flat 3B, Block C, Mirpur-10, Dhaka",
      agent: {
        name: "Karim Hossain",
        initials: "KH",
        avatarColor: "bg-secondary text-secondary-content",
        rating: 4.6,
        phone: "01887654321",
      },
      payment: {
        method: "Rocket",
        transactionId: "RKT7B2D3F9",
        phone: "01887654321",
        status: "verified",
      },
    },
    {
      id: "2",
      orderNumber: "FLO-A3KM9P",
      placedAt: "Placed Jul 28, 2026",
      status: "processing",
      currentStep: "processing",
      item: {
        title: "The Midnight Library",
        author: "Matt Haig",
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80",
        quantity: 1,
        price: 350,
        currency: "৳",
        seller: { name: "Canongate", icon: "📚" },
      },
      deliveryAddress: "Flat 3B, Block C, Mirpur-10, Dhaka",
      agent: {
        name: "Rahim Uddin",
        initials: "RU",
        avatarColor: "bg-info text-info-content",
        rating: 4.8,
        phone: "01711223344",
      },
      payment: {
        method: "bKash",
        transactionId: "BA7B2D3F9K",
        phone: "01711223344",
        status: "pending",
      },
    },
    {
      id: "3",
      orderNumber: "FLO-Z8HT2W",
      placedAt: "Placed Jul 15, 2026",
      status: "delivered",
      currentStep: "delivered",
      item: {
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        coverImage:
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=200&q=80",
        quantity: 1,
        price: 480,
        currency: "৳",
        seller: { name: "Faber", icon: "📖" },
      },
      deliveryAddress: "Flat 3B, Block C, Mirpur-10, Dhaka",
      agent: {
        name: "Karim Hossain",
        initials: "KH",
        avatarColor: "bg-secondary text-secondary-content",
        rating: 4.6,
        phone: "01887654321",
      },
      payment: {
        method: "bKash",
        transactionId: "BK9C4E1A2M",
        phone: "01887654321",
        status: "verified",
      },
    },
    {
      id: "4",
      orderNumber: "FLO-M4PL6Q",
      placedAt: "Placed Jul 2, 2026",
      status: "delivered",
      currentStep: "delivered",
      item: {
        title: "Piranesi",
        author: "Susanna Clarke",
        coverImage:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=200&q=80",
        quantity: 1,
        price: 420,
        currency: "৳",
        seller: { name: "Bloomsbury", icon: "🏛️" },
      },
      deliveryAddress: "Flat 3B, Block C, Mirpur-10, Dhaka",
      agent: {
        name: "Nasrin Akter",
        initials: "NA",
        avatarColor: "bg-accent text-accent-content",
        rating: 4.9,
        phone: "01999887766",
      },
      payment: {
        method: "Rocket",
        transactionId: "RKT4PL6Q88",
        phone: "01999887766",
        status: "verified",
      },
    },
  ],
};

export async function getMyOrdersData(_userId: string): Promise<MyOrdersData> {
  return fakeMyOrdersData;
}
