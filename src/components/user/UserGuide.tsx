import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState, useEffect, useRef } from 'react';
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
  Award,
  User,
  Phone,
  Sparkles,
} from 'lucide-react';

export function UserGuide() {
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
      <main className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-16 relative">
            
            {/* Left Side - Steps Content */}
            <div className="flex-1 space-y-[50vh] pb-24">
              
              {/* Step 1: Chụp ảnh thông minh */}
              <div ref={step1Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-blue-600/10 px-4 py-2 rounded-full text-blue-700 uppercase tracking-wide mb-4">
                    Bước 1
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Chụp ảnh thông minh
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Để AI có thể chẩn đoán chính xác nhất, chất lượng hình ảnh là yếu tố quan trọng hàng đầu.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Chụp ở nơi có đủ ánh sáng</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">1 ảnh toàn cảnh + 2-3 ảnh cận cảnh</span>
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
              </div>

              {/* Step 2: Hiểu về báo giá AI */}
              <div ref={step2Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-purple-600/10 px-4 py-2 rounded-full text-purple-700 uppercase tracking-wide mb-4">
                    Bước 2
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Hiểu về báo giá AI
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Hệ thống AI phân tích hàng ngàn dữ liệu thị trường để đưa ra mức giá tham khảo minh bạch.
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
                            Biết trước khoảng giá thị trường, không lo bị "hét giá".
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Step 3: Đặt thợ ngay */}
              <div ref={step3Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-green-600/10 px-4 py-2 rounded-full text-green-700 uppercase tracking-wide mb-4">
                    Bước 3
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Đặt thợ ngay
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Tương tự như ứng dụng gọi xe, hệ thống tự động kết nối với thợ sửa chữa gần bạn nhất.
                  </p>

                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Điều phối thông minh</h4>
                      <p className="text-sm text-gray-600">
                        Ưu tiên thợ có đánh giá cao và ở gần nhất.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Thanh toán an toàn */}
              <div ref={step4Ref} className="min-h-[60vh] flex items-center">
                <div>
                  <span className="inline-block text-sm font-bold bg-orange-600/10 px-4 py-2 rounded-full text-orange-700 uppercase tracking-wide mb-4">
                    Bước 4
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Thanh toán an toàn
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-6">
                    Bảo vệ quyền lợi tài chính qua cơ chế thanh toán trung gian. Tiền chỉ chuyển khi bạn hài lòng.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700">Chuyển khoản, Ví điện tử, Thẻ</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700">Hóa đơn & lịch sử bảo hành</span>
                    </div>
                  </div>

                  <Card className="bg-red-50 border-red-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-red-800 text-sm uppercase">Cảnh báo</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Không thanh toán tiền mặt trực tiếp ngoài hệ thống.
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
                      
                      {/* Step 1 Content - Camera Upload */}
                      {activeStep === 1 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Chụp ảnh sự cố</h3>
                            <p className="text-xs text-gray-500">Tải lên 1-4 ảnh để AI phân tích</p>
                          </div>
                          
                          {/* Main Upload Area */}
                          <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center mb-4">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                              <Camera className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Chạm để chụp</p>
                            <p className="text-xs text-gray-500">hoặc chọn từ thư viện</p>
                          </div>

                          {/* Tips */}
                          <div className="bg-yellow-50 rounded-xl p-3 mb-4">
                            <div className="flex gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-yellow-800 mb-1">Mẹo chụp tốt:</p>
                                <ul className="text-xs text-yellow-700 space-y-0.5">
                                  <li>• Chụp ở nơi sáng</li>
                                  <li>• Nhiều góc độ khác nhau</li>
                                  <li>• Cận cảnh chi tiết hư hỏng</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-xl shadow-lg">
                            Bắt đầu tải ảnh
                          </button>
                        </div>
                      )}

                      {/* Step 2 Content - AI Quote */}
                      {activeStep === 2 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Báo giá AI</h3>
                            <p className="text-xs text-gray-500">Phân tích tức thì từ hình ảnh</p>
                          </div>

                          {/* AI Analysis */}
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-bold text-purple-900">AI đang phân tích...</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Loại sự cố:</span>
                                <span className="font-semibold">Tường nứt</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Mức độ:</span>
                                <span className="font-semibold text-orange-600">Trung bình</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Diện tích:</span>
                                <span className="font-semibold">~2m²</span>
                              </div>
                            </div>
                          </div>

                          {/* Price Estimate */}
                          <Card className="border-2 border-purple-200 p-4 mb-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Giá tham khảo</div>
                              <div className="text-3xl font-black text-purple-600 mb-2">
                                1.5-2.5 triệu
                              </div>
                              <div className="text-xs text-gray-600">
                                * Giá chính xác sẽ được thợ báo sau khi khảo sát
                              </div>
                            </div>
                          </Card>

                          {/* Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600">Vật liệu: ~500k - 800k</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600">Công thợ: ~1M - 1.7M</span>
                            </div>
                          </div>

                          {/* Action */}
                          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg mt-auto">
                            Tiếp tục đặt thợ
                          </button>
                        </div>
                      )}

                      {/* Step 3 Content - Find Technician */}
                      {activeStep === 3 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Tìm thợ gần bạn</h3>
                            <p className="text-xs text-gray-500">Hệ thống đang quét...</p>
                          </div>

                          {/* Map Area */}
                          <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 relative overflow-hidden mb-4">
                            {/* Map Grid Pattern */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                              }}></div>
                            </div>

                            {/* Location Markers */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 whitespace-nowrap">
                                Bạn
                              </div>
                            </div>

                            {/* Technician Markers */}
                            <div className="absolute top-1/4 left-1/3">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="absolute top-1/3 right-1/4">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="absolute bottom-1/4 left-1/4">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            {/* Distance Indicator */}
                            <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1 shadow-md">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-green-600" />
                                <span className="text-xs font-bold">1.2 km</span>
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="bg-green-50 rounded-xl p-3 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-xs font-semibold text-green-800">Đã tìm thấy 3 thợ gần bạn</span>
                            </div>
                          </div>

                          {/* Best Technician Card */}
                          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white border-0 shadow-xl mb-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center font-bold text-lg">
                                TN
                              </div>
                              <div className="flex-1">
                                <div className="font-bold">Nguyễn Văn Thợ</div>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  Cách bạn 1.2 km
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-xs text-yellow-400 gap-1 mb-1">
                                  <Star className="w-3 h-3 fill-yellow-400" />
                                  <span className="font-bold">4.9</span>
                                </div>
                                <div className="text-xs text-green-400 font-bold">Sẵn sàng</div>
                              </div>
                            </div>

                            <div className="flex gap-2 mb-3">
                              <div className="flex-1 bg-white/10 rounded-lg px-2 py-1 text-center">
                                <div className="text-xs text-gray-400">Kinh nghiệm</div>
                                <div className="text-sm font-bold">5 năm</div>
                              </div>
                              <div className="flex-1 bg-white/10 rounded-lg px-2 py-1 text-center">
                                <div className="text-xs text-gray-400">Đã hoàn thành</div>
                                <div className="text-sm font-bold">234 việc</div>
                              </div>
                            </div>

                            <div className="text-xs text-gray-400 mb-3">
                              Chuyên: Sửa tường, sơn, chống thấm
                            </div>
                          </Card>

                          {/* Action Button */}
                          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5" />
                            Xác nhận đặt lịch
                          </button>
                        </div>
                      )}

                      {/* Step 4 Content - Payment */}
                      {activeStep === 4 && (
                        <div className="p-6 h-full flex flex-col animate-fadeIn">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Thanh toán</h3>
                            <p className="text-xs text-gray-500">Chọn phương thức thanh toán</p>
                          </div>

                          {/* Payment Methods */}
                          <div className="space-y-3 mb-4">
                            <div className="border-2 border-blue-600 bg-blue-50 rounded-xl p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                  <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-sm">Chuyển khoản</div>
                                  <div className="text-xs text-gray-600">QR Code - Nhanh chóng</div>
                                </div>
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            </div>

                            <div className="border-2 border-gray-200 rounded-xl p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <DollarSign className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-sm">Ví điện tử</div>
                                  <div className="text-xs text-gray-600">Momo, ZaloPay, VNPay</div>
                                </div>
                              </div>
                            </div>

                            <div className="border-2 border-gray-200 rounded-xl p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <CreditCard className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-sm">Thẻ tín dụng</div>
                                  <div className="text-xs text-gray-600">Visa, Mastercard</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Escrow Info */}
                          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm mb-1">Hệ thống Ký quỹ</h4>
                                <p className="text-xs text-blue-100">
                                  Tiền chỉ được chuyển cho thợ sau khi bạn xác nhận "Đã hoàn thành & Hài lòng"
                                </p>
                              </div>
                            </div>
                          </Card>

                          {/* Order Summary */}
                          <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">Tổng chi phí:</span>
                              <span className="text-sm font-bold">2,000,000đ</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Phí dịch vụ:</span>
                              <span className="text-sm font-bold text-green-600">Miễn phí</span>
                            </div>
                          </div>

                          {/* Action */}
                          <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 rounded-xl shadow-lg">
                            <Shield className="w-5 h-5 inline mr-2" />
                            Thanh toán an toàn
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-20"></div>
            <Card className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-12 rounded-3xl text-white text-center border-0 shadow-2xl overflow-hidden">
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