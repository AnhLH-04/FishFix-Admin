import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Wrench, Shield, Star, CheckCircle, Zap, Award, ArrowRight, Building2, Snowflake, Plug, Lightbulb, Sparkles, Droplet, Hammer, Truck, ClipboardList, Smartphone, Newspaper, MousePointerClick, UserCog, CreditCard, Rocket, AlertTriangle, Users, AirVent, Refrigerator, WashingMachine, Fan, Drill, PaintBucket } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { TechnicianMap } from './TechnicianMap';
import { useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion, useScroll, useTransform } from 'framer-motion';

export function UserHome() {
  const heroImageRef = useRef<HTMLDivElement>(null);
  const aiSectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based transforms for hero image
  const { scrollY } = useScroll();
  
  // Hero image stays fixed and moves to center as we scroll
  const imageY = useTransform(scrollY, [0, 800], [0, 350]);
  const imageX = useTransform(scrollY, [0, 800], [0, -150]);
  const imageScale = useTransform(scrollY, [0, 800], [1, 0.5]);
  const imageOpacity = useTransform(scrollY, [0, 700, 850], [1, 1, 0]);
  
  // AI section image appears when hero image disappears
  const aiImageOpacity = useTransform(scrollY, [750, 900], [0, 1]);
  
  // Animation hooks for each section with different thresholds
  const featuresSection = useScrollAnimation({ threshold: 0.2 });
  const servicesSection = useScrollAnimation({ threshold: 0.15 });
  const aiTechSection = useScrollAnimation({ threshold: 0.2 });
  const aiImageSection = useScrollAnimation({ threshold: 0.3 }); // For AI image
  const ctaSection = useScrollAnimation({ threshold: 0.25 });
  const howItWorksSection = useScrollAnimation({ threshold: 0.2 });
  const mapSection = useScrollAnimation({ threshold: 0.15 });

  // const toggleService = (serviceName: string) => {
  //   setExpandedService(expandedService === serviceName ? null : serviceName);
  // };
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Global Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .section-animate {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-slide-up {
          opacity: 0;
          transform: translateY(60px);
        }
        
        .fade-slide-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .fade-slide-left {
          opacity: 0;
          transform: translateX(-60px);
        }
        
        .fade-slide-left.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .fade-slide-right {
          opacity: 0;
          transform: translateX(60px);
        }
        
        .fade-slide-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scale-fade {
          opacity: 0;
          transform: scale(0.85);
        }
        
        .scale-fade.visible {
          opacity: 1;
          transform: scale(1);
        }
        
        .rotate-fade {
          opacity: 0;
          transform: perspective(1000px) rotateX(-15deg);
        }
        
        .rotate-fade.visible {
          opacity: 1;
          transform: perspective(1000px) rotateX(0deg);
        }
        
        .blur-fade {
          opacity: 0;
          filter: blur(10px);
          transform: translateY(30px);
        }
        
        .blur-fade.visible {
          opacity: 1;
          filter: blur(0px);
          transform: translateY(0);
        }
        
        /* Staggered animations */
        .stagger-item {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        .stagger-6 { transition-delay: 0.6s; }
      `}} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 text-gray-800 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-sm font-semibold bg-blue-200/40 px-4 py-2 rounded-full text-blue-700 backdrop-blur-sm flex items-center gap-2 w-fit">
                    <Sparkles className="w-4 h-4" />
                    Giải pháp sửa chữa thông minh
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-gray-900">
                  Sửa chữa nhanh chóng
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
                  Thợ giỏi tận tâm
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

            {/* Hero Image - Hidden on mobile, Fixed scroll on desktop */}
            <div className="hidden lg:block relative w-full lg:w-1/2">
              {/* Placeholder for layout */}
            </div>
          </div>

          {/* Desktop: Fixed Hero Image - scrolls through sections */}
          <motion.div 
            ref={heroImageRef}
            className="hidden lg:block fixed top-32 right-[5%] w-[600px] max-w-[45vw] h-[600px] z-10 pointer-events-none"
            style={{
              y: imageY,
              x: imageX,
              scale: imageScale,
              opacity: imageOpacity
            }}
          >
            <div className="relative rounded-2xl overflow-hidden w-full h-full">
              <ImageWithFallback
                src='https://res.cloudinary.com/dgds0gqq1/image/upload/v1768455637/Screenshot_2026-01-13_172259-removebg-preview_f29k8z.png'
                alt="Home repair service"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spacer to allow scroll - desktop only */}
      <div className="hidden lg:block h-[400px]"></div>

      {/* AI Technology Section */}
      <section 
        ref={aiTechSection.ref}
        className={`py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden section-animate rotate-fade ${
          aiTechSection.isVisible ? 'visible' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                Công nghệ
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Áp dụng công nghệ AI đột phá
            </h2>
          </div>

          {/* Animation Styles */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeInUp {
              animation: fadeInUp 0.8s ease-out forwards;
              opacity: 0;
            }
            .delay-200 {
              animation-delay: 0.5s;
            }
            .delay-400 {
              animation-delay: 1s;
            }
            .delay-600 {
              animation-delay: 1.5s;
            }
            .delay-800 {
              animation-delay: 2s;
            }
            .delay-1000 {
              animation-delay: 2.5s;
            }
          `}} />

          {/* Content Grid */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Features */}
            <div className="lg:col-span-4 space-y-6">
              {/* Feature 1 */}
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${aiImageSection.isVisible ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Trợ Lý AI Thông Minh
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Giúp xác định rõ vấn đề của Khách Hàng, từ đó tìm đúng Thợ phù hợp cho Khách Hàng
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${aiImageSection.isVisible ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sự Đa Dạng Ngôn Ngữ Với AI
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Không bao giờ bị rào cản ngôn ngữ ngăn cách bạn và giải pháp mà bạn cần
                </p>
              </div>
            </div>

            {/* Center Image */}
            <motion.div 
              ref={aiImageSection.ref}
              className="lg:col-span-4 flex justify-center"
              style={{ opacity: aiImageOpacity }}
            >
              <div className="relative w-full max-w-md aspect-square">
                <ImageWithFallback
                  src="https://res.cloudinary.com/dgds0gqq1/image/upload/v1768455637/Screenshot_2026-01-13_172259-removebg-preview_f29k8z.png"
                  alt="AI Technology"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Right Features */}
            <div className="lg:col-span-4 space-y-6">
              {/* Feature 3 */}
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${aiImageSection.isVisible ? 'animate-fadeInUp delay-600' : 'opacity-0'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  AI Hỗ Trợ Kiểm Tra Kỹ Năng Thợ
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nâng cao chất lượng Thợ và đảm bảo dịch vụ hoàn hảo tốt nhất cho Khách hàng
                </p>
              </div>

              {/* Feature 4 */}
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${aiImageSection.isVisible ? 'animate-fadeInUp delay-800' : 'opacity-0'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Tốc Độ Và Hiệu Suất Vượt Trội
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  AI giúp bạn tiết kiệm thời gian và tìm ra giải pháp một cách nhanh nhất
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section 
        ref={servicesSection.ref}
        className={`py-24 bg-gradient-to-b from-blue-50 via-white to-cyan-50 relative overflow-hidden section-animate scale-fade ${
          servicesSection.isVisible ? 'visible' : ''
        }`}
      >
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              DỊCH VỤ CỦA FISHFIX
            </h2>
            <p className="text-gray-600 text-base">
              Kết nối với dịch vụ sửa chữa chuyên nghiệp chỉ với một cú click
            </p>
          </div>

          {/* Infinite Scroll Carousel */}
          <div className="relative">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .animate-scroll {
                animation: scroll 40s linear infinite;
              }
              .animate-scroll:hover {
                animation-play-state: paused;
              }
            `}} />
            
            {/* Fade masks on both sides */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none"></div>
            
            <div className="overflow-hidden">
              <div className="flex animate-scroll" style={{ width: 'max-content' }}>
                {/* First set of services */}
                {[
                  { name: 'Xây Dựng', icon: Building2 },
                  { name: 'Cơ Khí', icon: Wrench },
                  { name: 'Điện Lạnh', icon: Snowflake },
                  { name: 'Điện Máy', icon: Plug },
                  { name: 'Điện Nước', icon: Lightbulb },
                  { name: 'Vệ Sinh', icon: Sparkles },
                  { name: 'Thông Nghẹt', icon: Droplet },
                  { name: 'Đồ Gỗ', icon: Hammer },
                  { name: 'Vận Chuyển', icon: Truck },
                  { name: 'Bảng Giá', icon: ClipboardList },
                  { name: 'Ứng Dụng', icon: Smartphone },
                  { name: 'Tin Tức', icon: Newspaper }
                ].concat([
                  { name: 'Xây Dựng', icon: Building2 },
                  { name: 'Cơ Khí', icon: Wrench },
                  { name: 'Điện Lạnh', icon: Snowflake },
                  { name: 'Điện Máy', icon: Plug },
                  { name: 'Điện Nước', icon: Lightbulb },
                  { name: 'Vệ Sinh', icon: Sparkles },
                  { name: 'Thông Nghẹt', icon: Droplet },
                  { name: 'Đồ Gỗ', icon: Hammer },
                  { name: 'Vận Chuyển', icon: Truck },
                  { name: 'Bảng Giá', icon: ClipboardList },
                  { name: 'Ứng Dụng', icon: Smartphone },
                  { name: 'Tin Tức', icon: Newspaper }
                ]).map((service, index) => (
                  <div
                    key={`${service.name}-${index}`}
                    className="flex-shrink-0 mx-4 group cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-w-[160px]">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                        {service.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8">
                Xem Tất Cả Dịch Vụ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresSection.ref}
        className={`py-16 bg-white section-animate fade-slide-up ${
          featuresSection.isVisible ? 'visible' : ''
        }`}
      >
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
                <div 
                  key={index} 
                  className={`flex gap-4 p-4 rounded-xl hover:bg-gray-50 stagger-item fade-slide-left stagger-${index + 1} ${
                    featuresSection.isVisible ? 'visible' : ''
                  }`}
                >
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
            <div 
              className={`lg:sticky lg:top-8 stagger-item fade-slide-right stagger-3 ${
                featuresSection.isVisible ? 'visible' : ''
              }`}
            >
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
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
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

      {/* CTA Section */}
      <section 
        ref={ctaSection.ref}
        className={`py-12 bg-gray-50 section-animate blur-fade ${
          ctaSection.isVisible ? 'visible' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white overflow-hidden rounded-3xl">
            {/* Orbital Animation Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(100px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(100px) rotate(-360deg);
            }
          }
          
          @keyframes orbit-reverse {
            0% {
              transform: rotate(0deg) translateX(120px) rotate(0deg);
            }
            100% {
              transform: rotate(-360deg) translateX(120px) rotate(360deg);
            }
          }
          
          @keyframes orbit-large {
            0% {
              transform: rotate(0deg) translateX(150px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(150px) rotate(-360deg);
            }
          }
          
          @keyframes orbit-small {
            0% {
              transform: rotate(0deg) translateX(80px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(80px) rotate(-360deg);
            }
          }
          
          .animate-orbit-1 {
            animation: orbit 20s linear infinite;
          }
          
          .animate-orbit-2 {
            animation: orbit-reverse 25s linear infinite;
          }
          
          .animate-orbit-3 {
            animation: orbit-large 30s linear infinite;
          }
          
          .animate-orbit-4 {
            animation: orbit-small 18s linear infinite;
          }
          
          .animate-orbit-5 {
            animation: orbit 35s linear infinite reverse;
          }
          
          .animate-orbit-6 {
            animation: orbit-reverse 22s linear infinite;
          }
          
          .animate-orbit-7 {
            animation: orbit-large 28s linear infinite reverse;
          }
          
          .animate-orbit-8 {
            animation: orbit-small 24s linear infinite;
          }
          
          .animate-orbit-9 {
            animation: orbit 32s linear infinite;
          }
          
          .animate-orbit-10 {
            animation: orbit-reverse 26s linear infinite reverse;
          }
        `}} />
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Floating Icons - Enhanced with orbital animation */}
        <div className="absolute top-20 left-10 animate-orbit-1">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <Wrench className="w-8 h-8 text-white/60" />
          </div>
        </div>
        <div className="absolute bottom-20 right-20 animate-orbit-2">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <Zap className="w-10 h-10 text-white/60" />
          </div>
        </div>
        <div className="absolute top-1/3 right-10 animate-orbit-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </div>
        </div>
        <div className="absolute top-40 left-1/4 animate-orbit-4">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <Users className="w-7 h-7 text-white/50" />
          </div>
        </div>
        <div className="absolute bottom-32 left-20 animate-orbit-5">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <AirVent className="w-8 h-8 text-white/60" />
          </div>
        </div>
        <div className="absolute top-1/4 right-1/4 animate-orbit-6">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <Refrigerator className="w-7 h-7 text-white/50" />
          </div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-orbit-7">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <WashingMachine className="w-6 h-6 text-white/50" />
          </div>
        </div>
        <div className="absolute top-1/2 left-16 animate-orbit-8">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <Fan className="w-7 h-7 text-white/60" />
          </div>
        </div>
        <div className="absolute top-2/3 right-16 animate-orbit-9">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <Drill className="w-6 h-6 text-white/50" />
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-orbit-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
            <PaintBucket className="w-8 h-8 text-white/60" />
          </div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 py-16">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="text-sm font-bold bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-white border border-white/30 flex items-center gap-2 w-fit mx-auto">
              <Rocket className="w-4 h-4" />
              Tham Gia Cộng Đồng FishFix
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Sẵn sàng trải nghiệm
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-200">
              dịch vụ sửa chữa thế hệ mới?
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Hàng nghìn khách hàng đã tin tưởng. Đăng ký ngay để nhận ưu đãi đặc biệt dành cho thành viên mới!
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/customer/register" className="group">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto px-8 py-6 text-lg font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 rounded-xl"
              >
                <span className="flex items-center gap-3">
                  Đăng ký khách hàng
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link to="/technician/register" className="group">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto px-8 py-6 text-lg font-bold backdrop-blur-sm bg-white/10 transition-all duration-300 hover:scale-105 rounded-xl"
              >
                <span className="flex items-center gap-3">
                  Đăng ký làm thợ
                  <Award className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-8 border-t border-white/20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base">Minh bạch</div>
                <div className="text-xs text-blue-200">Không phí ẩn</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base">An toàn</div>
                <div className="text-xs text-blue-200">Bảo mật 100%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm roundecd-full flex items-center justify-center group-hover:bg-white/20 transition-all">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base">Tận tâm</div>
                <div className="text-xs text-blue-200">Hỗ trợ 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={howItWorksSection.ref}
        className={`w-full px-4 md:px-10 py-16 bg-gray-50 section-animate fade-slide-right ${
          howItWorksSection.isVisible ? 'visible' : ''
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Quy Trình Hoạt Động
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto text-lg">
              Đơn giản, minh bạch và an toàn. FishFix giúp bạn giải quyết vấn đề chỉ trong 3 bước.
            </p>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 -z-0">
              <div className="w-full border-t-2 border-dashed border-gray-300"></div>
            </div>
            
            {/* Step 1 */}
            <div 
              className={`relative z-10 flex flex-col items-center text-center group stagger-item fade-slide-up stagger-2 ${
                howItWorksSection.isVisible ? 'visible' : ''
              }`}
            >
              <div className="mb-6 flex w-20 h-20 items-center justify-center rounded-2xl bg-white shadow-lg border border-gray-200 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-blue-50">
                <MousePointerClick className="w-10 h-10" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                1. Chọn Dịch Vụ
              </h3>
              <p className="text-gray-600 max-w-xs">
                Tìm kiếm vấn đề bạn đang gặp phải và đặt lịch hẹn với thời gian phù hợp.
              </p>
            </div>
            
            {/* Step 2 */}
            <div 
              className={`relative z-10 flex flex-col items-center text-center group stagger-item fade-slide-up stagger-4 ${
                howItWorksSection.isVisible ? 'visible' : ''
              }`}
            >
              <div className="mb-6 flex w-20 h-20 items-center justify-center rounded-2xl bg-white shadow-lg border border-gray-200 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-blue-50">
                <UserCog className="w-10 h-10" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                2. Thợ Đến Ngay
              </h3>
              <p className="text-gray-600 max-w-xs">
                Đối tác thợ gần nhất sẽ nhận đơn và có mặt tại nhà bạn đúng giờ để kiểm tra.
              </p>
            </div>
            
            {/* Step 3 */}
            <div 
              className={`relative z-10 flex flex-col items-center text-center group stagger-item fade-slide-up stagger-6 ${
                howItWorksSection.isVisible ? 'visible' : ''
              }`}
            >
              <div className="mb-6 flex w-20 h-20 items-center justify-center rounded-2xl bg-white shadow-lg border border-gray-200 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-blue-50">
                <CreditCard className="w-10 h-10" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                3. Nghiệm Thu & Thanh Toán
              </h3>
              <p className="text-gray-600 max-w-xs">
                Kiểm tra kết quả sửa chữa, thanh toán minh bạch qua ứng dụng và đánh giá thợ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Technicians Map Section */}
      <section 
        ref={mapSection.ref}
        className={`py-20 bg-gradient-to-b from-blue-50 via-white to-cyan-50 relative overflow-hidden section-animate fade-slide-left ${
          mapSection.isVisible ? 'visible' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              <span className="text-blue-600">Khu vực</span> thợ đang hoạt động
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hàng trăm thợ chuyên nghiệp đang sẵn sàng phục vụ bạn trong khu vực TP.HCM và các tỉnh lân cận
            </p>
          </div>

          {/* Interactive Map */}
          <TechnicianMap />

          {/* Stats Overlay - Move below map */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">50+</div>
                  <div className="text-xs text-gray-600">Thợ đang online</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{'<'} 15 phút</div>
                  <div className="text-xs text-gray-600">Thời gian phản hồi</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">24/7</div>
                  <div className="text-xs text-gray-600">Sẵn sàng phục vụ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-gray-100 hover:border-blue-200 transition-all">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Phủ sóng toàn diện</h3>
                <p className="text-gray-600 text-sm">Bao phủ tất cả 24 quận huyện tại TP.HCM</p>
              </div>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-blue-200 transition-all">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Kết nối nhanh chóng</h3>
                <p className="text-gray-600 text-sm">Tìm thợ gần nhất trong vòng 5km từ vị trí của bạn</p>
              </div>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-blue-200 transition-all">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Thợ được xác minh</h3>
                <p className="text-gray-600 text-sm">100% thợ được kiểm tra hồ sơ và kỹ năng chuyên môn</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
