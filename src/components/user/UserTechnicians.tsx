import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Search, MapPin, Star, Briefcase, Phone, MessageSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function UserTechnicians() {
  const [searchParams] = useSearchParams();
  const serviceFilter = searchParams.get('service') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(serviceFilter);
  const [sortBy, setSortBy] = useState('rating');

  const technicians = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      avatar: '',
      specialties: ['electric', 'hvac'],
      rating: 4.9,
      reviewCount: 234,
      jobsCompleted: 456,
      location: 'Quận 1, TP.HCM',
      hourlyRate: 150000,
      description: 'Có 10 năm kinh nghiệm sửa chữa điện và điều hòa. Tận tâm, chuyên nghiệp.',
      verified: true,
      available: true
    },
    {
      id: 2,
      name: 'Trần Văn Bình',
      avatar: '',
      specialties: ['plumbing'],
      rating: 4.8,
      reviewCount: 189,
      jobsCompleted: 312,
      location: 'Quận 3, TP.HCM',
      hourlyRate: 120000,
      description: 'Chuyên sửa chữa hệ thống nước, thông cống, bồn cầu. Phục vụ 24/7.',
      verified: true,
      available: true
    },
    {
      id: 3,
      name: 'Lê Minh Công',
      avatar: '',
      specialties: ['electronics', 'electric'],
      rating: 4.9,
      reviewCount: 345,
      jobsCompleted: 678,
      location: 'Quận Bình Thạnh, TP.HCM',
      hourlyRate: 180000,
      description: 'Sửa chữa điện tử, điện thoại, máy tính. Bảo hành dài hạn.',
      verified: true,
      available: false
    },
    {
      id: 4,
      name: 'Phạm Văn Dũng',
      avatar: '',
      specialties: ['painting'],
      rating: 4.7,
      reviewCount: 156,
      jobsCompleted: 289,
      location: 'Quận 7, TP.HCM',
      hourlyRate: 100000,
      description: 'Thợ sơn chuyên nghiệp, thi công nhanh, giá cả hợp lý.',
      verified: true,
      available: true
    },
    {
      id: 5,
      name: 'Hoàng Văn Em',
      avatar: '',
      specialties: ['woodwork'],
      rating: 4.8,
      reviewCount: 198,
      jobsCompleted: 345,
      location: 'Quận Tân Bình, TP.HCM',
      hourlyRate: 160000,
      description: 'Thợ mộc lành nghề, đóng tủ, sửa cửa, làm đồ gỗ theo yêu cầu.',
      verified: true,
      available: true
    },
    {
      id: 6,
      name: 'Võ Văn Phúc',
      avatar: '',
      specialties: ['vehicle'],
      rating: 4.6,
      reviewCount: 223,
      jobsCompleted: 567,
      location: 'Quận 10, TP.HCM',
      hourlyRate: 80000,
      description: 'Sửa xe máy, xe đạp điện. Đến tận nơi khi cần.',
      verified: true,
      available: true
    }
  ];

  const serviceCategories = {
    electric: 'Điện',
    plumbing: 'Nước',
    hvac: 'Điều hòa',
    painting: 'Sơn',
    electronics: 'Điện tử',
    woodwork: 'Mộc',
    vehicle: 'Xe',
    cleaning: 'Vệ sinh'
  };

  const filteredTechnicians = technicians
    .filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tech.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = !selectedService || tech.specialties.includes(selectedService);
      return matchesSearch && matchesService;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'jobs') return b.jobsCompleted - a.jobsCompleted;
      if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price-high') return b.hourlyRate - a.hourlyRate;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Thợ Sửa Chuyên Nghiệp</h1>
        <p className="text-gray-600 text-lg">Tìm kiếm và liên hệ với thợ phù hợp nhất</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm thợ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Chọn dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả dịch vụ</SelectItem>
              {Object.entries(serviceCategories).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="jobs">Nhiều công việc nhất</SelectItem>
              <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.map((tech) => (
          <Card key={tech.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={tech.avatar} />
                  <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {tech.name}
                    {tech.verified && (
                      <Badge variant="secondary" className="text-xs">✓ Xác minh</Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{tech.rating}</span>
                    <span className="text-sm text-gray-500">({tech.reviewCount} đánh giá)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="min-h-[48px]">{tech.description}</CardDescription>
              
              <div className="flex flex-wrap gap-1">
                {tech.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline">
                    {serviceCategories[specialty as keyof typeof serviceCategories]}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{tech.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span>{tech.jobsCompleted} công việc hoàn thành</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-blue-600">
                  <span>{tech.hourlyRate.toLocaleString()}đ/giờ</span>
                </div>
              </div>

              {tech.available ? (
                <Badge className="bg-green-500">Đang rảnh</Badge>
              ) : (
                <Badge variant="secondary">Đang bận</Badge>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link to={`/booking?technicianId=${tech.id}`} className="flex-1">
                <Button className="w-full" disabled={!tech.available}>
                  Đặt Lịch
                </Button>
              </Link>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTechnicians.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy thợ phù hợp</p>
        </div>
      )}
    </div>
  );
}
