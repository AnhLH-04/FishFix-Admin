import { Brain, TrendingUp, CheckCircle, AlertCircle, Zap, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const aiUsageData = [
  { date: '20/10', consultations: 45, analyses: 38, suggestions: 52 },
  { date: '21/10', consultations: 52, analyses: 44, suggestions: 58 },
  { date: '22/10', consultations: 48, analyses: 41, suggestions: 54 },
  { date: '23/10', consultations: 61, analyses: 53, suggestions: 67 },
  { date: '24/10', consultations: 57, analyses: 49, suggestions: 63 },
  { date: '25/10', consultations: 68, analyses: 59, suggestions: 74 },
  { date: '26/10', consultations: 64, analyses: 56, suggestions: 70 },
];

const issueCategories = [
  { name: 'Điện', value: 142, color: '#FCD34D', accuracy: 95 },
  { name: 'Nước', value: 98, color: '#3B82F6', accuracy: 92 },
  { name: 'Máy lạnh', value: 76, color: '#06B6D4', accuracy: 88 },
  { name: 'Máy giặt', value: 54, color: '#8B5CF6', accuracy: 90 },
  { name: 'Điện tử', value: 32, color: '#EF4444', accuracy: 85 },
  { name: 'Khác', value: 28, color: '#10B981', accuracy: 87 },
];

const aiModels = [
  {
    id: 1,
    name: 'Image Analysis Model',
    version: 'v2.1.3',
    accuracy: 94.5,
    totalPredictions: 1247,
    status: 'active',
    lastUpdate: '25/10/2025',
  },
  {
    id: 2,
    name: 'Text Classification Model',
    version: 'v1.8.2',
    accuracy: 91.2,
    totalPredictions: 2156,
    status: 'active',
    lastUpdate: '20/10/2025',
  },
  {
    id: 3,
    name: 'Technician Matching',
    version: 'v3.0.1',
    accuracy: 96.8,
    totalPredictions: 3421,
    status: 'active',
    lastUpdate: '28/10/2025',
  },
  {
    id: 4,
    name: 'Price Estimation',
    version: 'v1.5.0',
    accuracy: 89.3,
    totalPredictions: 1893,
    status: 'testing',
    lastUpdate: '26/10/2025',
  },
];

const recentPredictions = [
  {
    id: 1,
    type: 'Image Analysis',
    input: 'Hình ảnh máy giặt bị rò nước',
    prediction: 'Vòng đệm cao su bị hỏng, cần thay mới',
    confidence: 95,
    result: 'correct',
    timestamp: '29/10/2025 10:30',
  },
  {
    id: 2,
    type: 'Text Analysis',
    input: 'Máy lạnh không lạnh, quạt chạy bình thường',
    prediction: 'Thiếu gas, cần bổ sung',
    confidence: 92,
    result: 'correct',
    timestamp: '29/10/2025 09:15',
  },
  {
    id: 3,
    type: 'Matching',
    input: 'Sửa điện tại Quận 1',
    prediction: 'Nguyễn Văn A - Rating 4.9',
    confidence: 98,
    result: 'correct',
    timestamp: '29/10/2025 08:45',
  },
  {
    id: 4,
    type: 'Image Analysis',
    input: 'Hình ảnh công tắc điện bị cháy',
    prediction: 'Ngắn mạch, cần thay công tắc và kiểm tra dây',
    confidence: 88,
    result: 'incorrect',
    timestamp: '28/10/2025 16:20',
  },
];

export function AdminAI() {
  const totalPredictions = aiModels.reduce((sum, model) => sum + model.totalPredictions, 0);
  const avgAccuracy = aiModels.reduce((sum, model) => sum + model.accuracy, 0) / aiModels.length;
  const correctPredictions = recentPredictions.filter(p => p.result === 'correct').length;
  const accuracyRate = (correctPredictions / recentPredictions.length) * 100;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">AI Analytics & Monitoring</h1>
        <p className="text-gray-600">Giám sát và phân tích hoạt động AI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Tổng dự đoán</p>
            <p className="text-3xl text-purple-600">{totalPredictions.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-green-500">Tốt</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-1">Độ chính xác TB</p>
            <p className="text-3xl text-green-600">{avgAccuracy.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Yêu cầu hôm nay</p>
            <p className="text-3xl text-blue-600">234</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Mô hình hoạt động</p>
            <p className="text-3xl text-orange-600">
              {aiModels.filter(m => m.status === 'active').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Hoạt động AI 7 ngày</CardTitle>
            <CardDescription>Số lượng yêu cầu theo loại</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="consultations" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Tư vấn"
                />
                <Line 
                  type="monotone" 
                  dataKey="analyses" 
                  stroke="#007BFF" 
                  strokeWidth={2}
                  name="Phân tích"
                />
                <Line 
                  type="monotone" 
                  dataKey="suggestions" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Gợi ý"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Categories */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Phân loại sự cố</CardTitle>
            <CardDescription>Phân bố theo danh mục</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Accuracy */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Độ chính xác theo danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issueCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{category.value} phân tích</span>
                    <span className="font-medium text-green-600">{category.accuracy}%</span>
                  </div>
                </div>
                <Progress value={category.accuracy} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Models */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Mô hình AI</CardTitle>
          <CardDescription>Trạng thái và hiệu suất các mô hình</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiModels.map((model) => (
              <div 
                key={model.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{model.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {model.version}
                      </Badge>
                      {model.status === 'active' ? (
                        <Badge className="bg-green-500 text-xs">Hoạt động</Badge>
                      ) : (
                        <Badge className="bg-orange-500 text-xs">Đang test</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{model.totalPredictions.toLocaleString()} dự đoán</span>
                      <span>•</span>
                      <span>Cập nhật: {model.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-medium text-green-600">
                      {model.accuracy}%
                    </span>
                  </div>
                  <Progress value={model.accuracy} className="w-32 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Predictions */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Dự đoán gần đây</CardTitle>
          <CardDescription>Kết quả phân tích và độ tin cậy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPredictions.map((prediction) => (
              <div 
                key={prediction.id}
                className={`p-4 border-l-4 rounded-lg ${
                  prediction.result === 'correct' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500">{prediction.type}</Badge>
                    <span className="text-xs text-gray-500">{prediction.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {prediction.result === 'correct' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <Badge variant="outline">
                      {prediction.confidence}% tin cậy
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Input:</span> {prediction.input}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Dự đoán:</span> {prediction.prediction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#007BFF]" />
            Gợi ý cải thiện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium mb-1">Tăng dataset cho danh mục "Điện tử"</p>
                <p className="text-sm text-gray-600">
                  Độ chính xác hiện tại: 85%. Cần thêm 200+ mẫu để đạt 90%
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium mb-1">Cập nhật Image Analysis Model</p>
                <p className="text-sm text-gray-600">
                  Phiên bản mới v2.2.0 có độ chính xác cao hơn 3%
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium mb-1">Tối ưu hóa Matching Algorithm</p>
                <p className="text-sm text-gray-600">
                  Giảm thời gian phản hồi từ 2.5s xuống 1.5s
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
