import { Link } from 'react-router-dom';
import { Check, Zap, Droplet, Wind, WashingMachine, Clock, Shield, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';

export function PricingPage() {
  const serviceCategories = [
    {
      icon: Zap,
      title: 'Dịch vụ Điện',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      items: [
        { name: 'Kiểm tra và báo giá', price: 'Miễn phí' },
        { name: 'Sửa ổ cắm, công tắc', price: '150,000đ - 300,000đ' },
        { name: 'Sửa chữa mạch điện', price: '300,000đ - 800,000đ' },
        { name: 'Lắp đặt hệ thống điện', price: '500,000đ+' },
        { name: 'Thay thế aptomat', price: '200,000đ - 500,000đ' },
        { name: 'Lắp đặt đèn chiếu sáng', price: '150,000đ - 400,000đ' },
      ],
    },
    {
      icon: Droplet,
      title: 'Dịch vụ Nước',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      items: [
        { name: 'Kiểm tra và báo giá', price: 'Miễn phí' },
        { name: 'Sửa ống nước rò rỉ', price: '200,000đ - 500,000đ' },
        { name: 'Thông tắc bồn cầu, bồn rửa', price: '250,000đ - 600,000đ' },
        { name: 'Lắp đặt thiết bị vệ sinh', price: '300,000đ - 1,000,000đ' },
        { name: 'Sửa máy bơm nước', price: '350,000đ - 800,000đ' },
        { name: 'Thay van, khóa nước', price: '150,000đ - 400,000đ' },
      ],
    },
    {
      icon: Wind,
      title: 'Dịch vụ Máy lạnh',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      items: [
        { name: 'Kiểm tra và báo giá', price: 'Miễn phí' },
        { name: 'Vệ sinh máy lạnh', price: '250,000đ - 400,000đ' },
        { name: 'Bơm gas máy lạnh', price: '400,000đ - 800,000đ' },
        { name: 'Sửa máy lạnh không lạnh', price: '350,000đ - 1,200,000đ' },
        { name: 'Di dời máy lạnh', price: '500,000đ - 1,000,000đ' },
        { name: 'Bảo trì định kỳ', price: '200,000đ - 350,000đ' },
      ],
    },
    {
      icon: WashingMachine,
      title: 'Đồ gia dụng',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      items: [
        { name: 'Kiểm tra và báo giá', price: 'Miễn phí' },
        { name: 'Sửa máy giặt', price: '300,000đ - 900,000đ' },
        { name: 'Sửa tủ lạnh', price: '350,000đ - 1,200,000đ' },
        { name: 'Sửa lò vi sóng', price: '250,000đ - 700,000đ' },
        { name: 'Sửa quạt điện', price: '150,000đ - 400,000đ' },
        { name: 'Bảo trì thiết bị', price: '200,000đ+' },
      ],
    },
  ];

  const packages = [
    {
      name: 'Gói Cơ bản',
      price: '299,000đ',
      period: '/tháng',
      description: 'Phù hợp cho gia đình nhỏ',
      features: [
        '2 lần gọi thợ miễn phí phí di chuyển',
        'Giảm 10% chi phí sửa chữa',
        'Ưu tiên hỗ trợ trong giờ hành chính',
        'Tư vấn AI không giới hạn',
      ],
      highlighted: false,
    },
    {
      name: 'Gói Tiêu chuẩn',
      price: '599,000đ',
      period: '/tháng',
      description: 'Lựa chọn phổ biến nhất',
      features: [
        '5 lần gọi thợ miễn phí phí di chuyển',
        'Giảm 15% chi phí sửa chữa',
        'Ưu tiên hỗ trợ 24/7',
        'Tư vấn AI không giới hạn',
        'Bảo hành kéo dài thêm 2 tháng',
        'Kiểm tra định kỳ 1 lần/tháng',
      ],
      highlighted: true,
    },
    {
      name: 'Gói Cao cấp',
      price: '999,000đ',
      period: '/tháng',
      description: 'Cho gia đình và doanh nghiệp',
      features: [
        'Không giới hạn gọi thợ miễn phí phí di chuyển',
        'Giảm 20% chi phí sửa chữa',
        'Ưu tiên cao nhất 24/7',
        'Tư vấn AI không giới hạn',
        'Bảo hành kéo dài thêm 6 tháng',
        'Kiểm tra định kỳ 2 lần/tháng',
        'Hỗ trợ khẩn cấp trong 30 phút',
      ],
      highlighted: false,
    },
  ];

  const additionalFees = [
    { name: 'Phí di chuyển (trong 5km)', price: 'Miễn phí' },
    { name: 'Phí di chuyển (5-10km)', price: '30,000đ' },
    { name: 'Phí di chuyển (10-15km)', price: '50,000đ' },
    { name: 'Phí di chuyển (trên 15km)', price: '70,000đ+' },
    { name: 'Phụ phí ngoài giờ (22h-6h)', price: '50,000đ - 100,000đ' },
    { name: 'Phụ phí ngày lễ, Tết', price: '100,000đ - 200,000đ' },
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Miễn phí kiểm tra',
      description: 'Thợ sẽ kiểm tra và báo giá miễn phí trước khi sửa chữa',
    },
    {
      icon: Shield,
      title: 'Bảo hành dịch vụ',
      description: 'Cam kết bảo hành từ 1-6 tháng tùy loại dịch vụ',
    },
    {
      icon: Star,
      title: 'Giá cả minh bạch',
      description: 'Không phát sinh chi phí ẩn, báo giá rõ ràng ngay từ đầu',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#007BFF] to-[#0056b3] text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bảng giá dịch vụ</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Giá cả minh bạch, hợp lý và cạnh tranh. Miễn phí kiểm tra và báo giá.
          </p>
        </div>
      </section>

      {/* Service Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bảng giá theo dịch vụ
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Giá tham khảo cho các dịch vụ phổ biến. Giá cuối cùng phụ thuộc vào mức độ hư hỏng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${category.bgColor} p-3 rounded-lg`}>
                      <category.icon className={`h-7 w-7 ${category.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold">{category.title}</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start py-2 border-b last:border-0">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-semibold text-[#007BFF] ml-4 text-right whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 italic">
              * Giá trên chưa bao gồm chi phí linh kiện (nếu có). Linh kiện sẽ được báo giá riêng.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Packages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gói thành viên
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tiết kiệm hơn với các gói thành viên dành cho khách hàng thường xuyên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg relative ${
                  pkg.highlighted ? 'ring-2 ring-[#007BFF] scale-105' : ''
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#007BFF] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Phổ biến nhất
                    </span>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[#007BFF]">{pkg.price}</span>
                    <span className="text-gray-600">{pkg.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/customer/register">
                    <Button
                      className={`w-full ${
                        pkg.highlighted
                          ? 'bg-[#007BFF] hover:bg-[#0056b3]'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      Đăng ký ngay
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Fees */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Phụ phí & Chi phí khác
            </h2>
            <p className="text-lg text-gray-600">
              Các khoản phí bổ sung có thể phát sinh
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-4">
                {additionalFees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                    <span className="text-gray-700">{fee.name}</span>
                    <span className="font-semibold text-[#007BFF]">{fee.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-gray-600 mt-6 italic">
            * Các gói thành viên sẽ được miễn phí di chuyển theo số lần quy định
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <benefit.icon className="h-8 w-8 text-[#007BFF]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Tôi có phải trả tiền nếu thợ đến kiểm tra nhưng không sửa?</h3>
                <p className="text-gray-600">
                  Không. Kiểm tra và báo giá là hoàn toàn miễn phí. Bạn chỉ trả phí di chuyển nếu khoảng cách lớn hơn 5km.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Tôi có thể thanh toán bằng cách nào?</h3>
                <p className="text-gray-600">
                  Bạn có thể thanh toán bằng tiền mặt, chuyển khoản ngân hàng, hoặc ví điện tử (Momo, ZaloPay, VNPay).
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Dịch vụ có bảo hành không?</h3>
                <p className="text-gray-600">
                  Có. Tất cả dịch vụ đều được bảo hành từ 1-6 tháng tùy loại dịch vụ. Gói thành viên sẽ được kéo dài thời gian bảo hành.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Tôi có thể hủy gói thành viên không?</h3>
                <p className="text-gray-600">
                  Có. Bạn có thể hủy gói thành viên bất kỳ lúc nào. Chúng tôi sẽ hoàn lại số tiền chưa sử dụng theo tỷ lệ.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#007BFF] to-[#0056b3] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bắt đầu sử dụng dịch vụ ngay
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Đăng ký miễn phí và trải nghiệm dịch vụ sửa chữa chuyên nghiệp
          </p>
          <Link to="/customer/register">
            <Button size="lg" className="bg-white text-[#007BFF] hover:bg-gray-100">
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
