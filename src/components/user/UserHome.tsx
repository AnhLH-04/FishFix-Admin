import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Search, Wrench, Shield, Star, CheckCircle, Zap, Award, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function UserHome() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

{/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 text-gray-800 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-sm font-semibold bg-blue-200/40 px-4 py-2 rounded-full text-blue-700 backdrop-blur-sm">
                    ✨ Giải pháp sửa chữa thông minh
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-gray-900">
                  Sửa chữa gia đình
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
                    nhanh như gọi Grab
                  </span>
                </h1>
              </div>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
                Kết nối bạn với thợ sửa chữa chuyên nghiệp trong vòng 1-2 giờ. Đặt lịch dễ dàng, giá cả minh bạch, an toàn và đáng tin cậy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/services" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 font-semibold gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    Đặt dịch vụ ngay
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/ai" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold transition-all duration-300"
                  >
                    Tư vấn AI miễn phí
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-300">
                <div className="group cursor-pointer">
                  <div className="text-4xl md:text-5xl font-black text-gray-900 group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Thợ sửa chữa</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl md:text-5xl font-black text-gray-900 group-hover:scale-110 transition-transform duration-300">10k+</div>
                  <div className="text-sm text-gray-600 mt-1">Khách hàng</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl md:text-5xl font-black text-gray-900 group-hover:scale-110 transition-transform duration-300">4.9★</div>
                  <div className="text-sm text-gray-600 mt-1">Đánh giá</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-float">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1513612027093-46da490bbd5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVwYWlyJTIwc2VydmljZXxlbnwxfHx8fDE3NjgxOTc1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Home repair service"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12">
            Tại sao chọn FishFix?
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Features List */}
            <div className="space-y-6">
              {[
                { icon: Shield, title: 'Thợ được xác minh', desc: 'Tất cả thợ đều được kiểm tra lý lịch và chứng chỉ nghề' },
                { icon: Zap, title: 'Phản hồi nhanh', desc: 'Thợ phản hồi trong vòng 15 phút, có mặt trong 1 giờ' },
                { icon: Star, title: 'Đánh giá minh bạch', desc: 'Xem đánh giá thực từ khách hàng trước khi chọn thợ' },
                { icon: CheckCircle, title: 'Bảo hành dịch vụ', desc: 'Cam kết bảo hành cho mọi công việc sửa chữa' },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - AI Card */}
            <div className="lg:sticky lg:top-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl blur-2xl" />
                <Card className="relative border-2 border-gray-200 shadow-xl rounded-3xl overflow-hidden bg-white">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl">AI Chẩn đoán thông minh</h4>
                        <p className="text-sm text-blue-50">Phân tích sự cố từ ảnh chụp</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="bg-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Loại sự cố:</span>
                        <span className="font-semibold text-gray-900">Điều hòa không lạnh</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mức độ:</span>
                        <span className="font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">Trung bình</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ước tính chi phí:</span>
                        <span className="font-semibold text-blue-600 text-base">300.000₫ - 800.000₫</span>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-xs text-yellow-800 flex items-start gap-2">
                        <span className="flex-shrink-0">⚠️</span>
                        <span>Đây chỉ là ước lượng. Chi phí thực tế có thể thay đổi sau khi kiểm tra.</span>
                      </p>
                    </div>

                    <Link to="/ai" className="block mt-4">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all">
                        Thử AI ngay - Miễn phí
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4 bg-blue-50 px-4 py-2 rounded-full">
              Dịch Vụ
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Dịch Vụ Của FishFix</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Chọn dịch vụ và tìm thợ trong vài giây
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { name: 'Sửa Điện', icon: '⚡', color: 'from-yellow-400 via-orange-400 to-red-400' },
              { name: 'Sửa Nước', icon: '💧', color: 'from-blue-400 via-cyan-400 to-teal-400' },
              { name: 'Điều Hòa', icon: '❄️', color: 'from-cyan-400 via-sky-400 to-blue-400' },
              { name: 'Sơn Nhà', icon: '🎨', color: 'from-pink-400 via-rose-400 to-red-400' },
              { name: 'Sửa Điện Tử', icon: '📱', color: 'from-purple-400 via-violet-400 to-indigo-400' },
              { name: 'Mộc & Đồ Gỗ', icon: '🪵', color: 'from-amber-400 via-orange-400 to-yellow-600' },
              { name: 'Sửa Xe', icon: '🏍️', color: 'from-red-400 via-rose-400 to-pink-400' },
              { name: 'Vệ Sinh', icon: '🧹', color: 'from-green-400 via-emerald-400 to-teal-400' }
            ].map((service, index) => (
              <Link key={service.name} to="/services">
                <div className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
                  <Card className="relative border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 cursor-pointer bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="text-center p-8">
                      <div 
                        className={`mx-auto bg-gradient-to-br ${service.color} w-24 h-24 rounded-2xl flex items-center justify-center mb-5 shadow-xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <div className="text-5xl filter drop-shadow-lg">{service.icon}</div>
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">{service.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-xl font-bold px-12 py-8 h-auto rounded-2xl group">
                Xem Tất Cả Dịch Vụ
                <Search className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Con Số Ấn Tượng</h2>
            <p className="text-xl text-blue-200 font-light">Được tin tưởng bởi hàng ngàn người dùng</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: '5K+', label: 'Thợ Sửa', sub: 'Được xác minh', gradient: 'from-yellow-300 via-orange-300 to-pink-300' },
              { value: '50K+', label: 'Khách Hàng', sub: 'Hài lòng', gradient: 'from-cyan-300 via-blue-300 to-indigo-300' },
              { value: '100K+', label: 'Công Việc', sub: 'Hoàn thành', gradient: 'from-green-300 via-emerald-300 to-teal-300' },
              { value: '4.9★', label: 'Đánh Giá', sub: 'Trung bình', gradient: 'from-yellow-300 via-amber-300 to-orange-300' }
            ].map((stat) => (
              <div key={stat.label} className="text-center group cursor-pointer">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className={`text-6xl md:text-7xl font-black mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-blue-200 text-lg font-semibold mb-1">{stat.label}</div>
                  <div className="text-blue-300/60 text-sm">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-[3rem] shadow-2xl p-12 md:p-20 text-center text-white overflow-hidden">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mb-8">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Miễn phí đăng ký</span>
                </div>

                <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                  Bắt Đầu Ngay<br />Hôm Nay! 🚀
                </h2>
                
                <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                  Tìm thợ chuyên nghiệp trong <span className="font-bold text-yellow-300">5 phút</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/services">
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-yellow-300 hover:text-blue-900 shadow-2xl hover:shadow-white/50 transition-all duration-300 text-2xl font-bold px-14 py-9 h-auto rounded-2xl group">
                      <Wrench className="mr-3 h-8 w-8 group-hover:rotate-12 transition-transform" />
                      Tìm Thợ Ngay
                    </Button>
                  </Link>
                  <Link to="/technicians">
                    <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-blue-700 transition-all duration-300 text-2xl font-semibold px-14 py-9 h-auto rounded-2xl">
                      Duyệt Thợ
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-300" />
                    <span className="font-semibold">Không phí ẩn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-300" />
                    <span className="font-semibold">Bảo mật 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                    <span className="font-semibold">Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
