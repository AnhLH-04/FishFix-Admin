import { useState, useRef } from 'react';
import { Upload, Sparkles, CheckCircle, Loader2, Wrench, Users, CreditCard, Star, AlertTriangle, ClipboardList } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TechnicianMap } from './TechnicianMap';

interface AnalysisResult {
  problem: string;
  solution: string;
  estimatedCost: string;
  urgency: string;
  recommendations: string[];
}

export function UserAI() {
  const [step, setStep] = useState(1); // 1: Input, 2: Analyzing, 3: Results
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Upload-EVPlatform');
        formData.append('cloud_name', 'dgds0gqq1');

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dgds0gqq1/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          setUploadedImageUrl(data.secure_url);
          console.log('Uploaded to Cloudinary:', data.secure_url);
        }
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!description.trim() && !selectedImage) return;
    
    setStep(2);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate AI analysis with mock data
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        problem: "Máy lạnh bị rò rĩ nước do tắc nghẽn đường thoát nước hoặc khay chứa nước đầy. Nước có thể chảy ra sàn nhà gây ẩm ướt và hư hại nội thất.",
        solution: "Cần vệ sinh và thông tắc đường thoát nước của máy lạnh. Kiểm tra và làm sạch khay chứa nước ngưng. Đồng thời kiểm tra độ nghiêng của ống thoát nước để đảm bảo nước thoát ra ngoài tự nhiên. Có thể cần thay mới ống thoát nước nếu bị gãy hoặc nghẹt.",
        estimatedCost: "200k - 500k VNĐ",
        urgency: "Trung bình",
        recommendations: [
          "Tắt máy lạnh tạm thời để tránh rò rĩ nước tiếp tục",
          "Lau khô sàn nhà để tránh trơn trượt và hư hại sàn",
          "Kiểm tra định kỳ 3-6 tháng/lần để tránh tái diễn"
        ]
      };
      
      setAnalysis(mockAnalysis);
      setAnalysisProgress(100);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      
      setTimeout(() => {
        setStep(3);
      }, 500);
    }, 3000); // Giả lập 3 giây phân tích
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {step === 1 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mô tả sự cố & Phân tích AI</h1>
            <p className="text-gray-600">Chia sẻ hình ảnh và mô tả ngắn, AI sẽ giúp bạn tìm thợ ngay lập tức.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    Chi tiết sự cố
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    AI hoạt động tốt nhất khi có hình ảnh rõ ràng
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Hình ảnh/Video hiện trường <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      {selectedImage ? (
                        <div className="space-y-3">
                          <div className="relative">
                            <img 
                              src={selectedImage} 
                              alt="Preview" 
                              className="mx-auto max-h-48 rounded-lg"
                            />
                            {isUploading && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              {isUploading ? 'Đang tải lên...' : uploadedImageUrl ? '✓ Đã tải lên - Nhấn để thay đổi' : 'Nhấn để thay đổi ảnh'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Tải ảnh lên hoặc Chụp ngay</p>
                            <p className="text-sm text-gray-500 mt-1">Kéo thả hình vào đây, AI sẽ quét hình và tìm vấn đề cho bạn luôn. Hỗ trợ định dạng ảnh: JPG • PNG • GIF • MP4 (tối đa 10MB)</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mô tả sự cố (Tùy chọn)
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Vd: Máy lạnh tôi không quay, nước chảy ra, phát ra tiếng kêu lạ..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">AI Phân Tích</div>
                        <div className="text-xs text-green-600 font-normal">● online</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Kết quả của hình ảnh và thông tin đã gửi sẽ giúp chúng tôi xác định vấn đề và chi phí ước tính chính xác.
                    </p>
                    <div className="bg-white rounded-lg p-3 text-xs space-y-2">
                      <p className="font-semibold text-gray-700">Hiệu quả của Fixit AI:</p>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>Trợ lý thông minh đánh giá nhanh mức độ sự cố</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>Không giới hạn ngôn ngữ, hỗ trợ 20+ ngôn ngữ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>Có mắt trong 30 phút</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Lưu ý:</strong> Chỉ cần thêm hình ảnh/video, chất lượng thợ sẽ chất lượng hơn cá giúp bạn được ưu tiên phản hồi nhanh hơn từ thợ. Lời khuyên: chụp hình sau khi vấn đề xảy ra 24-48h.
                      </p>
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!description.trim() && !selectedImage}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      size="lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Phân tích bởi AI & Tìm thợ ngay
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      Miễn phí 100% • Có kết quả trong 30 phút
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI đang phân tích sự cố...</h1>
            <p className="text-gray-600">Chúng tôi đang quét hình 5km để tìm những thợ sửa chữa uy tín nhất cho bạn.</p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-600">ĐANG XỬ LÝ</span>
                    <span className="text-2xl font-bold text-blue-600">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-3" />
                </div>

                {/* Status Steps */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className={analysisProgress >= 30 ? 'opacity-100' : 'opacity-50'}>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">TIẾP NHẬN</p>
                  </div>
                  <div className={analysisProgress >= 60 ? 'opacity-100' : 'opacity-50'}>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">AI PHÂN TÍCH</p>
                  </div>
                  <div className={analysisProgress >= 90 ? 'opacity-100' : 'opacity-50'}>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">TÌM THỢ</p>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <TechnicianMap />
                </div>

                <p className="text-sm text-center text-gray-600">
                  Hủy yêu cầu
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 3 && analysis && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Kết quả chẩn đoán</h1>
            <p className="text-gray-600">Hệ thống đã xác định vấn đề và sẽ tự động lọc danh sách thợ phù hợp nhất.</p>
          </div>

          {/* Top Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Category */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Hạng mục</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Máy Lạnh</h3>
                <p className="text-xs text-gray-500 mt-1">Đã tạm cây: 95%</p>
              </CardContent>
            </Card>

            {/* Urgency */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Mức độ</span>
                </div>
                <h3 className="text-xl font-bold text-orange-600">Trung bình</h3>
                <p className="text-xs text-gray-500 mt-1">Cần vệ sinh trong 24-48h</p>
              </CardContent>
            </Card>

            {/* Cost */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-semibold">Chi phí dự kiến</span>
                </div>
                <h3 className="text-xl font-bold text-blue-600">{analysis.estimatedCost}</h3>
                <p className="text-xs text-blue-600 mt-1">● Gói tham khảo thị trường</p>
              </CardContent>
            </Card>
          </div>

          {/* Warning Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800">
              <strong>Lưu ý:</strong> Đây chỉ là ước lượng chi phí trên phần tích hình ảnh AI. Chi phí thực tế có thể thay đổi sau khi kiểm tra trực tiếp nơi Thợ trước khi làm việc sẽ báo chi phí chính xác, bạn sẽ được lựa chọn có nên tiếp tục hay không.
            </p>
          </div>

          {/* Technicians Section */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Đề xuất thợ tốt nhất</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Được lọc theo chuyên môn đánh giá cao, vị trí gần & điểm khớp phù hợp
                  </p>
                </div>
                <Button variant="link" className="text-blue-600">
                  Xem tất cả →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Match Badges */}
              <div className="flex gap-2 flex-wrap mb-6">
                <Badge className="bg-green-100 text-green-700 border border-green-300">
                  ✓ Auto-Matched
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">🔵 Chuyên gia</Badge>
                <Badge className="bg-blue-100 text-blue-700">MATCHED 98%</Badge>
                <Badge className="bg-purple-100 text-purple-700">MATCHED 92%</Badge>
                <Badge className="bg-orange-100 text-orange-700">MATCHED 88%</Badge>
              </div>

              {/* Technicians List */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Top Technician */}
                <Card 
                  className={`border-2 cursor-pointer transition-all ${
                    selectedTechnician === 'tech1' 
                      ? 'border-blue-600 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedTechnician('tech1')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-blue-600 text-white">MATCHED 98%</Badge>
                      {selectedTechnician === 'tech1' && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div>
                        <h4 className="font-bold">Nguyễn Văn An</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.9</span>
                          <span className="text-xs text-gray-600">(38 đánh giá)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <p className="text-gray-600">Khoảng cách</p>
                        <p className="font-semibold">1.2 km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Đến nơi</p>
                        <p className="font-semibold">~15 phút</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3 text-xs">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">ĐIỆN LẠNH</Badge>
                      <Badge variant="outline" className="text-[10px] px-1 py-0">SỬA NHANH</Badge>
                    </div>
                    <Button 
                      variant={selectedTechnician === 'tech1' ? 'default' : 'outline'}
                      className={`w-full ${selectedTechnician === 'tech1' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTechnician('tech1');
                      }}
                    >
                      {selectedTechnician === 'tech1' 
                        ? '✓ Đã chọn' 
                          : 'Chọn thợ này'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Second Technician */}
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedTechnician === 'tech2' 
                      ? 'border-2 border-purple-600 bg-purple-50 shadow-lg' 
                      : 'border hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedTechnician('tech2')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-purple-100 text-purple-700">MATCHED 92%</Badge>
                      {selectedTechnician === 'tech2' && (
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div>
                        <h4 className="font-bold">Trần Thị Bích</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.8</span>
                          <span className="text-xs text-gray-600">(50 đánh giá)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <p className="text-gray-600">Khoảng cách</p>
                        <p className="font-semibold">3.5 km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Đến nơi</p>
                        <p className="font-semibold">~30 phút</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3 text-xs">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">ĐIỆN LẠNH</Badge>
                      <Badge variant="outline" className="text-[10px] px-1 py-0">THIẾT BỊ</Badge>
                    </div>
                    <Button 
                      variant={selectedTechnician === 'tech2' ? 'default' : 'outline'} 
                      className={`w-full ${selectedTechnician === 'tech2' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTechnician('tech2');
                      }}
                    >
                      {selectedTechnician === 'tech2' ? '✓ Đã chọn' : 'Chọn thợ này'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Third Technician */}
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedTechnician === 'tech3' 
                      ? 'border-2 border-orange-600 bg-orange-50 shadow-lg' 
                      : 'border hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedTechnician('tech3')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-orange-100 text-orange-700">MATCHED 88%</Badge>
                      {selectedTechnician === 'tech3' && (
                        <CheckCircle className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div>
                        <h4 className="font-bold">Lê Hoàng Nam</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.7</span>
                          <span className="text-xs text-gray-600">(40 đánh giá)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <p className="text-gray-600">Khoảng cách</p>
                        <p className="font-semibold">4.1 km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Đến nơi</p>
                        <p className="font-semibold">~45 phút</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3 text-xs">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">ĐƯỜNG DÂY</Badge>
                    </div>
                    <Button 
                      variant={selectedTechnician === 'tech3' ? 'default' : 'outline'} 
                      className={`w-full ${selectedTechnician === 'tech3' ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTechnician('tech3');
                      }}
                    >
                      {selectedTechnician === 'tech3' ? '✓ Đã chọn' : 'Chọn thợ này'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Continue Button */}
              {selectedTechnician && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-900">Đã chọn thợ</p>
                      <p className="text-sm text-green-700">
                        {selectedTechnician === 'tech1' && 'Nguyễn Văn An - 1.2 km'}
                        {selectedTechnician === 'tech2' && 'Trần Thị Bích - 3.5 km'}
                        {selectedTechnician === 'tech3' && 'Lê Hoàng Nam - 4.1 km'}
                      </p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Tiếp tục đặt lịch →
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                </div>
                <CardTitle>Chi tiết phân tích kỹ thuật</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* Image - Left Side */}
                <div className="flex-shrink-0">
                  <div className="bg-gray-900 rounded-lg overflow-hidden relative w-[240px]" style={{ aspectRatio: '3/4' }}>
                    {uploadedImageUrl || selectedImage ? (
                      <img 
                        src={uploadedImageUrl || selectedImage || ''} 
                        alt="Ảnh sự cố đã upload" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Upload className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Không có ảnh</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Ảnh phân tích
                    </div>
                  </div>
                </div>

                {/* Details - Right Side */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">MÃ CHẨN ĐOÁN</h4>
                      <p className="text-2xl font-mono font-bold text-gray-900">#AC-FIX-2145</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                      ! Cần khắc phục sớm
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Phát hiện của AI:</h4>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">Phát hiện đường thoát nước bị tắc nghẽn, nước không thoát được ra ngoài.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">Khay chứa nước ngưng có thể đầy hoặc bị nghiêng không đúng cách.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">Đề xuất vệ sinh ống thoát nước và kiểm tra độ nghiêng của ống.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
