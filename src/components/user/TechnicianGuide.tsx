import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState, useEffect, useRef } from 'react';
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
  Clock,
  Target,
  TrendingUp,
  User,
  Phone,
  DollarSign,
  ChevronDown
} from 'lucide-react';

export function TechnicianGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.05;

      if (step1Ref.current && step2Ref.current && step3Ref.current && step4Ref.current) {
        const step1Top = step1Ref.current.offsetTop;
        const step2Top = step2Ref.current.offsetTop;
        const step3Top = step3Ref.current.offsetTop;
        const step4Top = step4Ref.current.offsetTop;

        if (scrollPosition >= step4Top) {
          setActiveStep(4);
        } else if (scrollPosition >= step3Top) {
          setActiveStep(3);
        } else if (scrollPosition >= step2Top) {
          setActiveStep(2);
        } else {
          setActiveStep(1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
    return (
        <div className="flex flex-col min-h-screen bg-white">
            
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-16 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold bg-teal-600/10 px-4 py-2 rounded-full text-teal-700 uppercase tracking-wide">
              Cẩm nang thợ sửa chữa
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Hướng dẫn cho
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              Thợ Sửa Chữa
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Nhận việc tức thì như tài xế công nghệ: Bật chế độ "Sẵn sàng", nhận yêu cầu gần bạn và kiếm tiền ngay.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-16 relative">
            
            {/* Left Side - Steps Content */}
            <div className="flex-1 space-y-[50vh]">
              
              {/* Step 1: Hoàn thiện hồ sơ */}
              <div ref={step1Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-teal-600/10 px-4 py-2 rounded-full text-teal-700 uppercase tracking-wide mb-4">
                    Bước 1
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Hoàn thiện hồ sơ
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Hồ sơ của bạn là bộ mặt thương hiệu. Cập nhật đầy đủ để AI ưu tiên phân phối yêu cầu chất lượng.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Tải chứng chỉ nghề nghiệp</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Ảnh đại diện chuyên nghiệp</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Kích hoạt vị trí GPS</span>
                    </div>
                  </div>

                  <Card className="bg-teal-50 border-teal-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-teal-600" />
                      <span className="font-bold text-teal-800 text-sm uppercase">Lưu ý</span>
                    </div>
                    <p className="text-sm text-teal-700">
                      Hồ sơ hoàn chỉnh giúp bạn nhận nhiều yêu cầu hơn 3 lần.
                    </p>
                  </Card>
                </div>
              </div>

              {/* Step 2: Nhận yêu cầu */}
              <div ref={step2Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-blue-600/10 px-4 py-2 rounded-full text-blue-700 uppercase tracking-wide mb-4">
                    Bước 2
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Nhận yêu cầu gần bạn
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Bật trạng thái "Online" và hệ thống tự động gửi yêu cầu từ khách hàng gần bạn nhất.
                  </p>

                  <div className="space-y-4 mb-6">
                    <Card className="p-4 border-2 hover:border-blue-200 transition-all">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Phản hồi nhanh</h4>
                          <p className="text-sm text-gray-600">
                            Chấp nhận yêu cầu trong 15-30 giây
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 border-2 hover:border-blue-200 transition-all">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Xem trước chi tiết</h4>
                          <p className="text-sm text-gray-600">
                            Loại hư hỏng và đơn giá từ AI
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Step 3: Di chuyển */}
              <div ref={step3Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-indigo-600/10 px-4 py-2 rounded-full text-indigo-700 uppercase tracking-wide mb-4">
                    Bước 3
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Di chuyển đến điểm hẹn
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Hệ thống tích hợp bản đồ dẫn đường chính xác, liên hệ khách hàng dễ dàng qua app.
                  </p>

                  <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Dẫn đường thông minh</h4>
                      <p className="text-sm text-gray-600">
                        Google Maps tích hợp tìm đường ngắn nhất
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Nhận tiền */}
              <div ref={step4Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-amber-600/10 px-4 py-2 rounded-full text-amber-700 uppercase tracking-wide mb-4">
                    Bước 4
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Hoàn tất & Nhận tiền
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Chụp ảnh nghiệm thu, hoàn thành công việc và tiền về ví ngay lập tức.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700">Chụp ảnh kết quả</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700">Tiền về ví ngay lập tức</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700">Tích lũy đánh giá 5 sao</span>
                    </div>
                  </div>

                  <Card className="bg-amber-50 border-amber-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-amber-800 text-sm uppercase">Thu nhập</span>
                    </div>
                    <p className="text-sm text-amber-700">
                      Phí hoa hồng chỉ 15% - Minh bạch và rõ ràng.
                    </p>
                  </Card>
                </div>
              </div>

            </div>

            {/* Right Side - Sticky Phone */}
            <div className="hidden lg:block w-[400px] flex-shrink-0">
              <div className="sticky top-12 py-8">
                {/* Phone Frame */}
                <div className="w-[320px] h-[640px] bg-gray-100 rounded-[50px] shadow-2xl border-[12px] border-gray-900 relative overflow-hidden mx-auto">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-10"></div>
                    
                    {/* Screen Content */}
                    <div className="w-full h-full bg-white overflow-hidden">
                      
                      {/* Step 1 Content - Profile Setup */}
                      {activeStep === 1 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Hồ sơ thợ</h3>
                            <p className="text-xs text-gray-500">Hoàn thiện thông tin</p>
                          </div>
                          
                          {/* Avatar Upload */}
                          <div className="flex justify-center mb-6">
                            <div className="relative">
                              <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-teal-600" />
                              </div>
                              <div className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                <Camera className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          {/* Profile Info */}
                          <div className="space-y-3 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="text-xs text-gray-500 mb-1">Họ tên</div>
                              <div className="font-semibold">Nguyễn Văn Thợ</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="text-xs text-gray-500 mb-1">Chuyên môn</div>
                              <div className="font-semibold">Điện - Nước - Xây dựng</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="text-xs text-gray-500 mb-1">Kinh nghiệm</div>
                              <div className="font-semibold">5 năm</div>
                            </div>
                          </div>

                          {/* Certification Status */}
                          <Card className="bg-green-50 border-green-200 p-3 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-green-800">Đã xác minh</div>
                                <div className="text-xs text-green-600">Chứng chỉ nghề nghiệp</div>
                              </div>
                            </div>
                          </Card>

                          {/* Action Button */}
                          <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold py-3 rounded-xl shadow-lg mt-auto">
                            Cập nhật hồ sơ
                          </button>
                        </div>
                      )}

                      {/* Step 2 Content - Receive Request */}
                      {activeStep === 2 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Yêu cầu mới</h3>
                            <p className="text-xs text-gray-500">Gần vị trí của bạn</p>
                          </div>

                          {/* Status Toggle */}
                          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-gray-900">Trạng thái</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">OFF</span>
                                <div className="w-12 h-6 bg-teal-600 rounded-full relative cursor-pointer">
                                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                                </div>
                                <span className="text-xs text-teal-600 font-bold">ON</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">Bật để nhận yêu cầu</p>
                          </div>

                          {/* Request Card */}
                          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-semibold text-gray-700">YÊU CẦU MỚI</span>
                              </div>
                              <span className="text-xs font-bold text-blue-600">1.2 km</span>
                            </div>

                            <div className="mb-3">
                              <div className="font-bold text-gray-900 mb-1">Sửa tường nứt</div>
                              <div className="text-xs text-gray-600 mb-2">Diện tích ~2m²</div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-600">Quận 9, TP.HCM</span>
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 mb-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Giá AI ước tính</span>
                                <span className="text-lg font-black text-teal-600">2.0M</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold">
                                Bỏ qua
                              </button>
                              <button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg text-sm font-bold shadow-lg">
                                Nhận ngay
                              </button>
                            </div>
                          </Card>

                          {/* Timer */}
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Thời gian còn lại</div>
                            <div className="text-2xl font-black text-gray-900">00:25</div>
                          </div>
                        </div>
                      )}

                      {/* Step 3 Content - Navigation */}
                      {activeStep === 3 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Đang đến</h3>
                            <p className="text-xs text-gray-500">Theo dõi lộ trình</p>
                          </div>

                          {/* Map Area */}
                          <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 relative overflow-hidden mb-4">
                            {/* Map Grid */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                              }}></div>
                            </div>

                            {/* Route Line */}
                            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-l-4 border-b-4 border-dashed border-indigo-600 rounded-bl-3xl"></div>

                            {/* Start Point */}
                            <div className="absolute top-1/4 left-1/4">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            </div>

                            {/* End Point */}
                            <div className="absolute bottom-1/4 right-1/4">
                              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                            </div>

                            {/* Distance Badge */}
                            <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1 shadow-md">
                              <div className="text-xs font-bold text-indigo-600">1.2 km</div>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <Card className="bg-gray-50 border-gray-200 p-4 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-sm">Anh Minh</div>
                                <div className="text-xs text-gray-500">Khách hàng</div>
                              </div>
                              <button className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <Phone className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-600 flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>123 Đường D1, Quận 9, TP.HCM</span>
                            </div>
                          </Card>

                          {/* Action Button */}
                          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg">
                            Đã đến nơi
                          </button>
                        </div>
                      )}

                      {/* Step 4 Content - Payment */}
                      {activeStep === 4 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Hoàn thành</h3>
                            <p className="text-xs text-gray-500">Nghiệm thu công việc</p>
                          </div>

                          {/* Photo Upload */}
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-dashed border-amber-300 p-6 text-center mb-4">
                            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Camera className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Chụp ảnh kết quả</p>
                            <p className="text-xs text-gray-500">Để xác nhận hoàn thành</p>
                          </div>

                          {/* Work Summary */}
                          <Card className="bg-gray-50 border-gray-200 p-4 mb-4">
                            <div className="text-xs text-gray-500 mb-2">Tóm tắt công việc</div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Dịch vụ:</span>
                                <span className="font-semibold">Sửa tường nứt</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Thời gian:</span>
                                <span className="font-semibold">2.5 giờ</span>
                              </div>
                              <div className="border-t border-gray-200 pt-2 mt-2"></div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-semibold">Tổng thu nhập:</span>
                                <span className="text-xl font-black text-teal-600">2,000,000đ</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Phí hoa hồng (15%):</span>
                                <span className="text-red-600">-300,000đ</span>
                              </div>
                              <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-900">Thực nhận:</span>
                                <span className="text-green-600">1,700,000đ</span>
                              </div>
                            </div>
                          </Card>

                          {/* Rating Received */}
                          <div className="bg-yellow-50 rounded-xl p-3 mb-4 text-center">
                            <div className="flex justify-center gap-1 mb-2">
                              {[1,2,3,4,5].map((i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-xs text-yellow-800 font-semibold">Đánh giá từ khách hàng</p>
                          </div>

                          {/* Action Button */}
                          <button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg">
                            <Wallet className="w-5 h-5 inline mr-2" />
                            Xác nhận & Nhận tiền
                          </button>
                        </div>
                      )}

                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-3xl blur-xl opacity-20"></div>
            <Card className="relative bg-gradient-to-br from-teal-600 to-cyan-600 p-12 rounded-3xl text-white text-center border-0 shadow-2xl overflow-hidden">
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
                      className="bg-white/10 border-2 border-white text-white hover:bg-white/20 font-bold px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
                    >
                      <Headphones className="w-5 h-5 mr-2" />
                      Hỗ trợ đăng ký
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-200" />
                    <span className="text-sm font-semibold">Thu nhập cao</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-200" />
                    <span className="text-sm font-semibold">Linh hoạt thời gian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm font-semibold">Được đào tạo</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
