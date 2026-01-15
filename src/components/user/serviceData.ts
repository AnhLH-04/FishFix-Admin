export type ServiceCategoryId =
  | 'electric'
  | 'plumbing'
  | 'hvac'
  | 'painting'
  | 'electronics'
  | 'woodwork'
  | 'vehicle'
  | 'cleaning';

export interface MainService {
  id: number;
  name: string;
  category: ServiceCategoryId;
  icon: string;
  description: string;
  technicianCount: number;
  avgRating: number;
  priceRange: string;
}

export interface DetailedService {
  id: number;
  name: string;
  description: string;
  priceRange: string;
  duration: string;
  popular: boolean;
}

export const mainServices: MainService[] = [
  {
    id: 1,
    name: 'Sửa Điện',
    category: 'electric',
    icon: '⚡',
    description: 'Sửa chữa, lắp đặt hệ thống điện, đèn, quạt, ổ cắm...',
    technicianCount: 245,
    avgRating: 4.8,
    priceRange: '100,000 - 500,000đ',
  },
  {
    id: 2,
    name: 'Sửa Nước',
    category: 'plumbing',
    icon: '💧',
    description: 'Sửa vòi nước, ống nước, bồn cầu, thông cống...',
    technicianCount: 189,
    avgRating: 4.7,
    priceRange: '150,000 - 800,000đ',
  },
  {
    id: 3,
    name: 'Điều Hòa',
    category: 'hvac',
    icon: '❄️',
    description: 'Lắp đặt, sửa chữa, vệ sinh điều hòa, máy lạnh...',
    technicianCount: 156,
    avgRating: 4.9,
    priceRange: '200,000 - 1,500,000đ',
  },
  {
    id: 4,
    name: 'Sơn Nhà',
    category: 'painting',
    icon: '🎨',
    description: 'Sơn tường, sơn nhà mới, sửa chữa tường nứt...',
    technicianCount: 198,
    avgRating: 4.6,
    priceRange: '50,000đ/m²',
  },
  {
    id: 5,
    name: 'Sửa Điện Tử',
    category: 'electronics',
    icon: '📱',
    description: 'Sửa chữa điện thoại, máy tính, tivi, tủ lạnh...',
    technicianCount: 312,
    avgRating: 4.8,
    priceRange: '100,000 - 2,000,000đ',
  },
  {
    id: 6,
    name: 'Mộc & Đồ Gỗ',
    category: 'woodwork',
    icon: '🪵',
    description: 'Đóng tủ, sửa cửa, bàn ghế, giường tủ...',
    technicianCount: 167,
    avgRating: 4.7,
    priceRange: '300,000 - 5,000,000đ',
  },
  {
    id: 7,
    name: 'Sửa Xe',
    category: 'vehicle',
    icon: '🏍️',
    description: 'Sửa chữa, bảo dưỡng xe máy, xe đạp điện...',
    technicianCount: 223,
    avgRating: 4.5,
    priceRange: '50,000 - 1,000,000đ',
  },
  {
    id: 8,
    name: 'Vệ Sinh',
    category: 'cleaning',
    icon: '🧹',
    description: 'Dọn dẹp nhà cửa, văn phòng, vệ sinh sau xây dựng...',
    technicianCount: 145,
    avgRating: 4.6,
    priceRange: '200,000 - 500,000đ',
  },
];

export const detailedServicesByCategory: Record<ServiceCategoryId, DetailedService[]> = {
  electric: [
    {
      id: 1,
      name: 'Sửa ổ cắm, công tắc',
      description: 'Thay mới, sửa chữa ổ cắm, công tắc hỏng.',
      priceRange: '100,000 - 200,000đ',
      duration: '30-45 phút',
      popular: true,
    },
    {
      id: 2,
      name: 'Lắp đặt đèn chiếu sáng',
      description: 'Lắp mới, thay thế đèn trần, đèn tuýp, đèn led.',
      priceRange: '150,000 - 400,000đ',
      duration: '45-60 phút',
      popular: true,
    },
    {
      id: 3,
      name: 'Xử lý chập cháy điện',
      description: 'Kiểm tra, khắc phục sự cố chập điện trong nhà.',
      priceRange: '300,000 - 800,000đ',
      duration: '60-120 phút',
      popular: false,
    },
  ],
  plumbing: [
    {
      id: 1,
      name: 'Sửa vòi nước rò rỉ',
      description: 'Thay ron, siết lại hoặc thay mới vòi nước.',
      priceRange: '120,000 - 250,000đ',
      duration: '30-45 phút',
      popular: true,
    },
    {
      id: 2,
      name: 'Thông tắc bồn cầu',
      description: 'Thông tắc bồn cầu bị nghẹt, xả nước chậm.',
      priceRange: '250,000 - 500,000đ',
      duration: '45-90 phút',
      popular: true,
    },
    {
      id: 3,
      name: 'Sửa rò rỉ đường ống',
      description: 'Tìm vị trí rò rỉ, thay đoạn ống hư.',
      priceRange: '300,000 - 900,000đ',
      duration: '60-120 phút',
      popular: false,
    },
  ],
  hvac: [
    {
      id: 1,
      name: 'Vệ sinh điều hòa treo tường',
      description: 'Vệ sinh, kiểm tra gas, làm sạch dàn nóng/lạnh.',
      priceRange: '150,000 - 250,000đ',
      duration: '45-60 phút',
      popular: true,
    },
    {
      id: 2,
      name: 'Điều hòa không lạnh',
      description: 'Kiểm tra gas, sửa chữa dàn nóng, thay linh kiện.',
      priceRange: '200,000 - 500,000đ',
      duration: '60-90 phút',
      popular: true,
    },
    {
      id: 3,
      name: 'Điều hòa kêu to',
      description: 'Kiểm tra motor quạt, vệ sinh, bảo dưỡng.',
      priceRange: '150,000 - 400,000đ',
      duration: '30-60 phút',
      popular: false,
    },
    {
      id: 4,
      name: 'Bơm gas điều hòa',
      description: 'Bơm gas R410, R32 cho điều hòa.',
      priceRange: '300,000 - 600,000đ',
      duration: '30-45 phút',
      popular: false,
    },
    {
      id: 5,
      name: 'Di dời điều hòa',
      description: 'Tháo lắp, di chuyển điều hòa sang vị trí khác.',
      priceRange: '500,000 - 800,000đ',
      duration: '2-3 giờ',
      popular: false,
    },
  ],
  painting: [
    {
      id: 1,
      name: 'Sơn lại phòng ngủ',
      description: 'Sơn mới, xử lý ẩm mốc tường phòng ngủ.',
      priceRange: '800,000 - 2,000,000đ',
      duration: '1-2 ngày',
      popular: true,
    },
    {
      id: 2,
      name: 'Sơn chống thấm ban công',
      description: 'Sơn chống thấm, xử lý nứt chân chim.',
      priceRange: '600,000 - 1,500,000đ',
      duration: '4-8 giờ',
      popular: false,
    },
  ],
  electronics: [
    {
      id: 1,
      name: 'Sửa tivi không lên hình',
      description: 'Kiểm tra nguồn, main, thay thế linh kiện.',
      priceRange: '300,000 - 1,200,000đ',
      duration: '2-4 giờ',
      popular: true,
    },
    {
      id: 2,
      name: 'Sửa tủ lạnh không lạnh',
      description: 'Kiểm tra gas, block, hệ thống lạnh.',
      priceRange: '400,000 - 1,500,000đ',
      duration: '3-5 giờ',
      popular: true,
    },
  ],
  woodwork: [
    {
      id: 1,
      name: 'Sửa cửa gỗ bị xệ',
      description: 'Cân chỉnh bản lề, thay bản lề mới.',
      priceRange: '300,000 - 700,000đ',
      duration: '2-3 giờ',
      popular: true,
    },
    {
      id: 2,
      name: 'Đóng tủ bếp gỗ công nghiệp',
      description: 'Thiết kế, đóng mới tủ bếp theo yêu cầu.',
      priceRange: '4,000,000 - 15,000,000đ',
      duration: '3-7 ngày',
      popular: false,
    },
  ],
  vehicle: [
    {
      id: 1,
      name: 'Bảo dưỡng xe máy định kỳ',
      description: 'Thay nhớt, kiểm tra phanh, bugi, lốp.',
      priceRange: '200,000 - 500,000đ',
      duration: '60-90 phút',
      popular: true,
    },
    {
      id: 2,
      name: 'Sửa xe chết máy giữa đường',
      description: 'Cứu hộ, kiểm tra và sửa nhanh tại chỗ.',
      priceRange: '300,000 - 800,000đ',
      duration: '60-120 phút',
      popular: false,
    },
  ],
  cleaning: [
    {
      id: 1,
      name: 'Vệ sinh nhà ở tổng quát',
      description: 'Dọn dẹp, lau chùi toàn bộ nhà ở.',
      priceRange: '500,000 - 1,500,000đ',
      duration: '4-8 giờ',
      popular: true,
    },
    {
      id: 2,
      name: 'Vệ sinh sau xây dựng',
      description: 'Vệ sinh bụi bẩn, xi măng sau thi công.',
      priceRange: '1,000,000 - 3,000,000đ',
      duration: '1-2 ngày',
      popular: true,
    },
  ],
};
