import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function UserServices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    {
      id: 1,
      name: 'Sửa Điện',
      category: 'electric',
      icon: '⚡',
      description: 'Sửa chữa, lắp đặt hệ thống điện, đèn, quạt, ổ cắm...',
      technicianCount: 245,
      avgRating: 4.8,
      priceRange: '100,000 - 500,000đ'
    },
    {
      id: 2,
      name: 'Sửa Nước',
      category: 'plumbing',
      icon: '💧',
      description: 'Sửa vòi nước, ống nước, bồn cầu, thông cống...',
      technicianCount: 189,
      avgRating: 4.7,
      priceRange: '150,000 - 800,000đ'
    },
    {
      id: 3,
      name: 'Điều Hòa',
      category: 'hvac',
      icon: '❄️',
      description: 'Lắp đặt, sửa chữa, vệ sinh điều hòa, máy lạnh...',
      technicianCount: 156,
      avgRating: 4.9,
      priceRange: '200,000 - 1,500,000đ'
    },
    {
      id: 4,
      name: 'Sơn Nhà',
      category: 'painting',
      icon: '🎨',
      description: 'Sơn tường, sơn nhà mới, sửa chữa tường nứt...',
      technicianCount: 198,
      avgRating: 4.6,
      priceRange: '50,000đ/m²'
    },
    {
      id: 5,
      name: 'Sửa Điện Tử',
      category: 'electronics',
      icon: '📱',
      description: 'Sửa chữa điện thoại, máy tính, tivi, tủ lạnh...',
      technicianCount: 312,
      avgRating: 4.8,
      priceRange: '100,000 - 2,000,000đ'
    },
    {
      id: 6,
      name: 'Mộc & Đồ Gỗ',
      category: 'woodwork',
      icon: '🪵',
      description: 'Đóng tủ, sửa cửa, bàn ghế, giường tủ...',
      technicianCount: 167,
      avgRating: 4.7,
      priceRange: '300,000 - 5,000,000đ'
    },
    {
      id: 7,
      name: 'Sửa Xe',
      category: 'vehicle',
      icon: '🏍️',
      description: 'Sửa chữa, bảo dưỡng xe máy, xe đạp điện...',
      technicianCount: 223,
      avgRating: 4.5,
      priceRange: '50,000 - 1,000,000đ'
    },
    {
      id: 8,
      name: 'Vệ Sinh',
      category: 'cleaning',
      icon: '🧹',
      description: 'Dọn dẹp nhà cửa, văn phòng, vệ sinh sau xây dựng...',
      technicianCount: 145,
      avgRating: 4.6,
      priceRange: '200,000 - 500,000đ'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Dịch Vụ Sửa Chữa</h1>
          <p className="text-xl text-blue-100">Tìm kiếm dịch vụ phù hợp với nhu cầu của bạn</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-8">

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-2 focus:border-blue-500"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64 h-12 border-2">
              <Filter className="mr-2 h-5 w-5" />
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="electric">Điện</SelectItem>
              <SelectItem value="plumbing">Nước</SelectItem>
              <SelectItem value="hvac">Điều hòa</SelectItem>
              <SelectItem value="painting">Sơn</SelectItem>
              <SelectItem value="electronics">Điện tử</SelectItem>
              <SelectItem value="woodwork">Mộc</SelectItem>
              <SelectItem value="vehicle">Xe</SelectItem>
              <SelectItem value="cleaning">Vệ sinh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredServices.map((service) => (
          <Card key={service.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 w-24 h-24 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <div className="text-5xl">{service.icon}</div>
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{service.name}</CardTitle>
              <CardDescription className="text-center min-h-[48px] leading-relaxed">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                  <span className="text-gray-600 font-medium">Thợ khả dụng:</span>
                  <Badge variant="secondary" className="font-semibold">{service.technicianCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                  <span className="text-gray-600 font-medium">Đánh giá:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{service.avgRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg">
                  <span className="text-gray-600 font-medium">Giá:</span>
                  <span className="font-bold text-blue-600">{service.priceRange}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md" onClick={() => window.location.href = `/technicians?service=${service.category}`}>
                Tìm Thợ
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-xl font-medium">Không tìm thấy dịch vụ phù hợp</p>
        </div>
      )}
      </div>
    </div>
  );
}
