import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center animate-slide-up">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[200px] leading-none font-bold text-transparent bg-gradient-to-r from-[#007BFF] to-purple-600 bg-clip-text select-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AlertTriangle className="w-24 h-24 text-orange-500 animate-float" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl mb-3">Không tìm thấy trang</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <Button
            onClick={() => navigate('/admin')}
            className="bg-gradient-to-r from-[#007BFF] to-blue-600 gap-2"
          >
            <Home className="w-4 h-4" />
            Về Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
