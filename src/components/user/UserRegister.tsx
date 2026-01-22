import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff, User, Phone, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import Logo from '../../assets/logowhite.png';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function UserRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'worker'
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu không khớp!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      });
      
      // Show success message with verification info
      if (response?.message) {
        setVerificationMessage(response.message);
        setRegistrationSuccess(true);
        toast.success('Đăng ký thành công!');
      } else {
        // If no message, just redirect to login
        toast.success('Đăng ký thành công!');
        setTimeout(() => navigate('/admin/login'), 2000);
      }
    } catch (error) {
      // Error is already handled in the auth context
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-0 relative z-10 animate-slide-up">
        <CardHeader className="text-center pb-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="FishFix Logo" className="w-10 h-10" />
          </div>

          <CardTitle className="text-3xl mb-2">
            <span className="bg-gradient-to-r from-[#007BFF] to-purple-600 bg-clip-text text-transparent">
              Đăng Ký Tài Khoản
            </span>
          </CardTitle>
          <CardDescription className="text-base">
            Tạo tài khoản mới để sử dụng dịch vụ FishFix
          </CardDescription>
        </CardHeader>

        <CardContent>
          {registrationSuccess ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-green-800 mb-2 text-lg">
                  Đăng ký thành công!
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  {verificationMessage || 'Tài khoản của bạn đã được tạo thành công.'}
                </p>
              </div>

              {/* Email Verification Notice */}
              {verificationMessage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📧 Xác thực Email</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Chúng tôi đã gửi email xác thực đến <strong>{formData.email}</strong>
                  </p>
                  <p className="text-xs text-blue-600">
                    Vui lòng kiểm tra hộp thư và click vào liên kết xác thực để kích hoạt tài khoản.
                  </p>
                </div>
              )}

              {/* Login Button */}
              <Button
                onClick={() => navigate('/admin/login')}
                className="w-full h-11 bg-gradient-to-r from-[#007BFF] to-blue-600"
              >
                Đi đến trang đăng nhập
              </Button>
            </div>
          ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Họ và tên *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mật khẩu *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Xác nhận mật khẩu *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Đăng ký với tư cách *
              </Label>
              <RadioGroup 
                value={formData.role} 
                onValueChange={(value: string) => setFormData({ ...formData, role: value as 'customer' | 'worker' })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer" className="cursor-pointer">Khách hàng</Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="worker" id="worker" />
                  <Label htmlFor="worker" className="cursor-pointer">Thợ sửa chữa</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-[#007BFF] to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng ký...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Đăng ký</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/admin/login" className="text-[#007BFF] hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 FishFix. Bảo mật và riêng tư.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Floating Elements */}
      <div className="absolute top-10 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-float animation-delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-400 rounded-full opacity-20 animate-float animation-delay-3000"></div>
    </div>
  );
}
