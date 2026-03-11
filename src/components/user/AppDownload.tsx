import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Smartphone, Download, CheckCircle, Shield, Zap, Star, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export function AppDownload() {
  // Link APK của bạn (thay thế bằng link thực tế)
  const apkDownloadLink = "https://expo.dev/accounts/anhlh04/projects/fishfix/builds/f463dd50-8909-4cd1-ba73-43cfc7caeb2e"; // Thay thế link này
  const appVersion = "1.0.0";
  const appSize = "88.9 MB";
  const minAndroidVersion = "6.0";

  const handleDownload = () => {
    window.open(apkDownloadLink, '_blank');
  };

  const features = [
    {
      icon: Zap,
      title: "Nhanh chóng",
      description: "Đặt lịch thợ chỉ trong vài phút"
    },
    {
      icon: Shield,
      title: "An toàn",
      description: "Thợ được xác minh và đánh giá"
    },
    {
      icon: Star,
      title: "Chất lượng",
      description: "Dịch vụ chuyên nghiệp, giá minh bạch"
    }
  ];

  const steps = [
    "Nhấn nút Download APK bên dưới",
    "Cho phép cài đặt từ nguồn không xác định trong Settings",
    "Mở file APK đã tải và nhấn Install",
    "Mở app và bắt đầu sử dụng"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" />
              <span>Ứng dụng Mobile</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Tải ngay ứng dụng
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
                Sửa chữa nhanh chóng
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Trải nghiệm dịch vụ sửa chữa, bảo trì tại nhà với ứng dụng di động. 
              Đặt lịch dễ dàng, theo dõi thợ trực tuyến.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleDownload}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                Download APK
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-gray-100 rounded-full">v{appVersion}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">{appSize}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">Android {minAndroidVersion}+</span>
              </div>
            </div>

            {/* QR Code Section */}
            <Card className="inline-block p-6 bg-white shadow-lg">
              <div className="flex flex-col items-center gap-3">
                <QrCode className="w-12 h-12 text-blue-600" />
                <div className="w-48 h-48 flex items-center justify-center rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src="/image.png" 
                    alt="QR Code tải FishFix App" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600 font-medium">Quét mã QR để tải app trực tiếp</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Tại sao nên dùng app?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshots Section */}
      {/* <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Giao diện ứng dụng
            </h2>
            <p className="text-gray-600">
              Thiết kế hiện đại, dễ sử dụng
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
              >
                <Card className="aspect-[9/16] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  <Smartphone className="w-16 h-16 text-gray-400" />
                  {/* Thay thế bằng ảnh screenshot thực tế */}
                {/* </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Installation Guide */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Hướng dẫn cài đặt
            </h2>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng trải nghiệm?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Tải ngay ứng dụng và đặt lịch thợ chỉ trong vài phút
            </p>
            <Button 
              onClick={handleDownload}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Tải xuống ngay
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Gặp vấn đề khi cài đặt? Liên hệ với chúng tôi
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              Email: ad.fishfix@gmail.com
            </a>
            <span className="text-gray-400">|</span>
            <a href="tel:+84123456789" className="text-blue-600 hover:underline">
              Hotline: 0876767076
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
