import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  ShieldCheck,
  Bell,
  MapPin,
  Wallet,
  CheckCircle,
  Camera,
  Star,
  MessageSquare,
  Zap,
  Award,
  Download,
  Headphones,
  ChevronDown,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

export function TechnicianGuide() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 text-xs font-bold tracking-widest text-teal-400 uppercase bg-teal-500/10 rounded-full border border-teal-500/20">
              Mô hình nhận việc tức thì
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Chủ động thu nhập với quy trình
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Nhận việc như tài xế công nghệ
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Không còn phải chờ đợi báo giá. Chỉ cần bật chế độ "Sẵn sàng", nhận yêu cầu gần bạn và bắt đầu kiếm tiền ngay lập tức.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-xl">
              <Zap className="w-5 h-5 mr-2" />
              Bật trực tuyến ngay
            </Button>
            <Button size="lg" variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 font-bold px-8 py-6 text-lg rounded-xl">
              <Download className="w-5 h-5 mr-2" />
              Video hướng dẫn
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content - Steps Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          
          {/* Step 1: Complete Profile */}
          <Card className="bg-white p-8 rounded-2xl shadow-2xl border-0 hover:shadow-3xl transition-all">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 flex-shrink-0 border-2 border-teal-100">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-teal-600 mb-1 block uppercase tracking-wider">
                  Bước 01
                </span>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Hoàn thiện hồ sơ tin cậy
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Hồ sơ của bạn là bộ mặt thương hiệu. Hãy cập nhật đầy đủ để hệ thống AI ưu tiên phân phối các yêu cầu chất lượng cao.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Tải lên chứng chỉ nghề nghiệp và bằng cấp liên quan
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Cập nhật ảnh đại diện chuyên nghiệp (mặc đồng phục thợ)
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Kích hoạt vị trí GPS để nhận việc trong khu vực của bạn
                    </span>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border-2 border-gray-100">
                  <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                    <Award className="w-16 h-16 text-teal-600/30" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2: Receive Requests */}
          <Card className="bg-white p-8 rounded-2xl shadow-2xl border-0 hover:shadow-3xl transition-all">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 border-2 border-blue-100">
                <Bell className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-blue-600 mb-1 block uppercase tracking-wider">
                  Bước 02
                </span>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Nhận yêu cầu gần bạn
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Cơ chế nhận việc tức thì. Bạn chỉ cần bật trạng thái để hệ thống tự động gửi yêu cầu từ khách hàng đang cần gấp.
                </p>

                {/* Status Toggle Card */}
                <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                      Trạng thái làm việc
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Offline</span>
                      <div className="w-10 h-5 bg-teal-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-600 uppercase">Online</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 italic">
                    Gạt nút để bắt đầu nhận yêu cầu sửa chữa trong bán kính 5km.
                  </p>
                </Card>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Tốc độ là chìa khóa: Chấp nhận yêu cầu trong 15-30 giây
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Xem trước loại hư hỏng và đơn giá cố định từ AI
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Không cần đấu giá, bấm "Nhận ngay" để chốt đơn
                    </span>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border-2 border-gray-100">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Bell className="w-16 h-16 text-blue-600/30" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3: Navigate to Location */}
          <Card className="bg-white p-8 rounded-2xl shadow-2xl border-0 hover:shadow-3xl transition-all">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0 border-2 border-indigo-100">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-indigo-600 mb-1 block uppercase tracking-wider">
                  Bước 03
                </span>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Di chuyển đến điểm hẹn
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sau khi nhận việc, hãy nhanh chóng di chuyển đến vị trí khách hàng. Hệ thống tích hợp bản đồ dẫn đường chính xác.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Sử dụng Google Maps tích hợp để tìm đường ngắn nhất
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Nhắn tin hoặc gọi điện miễn phí qua app cho khách hàng
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Cập nhật trạng thái "Đã đến nơi" để khách hàng yên tâm
                    </span>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border-2 border-gray-100">
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-indigo-600/30" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 4: Complete & Get Paid */}
          <Card className="bg-white p-8 rounded-2xl shadow-2xl border-0 hover:shadow-3xl transition-all">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0 border-2 border-amber-100">
                <Wallet className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-amber-600 mb-1 block uppercase tracking-wider">
                  Bước 04
                </span>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Hoàn tất & Nhận tiền về ví
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Hoàn thành công việc, chụp ảnh nghiệm thu và tiền sẽ được chuyển vào ví của bạn ngay lập tức.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Camera className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Chụp ảnh kết quả để hệ thống xác nhận chất lượng
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wallet className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Tiền về ví ngay sau khi nhấn "Hoàn thành" trên app
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">
                      Tích lũy đánh giá 5 sao để nhận thêm nhiều yêu cầu mới
                    </span>
                  </div>
                </div>

                {/* Earnings Card */}
                <Card className="bg-gray-50 border-gray-200 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Thu nhập hôm nay</p>
                    <p className="text-2xl font-black text-gray-900">1,250,000đ</p>
                  </div>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-bold rounded-lg">
                    Rút tiền ngay
                  </Button>
                </Card>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600 text-lg">
              Giải đáp thắc mắc về mô hình nhận việc tức thì
            </p>
          </div>

          <div className="space-y-4">
            <Card className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-teal-200 transition-all">
              <button className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                <span className="font-bold text-gray-900 text-lg">
                  Tôi có thể chọn khu vực nhận việc không?
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              <div className="px-6 py-4 border-t border-gray-100 text-gray-600 leading-relaxed bg-gray-50">
                Có, bạn có thể thiết lập bán kính nhận việc trong phần cài đặt (ví dụ: 5km, 10km quanh vị trí hiện tại của bạn). Hệ thống sẽ chỉ gửi thông báo khi có khách hàng trong khu vực này.
              </div>
            </Card>

            <Card className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-teal-200 transition-all">
              <button className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                <span className="font-bold text-gray-900 text-lg">
                  Phí dịch vụ được tính như thế nào?
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              <div className="px-6 py-4 border-t border-gray-100 text-gray-600 leading-relaxed bg-gray-50">
                Khác với đấu giá, giá dịch vụ được AI tính toán sẵn dựa trên thị trường. Nền tảng chỉ thu phí hoa hồng cố định 15% trên mỗi đơn hàng thành công để duy trì kết nối và bảo hiểm công việc.
              </div>
            </Card>

            <Card className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-teal-200 transition-all">
              <button className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                <span className="font-bold text-gray-900 text-lg">
                  Làm sao để tôi không bỏ lỡ yêu cầu mới?
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              <div className="px-6 py-4 border-t border-gray-100 text-gray-600 leading-relaxed bg-gray-50">
                Hãy luôn giữ ứng dụng ở trạng thái "Online" và cấp quyền thông báo âm thanh mức cao nhất. Các yêu cầu thường được nhận rất nhanh, nên bạn cần phản ứng ngay khi có chuông báo.
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
          <Card className="relative bg-gradient-to-br from-teal-600 to-blue-600 p-12 rounded-3xl text-white text-center border-0 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Sẵn sàng kiếm thu nhập ngay?
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
                Hàng ngàn yêu cầu sửa chữa đang chờ đợi các kỹ thuật viên chuyên nghiệp như bạn.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/technician/register">
                  <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 font-bold px-8 py-6 text-lg rounded-xl shadow-2xl">
                    <Download className="w-5 h-5 mr-2" />
                    Tải App Đối Tác
                  </Button>
                </Link>
                <Link to="/support">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-teal-700 border-2 border-white text-white hover:bg-teal-800 font-bold px-8 py-6 text-lg rounded-xl"
                  >
                    <Headphones className="w-5 h-5 mr-2" />
                    Hỗ trợ đăng ký
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-200" />
                  <span className="text-sm font-semibold">Thu nhập cao</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span className="text-sm font-semibold">Linh hoạt thời gian</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-200" />
                  <span className="text-sm font-semibold">Được đào tạo</span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
            
        </div>
    )
}
