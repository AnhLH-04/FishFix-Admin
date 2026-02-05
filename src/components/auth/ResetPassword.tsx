import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import Logo from '../../assets/logowhite.png';
import { authApi } from '../../services/api';
import { toast } from 'sonner';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Get email and token from URL parameters
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    if (!emailParam || !tokenParam) {
      toast.error('Liên kết không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.');
    }
  }, [searchParams]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Mật khẩu phải có ít nhất 1 chữ hoa');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error('Mật khẩu phải có ít nhất 1 chữ thường');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error('Mật khẩu phải có ít nhất 1 số');
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      toast.error('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !token) {
      toast.error('Thông tin không hợp lệ. Vui lòng sử dụng liên kết từ email.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email,
        token,
        newPassword
      });
      setIsSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
      toast.error(errorMessage);
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

      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10 animate-slide-up">
        <CardHeader className="text-center pb-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="FishFix Logo" className="w-10 h-10" />
          </div>

          <CardTitle className="text-3xl mb-2">
            <span className="bg-gradient-to-r from-[#007BFF] to-purple-600 bg-clip-text text-transparent">
              {isSuccess ? 'Thành Công!' : 'Đặt Lại Mật Khẩu'}
            </span>
          </CardTitle>
          <CardDescription className="text-base">
            {isSuccess 
              ? 'Mật khẩu của bạn đã được cập nhật'
              : 'Tạo mật khẩu mới cho tài khoản của bạn'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-green-800 mb-2 text-lg">
                  Mật khẩu đã được đặt lại!
                </h3>
                <p className="text-sm text-green-700">
                  Bạn có thể đăng nhập với mật khẩu mới của mình.
                </p>
                <p className="text-xs text-green-600 mt-3">
                  Đang chuyển hướng đến trang đăng nhập...
                </p>
              </div>

              {/* Login Button */}
              <Button
                onClick={() => navigate('/admin/login')}
                className="w-full h-11 bg-gradient-to-r from-[#007BFF] to-blue-600"
              >
                Đăng nhập ngay
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  Mật khẩu mới *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2 text-blue-800">Yêu cầu mật khẩu:</p>
                <ul className="text-blue-700 space-y-1 list-disc list-inside">
                  <li>Ít nhất 8 ký tự</li>
                  <li>Bao gồm chữ hoa và chữ thường</li>
                  <li>Có ít nhất một số</li>
                  <li>Có ít nhất một ký tự đặc biệt (!@#$%^&*)</li>
                </ul>
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
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Đặt lại mật khẩu</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Link to="/admin/login" className="text-sm text-gray-600 hover:text-[#007BFF]">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}

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
