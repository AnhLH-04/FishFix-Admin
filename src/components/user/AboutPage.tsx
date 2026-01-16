import { Link } from 'react-router-dom';
import { Target, Users, Award, TrendingUp, CheckCircle, Zap, Heart, Shield, Clock, Sparkles, Building2, Wrench, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import AboutUs from '../../assets/aboutus.png';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Sứ mệnh',
      description: 'Kết nối khách hàng với thợ sửa chữa chuyên nghiệp, tạo nên giải pháp sửa chữa gia đình nhanh chóng và đáng tin cậy nhất Việt Nam.',
    },
    {
      icon: Users,
      title: 'Tầm nhìn',
      description: 'Trở thành nền tảng số 1 về dịch vụ sửa chữa gia đình, mang lại trải nghiệm tiện lợi như gọi xe công nghệ cho hàng triệu gia đình.',
    },
    {
      icon: Award,
      title: 'Giá trị cốt lõi',
      description: 'Chất lượng, Nhanh chóng, Minh bạch và An toàn là những giá trị mà chúng tôi cam kết mang đến cho khách hàng.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Thợ sửa chữa', icon: Wrench, color: 'text-blue-600' },
    { number: '10,000+', label: 'Khách hàng', icon: Users, color: 'text-purple-600' },
    { number: '50,000+', label: 'Dịch vụ hoàn thành', icon: CheckCircle, color: 'text-green-600' },
    { number: '4.9/5', label: 'Đánh giá trung bình', icon: Star, color: 'text-amber-600' },
  ];

  const team = [
    {
      name: 'Lưu Hoàn Anh',
      role: 'Co-Founder & CTO',
      image: 'https://res.cloudinary.com/dgds0gqq1/image/upload/v1768466735/Screenshot_2026-01-15_154333_cyd2le.png',
    },
    {
      name: 'Võ Thị Như Hoài',
      role: 'Co-Founder & CMO',
      image: 'https://res.cloudinary.com/dgds0gqq1/image/upload/v1768466755/Screenshot_2026-01-15_154401_ysfz5b.png',
    },
    {
      name: 'Ngô Phan Gia Bảo',
      role: 'Founder & CEO',
      image: 'https://res.cloudinary.com/dgds0gqq1/image/upload/v1768466686/Screenshot_2026-01-15_154315_famvb3.png',
    },
    {
      name: 'Lê Trà Thanh Thuyền',
      role: 'Co-Founder & CFO',
      image: 'https://res.cloudinary.com/dgds0gqq1/image/upload/v1768466763/Screenshot_2026-01-15_154417_qhvjzp.png',
    },
    {
      name: 'Võ Huỳnh Tuần Đan',
      role: 'Co-Founder & CDO',
      image: 'https://res.cloudinary.com/dgds0gqq1/image/upload/v1768466748/Screenshot_2026-01-15_154347_ewhqwr.png',
    },
  ];

  const milestones = [
    { year: '2025', event: 'FishFix ra mắt lần đầu tiên tại TP.HCM', icon: Building2 },
    { year: '2025', event: 'Đạt 1,000 khách hàng đầu tiên', icon: Users },
    { year: '2025', event: 'Ra mắt tính năng AI Tư vấn miễn phí', icon: Sparkles },
    { year: '2026', event: 'Mở rộng ra 10 tỉnh thành trên cả nước', icon: TrendingUp },
    { year: '2026', event: 'Đạt 10,000+ khách hàng và 500+ thợ', icon: Award },
    
  ];

  const benefits = [
    { text: 'Thợ được xác minh danh tính và đào tạo chuyên nghiệp', icon: Shield },
    { text: 'Giá cả minh bạch, không phát sinh chi phí ẩn', icon: CheckCircle },
    { text: 'Bảo hành sau dịch vụ, hoàn tiền nếu không hài lòng', icon: Heart },
    { text: 'Hỗ trợ khách hàng 24/7 qua app và hotline', icon: Clock },
    { text: 'Thanh toán linh hoạt: tiền mặt, chuyển khoản, ví điện tử', icon: Zap },
    { text: 'Tích điểm thưởng cho khách hàng thân thiết', icon: Star },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 text-xs font-bold tracking-widest text-blue-100 uppercase bg-white/10 rounded-full border border-white/20">
              Về chúng tôi
            </span>
          </motion.div>
          
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          >
            Chúng tôi kết nối
            <br />
            <span className="text-white">
              Công nghệ với Niềm tin
            </span>
          </motion.h1>
          
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed"
          >
            FishFix là nền tảng kết nối khách hàng với thợ sửa chữa chuyên nghiệp,
            mang đến giải pháp sửa chữa gia đình nhanh chóng và đáng tin cậy.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white -mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={scaleIn}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white rounded-3xl shadow-2xl border-0 p-8">
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index} 
                    variants={fadeInUp}
                    transition={{ duration: 0.5 }}
                    className="text-center group"
                  >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Sứ mệnh & Giá trị
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những giá trị cốt lõi định hướng mọi hoạt động của FishFix
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInRight}
              transition={{ duration: 0.7 }}
              className="relative lg:order-2"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src={AboutUs}
                  alt="FishFix Story"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInLeft}
              transition={{ duration: 0.7 }}
              className="lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  FishFix ra đời từ một vấn đề đơn giản: Tìm một thợ sửa chữa uy tín và nhanh chóng 
                  luôn là một thách thức lớn với nhiều gia đình Việt Nam.
                </p>
                <p>
                  Chúng tôi nhận ra rằng công nghệ đã thay đổi cách chúng ta gọi xe, đặt đồ ăn, 
                  nhưng lại chưa có một giải pháp tương tự cho dịch vụ sửa chữa gia đình.
                </p>
                <p>
                  Với sứ mệnh mang đến trải nghiệm đặt thợ dễ dàng như gọi xe công nghệ, FishFix 
                  đã kết nối hàng nghìn thợ sửa chữa chuyên nghiệp với khách hàng, tạo nên một 
                  cộng đồng tin cậy và hiệu quả.
                </p>
                <p>
                  Hôm nay, chúng tôi tự hào là đối tác đáng tin cậy của hàng chục nghìn gia đình, 
                  mang đến sự an tâm và tiện lợi cho cuộc sống hàng ngày.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-lg text-gray-600">
              Những cột mốc quan trọng trong lộ trình của FishFix
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {milestone.year} {milestone.icon && <milestone.icon className="inline w-6 h-6 ml-2" />}
                        </div>
                        <p className="text-gray-700">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block z-10">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Cam kết của chúng tôi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những điều FishFix đảm bảo mang đến cho khách hàng
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                variants={fadeInLeft}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <benefit.icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Đội ngũ lãnh đạo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những người đứng sau sự thành công của FishFix
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardContent className="p-6 text-center bg-white">
                  <h3 className="font-black text-lg mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-gray-600 text-sm font-medium">{member.role}</p>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={scaleIn}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Gia nhập cộng đồng FishFix ngay hôm nay
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Trải nghiệm dịch vụ sửa chữa hiện đại, nhanh chóng và đáng tin cậy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-lg">
                Đặt dịch vụ ngay
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
