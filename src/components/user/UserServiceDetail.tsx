import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mainServices, detailedServicesByCategory, ServiceCategoryId } from './serviceData';

export function UserServiceDetail() {
  const navigate = useNavigate();
  const { category, detailId } = useParams<{ category: ServiceCategoryId; detailId: string }>();

  const { mainService, detailedService } = useMemo(() => {
    if (!category || !detailId) return { mainService: null, detailedService: null };

    const mainService = mainServices.find((s) => s.category === category) || null;
    const detailedList = detailedServicesByCategory[category] || [];
    const detailedService = detailedList.find((d) => d.id === Number(detailId)) || null;

    return { mainService, detailedService };
  }, [category, detailId]);

  if (!mainService || !detailedService) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">😕</div>
          <p className="text-lg text-gray-600">Không tìm thấy dịch vụ bạn yêu cầu.</p>
          <Button onClick={() => navigate('/services')}>Quay lại danh sách dịch vụ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            className="text-sm text-blue-100 hover:text-white mb-4"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{detailedService.name}</h1>
          <p className="text-blue-100 text-lg">Thuộc nhóm: {mainService.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 pb-12">
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">Chi tiết dịch vụ</CardTitle>
                <CardDescription className="text-base text-gray-700">
                  {detailedService.description}
                </CardDescription>
              </div>
              {detailedService.popular && (
                <Badge className="bg-yellow-400 text-black text-sm h-7 px-3 flex items-center">
                  Phổ biến
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-base">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Khoảng giá tham khảo</span>
              <span className="font-semibold text-blue-600">{detailedService.priceRange}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Thời gian thực hiện dự kiến</span>
              <span className="font-medium">{detailedService.duration}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => navigate(`/booking?service=${category}&detailId=${detailId}`)}
          >
            Đặt lịch dịch vụ này
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/services')}
          >
            Xem thêm dịch vụ khác
          </Button>
        </div>
      </div>
    </div>
  );
}
