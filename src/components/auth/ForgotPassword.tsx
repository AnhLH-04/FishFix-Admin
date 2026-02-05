import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import Logo from '../../assets/logowhite.png';
import { authApi } from '../../services/api';
import { toast } from 'sonner';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Vui lòng nhập email!');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setIsSuccess(true);
      toast.success('Email khôi phục mật khẩu đã được gửi!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại.';
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
              Quên Mật Khẩu
            </span>
          </CardTitle>
          <CardDescription className="text-base">
            {isSuccess 
              ? 'Kiểm tra email của bạn để đặt lại mật khẩu'
              : 'Nhập email để nhận liên kết đặt lại mật khẩu'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-800">Email đã được gửi!</h3>
                </div>
                <p className="text-sm text-green-700 ml-13">
                  Chúng tôi đã gửi email chứa liên kết đặt lại mật khẩu đến <strong>{email}</strong>
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Các bước tiếp theo:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Kiểm tra hộp thư đến của bạn</li>
                  <li>Mở email từ FishFix</li>
                  <li>Click vào liên kết trong email</li>
                  <li>Tạo mật khẩu mới</li>
                </ol>
                <p className="text-xs text-blue-600 mt-3">
                  Không nhận được email? Kiểm tra thư mục spam hoặc gửi lại sau 5 phút.
                </p>
              </div>

              {/* Resend Button */}
              <Button
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Gửi lại email
              </Button>

              {/* Back to Login */}
              <Button
                onClick={() => navigate('/admin/login')}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                <p>
                  Nhập địa chỉ email bạn đã sử dụng để đăng ký. Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
                </p>
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
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Gửi email</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Link to="/admin/login" className="text-sm text-gray-600 hover:text-[#007BFF] flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" />
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
