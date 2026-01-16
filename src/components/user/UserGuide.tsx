import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  Camera, 
  DollarSign, 
  MapPin, 
  Shield, 
  CheckCircle, 
  Lightbulb, 
  Star, 
  AlertTriangle,
  CreditCard,
  FileText,
  Zap,
  Clock,
  Award,
  User,
  Phone
} from 'lucide-react';

export function UserGuide() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-16 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold bg-blue-600/10 px-4 py-2 rounded-full text-blue-700 uppercase tracking-wide">
              Cẩm nang người dùng
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Hướng dẫn cho
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Khách hàng
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm dịch vụ sửa chữa nhà kiểu mới: Chụp ảnh AI, nhận báo giá tức thì và kết nối thợ gần nhất chỉ với một chạm.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-24">

          {/* Step 1: Smart Photography */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                  1
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  Chụp ảnh thông minh
                </h2>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Để AI có thể chẩn đoán chính xác nhất, chất lượng hình ảnh là yếu tố quan trọng hàng đầu. Hãy cung cấp cái nhìn toàn diện về sự cố bạn đang gặp phải.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Chụp ở nơi có đủ ánh sáng (mở rèm hoặc bật đèn)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Gồm 1 ảnh toàn cảnh và 2-3 ảnh cận cảnh chi tiết vết hư hỏng</span>
                </div>
              </div>

              <Card className="bg-yellow-50 border-yellow-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-800 text-sm uppercase">Mẹo nhỏ</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Đặt một vật dụng quen thuộc cạnh vết nứt để AI nhận diện kích thước thực tế tốt hơn.
                </p>
              </Card>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <Camera className="w-24 h-24 text-blue-600/30" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: AI Quote */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <DollarSign className="w-24 h-24 text-purple-600/30" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                  2
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  Hiểu về báo giá AI
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Hệ thống AI phân tích hàng ngàn dữ liệu thị trường để đưa ra mức giá tham khảo minh bạch, giúp bạn chủ động về ngân sách ngay lập tức.
              </p>

              <div className="space-y-4">
                <Card className="p-4 border-2 hover:border-purple-200 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Giá tham khảo tức thì</h4>
                      <p className="text-sm text-gray-600">
                        Biết trước khoảng giá thị trường trước khi đặt thợ, không lo bị "hét giá".
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-2 hover:border-purple-200 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Công bằng & Minh bạch</h4>
                      <p className="text-sm text-gray-600">
                        Giá dựa trên loại thiết bị và mức độ hư hỏng thực tế được AI nhận diện.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Step 3: Book Technician */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                  3
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  Đặt thợ ngay
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Tương tự như ứng dụng gọi xe, hệ thống sẽ tự động quét và kết nối bạn với những thợ sửa chữa chuyên nghiệp đang ở gần bạn nhất.
              </p>

              {/* Technician Card Preview */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white border-0 shadow-2xl mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Đang tìm thợ gần bạn...</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold">Thợ điện nước</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Cách bạn 1.2 km
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-green-400">Sẵn sàng</div>
                      <div className="flex items-center text-xs text-yellow-400 gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        4.9
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  XÁC NHẬN ĐẶT LỊCH
                </Button>
              </Card>

              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Điều phối thông minh</h4>
                  <p className="text-sm text-gray-600">
                    Hệ thống ưu tiên thợ có đánh giá cao nhất và ở gần bạn nhất để giảm thiểu thời gian chờ đợi.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <Clock className="w-24 h-24 text-green-600/30" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4: Safe Payment */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-3xl blur-2xl"></div>
                <Card className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-12 rounded-3xl text-white text-center border-0 shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-black mb-3">Hệ thống Ký quỹ</h4>
                  <p className="text-blue-100 text-sm">
                    Tiền của bạn chỉ được chuyển cho thợ sau khi bạn bấm xác nhận "Đã hoàn thành & Hài lòng".
                  </p>
                </Card>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                  4
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  Thanh toán an toàn
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Chúng tôi bảo vệ quyền lợi tài chính của bạn thông qua cơ chế thanh toán trung gian. Không cần lo lắng về việc thợ nhận tiền rồi làm dối.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700">Đa dạng hình thức: Chuyển khoản, Ví điện tử, Thẻ Visa/Master</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700">Tự động xuất hóa đơn điện tử và lưu lịch sử bảo hành</span>
                </div>
              </div>

              <Card className="bg-red-50 border-red-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-800 text-sm uppercase">Cảnh báo</span>
                </div>
                <p className="text-sm text-red-700">
                  Tuyệt đối không thanh toán tiền mặt trực tiếp cho thợ ngoài hệ thống để được hưởng đầy đủ chính sách bảo hành.
                </p>
              </Card>
            </div>
          </section>

        </div>

        {/* CTA Section */}
        <section className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-20"></div>
          <Card className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-12 rounded-3xl text-white text-center border-0 shadow-2xl overflow-hidden">
            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Bạn gặp sự cố cần sửa ngay?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Bắt đầu ngay để AI chẩn đoán và kết nối bạn với thợ sửa chữa trong chưa đầy 5 phút.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/services">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-xl shadow-2xl">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Gửi yêu cầu ngay
                  </Button>
                </Link>
                <Link to="/support">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 border-2 border-white text-white hover:bg-white/20 font-bold px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Liên hệ hỗ trợ 24/7
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-semibold">Bảo hành cam kết</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-semibold">Thợ chuyên nghiệp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-semibold">Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
        
    </div>
  );
}