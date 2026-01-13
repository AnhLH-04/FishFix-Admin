import { useState } from 'react';
import { MessageCircle, Send, Bot, User as UserIcon, Lightbulb, Wrench, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickQuestions = [
  { icon: Wrench, text: 'Máy giặt không quay', category: 'Máy giặt' },
  { icon: AlertCircle, text: 'Tủ lạnh kêu to', category: 'Tủ lạnh' },
  { icon: Lightbulb, text: 'Bóng đèn hay hỏng', category: 'Điện' },
  { icon: Wrench, text: 'Máy lạnh không lạnh', category: 'Điều hòa' },
];

const exampleIssues = [
  {
    title: 'Vấn đề về điện',
    items: ['Mất điện toàn bộ nhà', 'Cầu dao tự động nhảy', 'Ổ cắm bị nóng', 'Đèn nhấp nháy']
  },
  {
    title: 'Vấn đề về nước',
    items: ['Nước chảy yếu', 'Đường ống bị tắc', 'Rò rỉ nước', 'Bồn cầu không xả']
  },
  {
    title: 'Vấn đề điều hòa',
    items: ['Không lạnh', 'Kêu to bất thường', 'Chảy nước', 'Mùi hôi']
  },
  {
    title: 'Vấn đề máy giặt',
    items: ['Không vắt khô', 'Rò nước', 'Kêu to', 'Không xả nước']
  },
];

export function UserAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của FishFix. Tôi có thể giúp bạn:\n\n✅ Chẩn đoán sự cố kỹ thuật\n✅ Tư vấn giải pháp sửa chữa\n✅ Ước tính chi phí sơ bộ\n✅ Gợi ý thợ phù hợp\n\nHãy mô tả vấn đề bạn đang gặp phải!',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
        suggestions: generateSuggestions(input),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('máy giặt') && lowerQuestion.includes('không quay')) {
      return `🔍 **Phân tích sự cố:**

Máy giặt không quay có thể do các nguyên nhân sau:

**1. Dây curoa bị tuột/đứt (60% khả năng)**
   • Kiểm tra: Mở nắp sau, xem dây curoa
   • Chi phí: 150.000 - 300.000 VNĐ
   • Thời gian: 30-45 phút

**2. Motor bị hỏng (25% khả năng)**
   • Kiểm tra: Nghe tiếng động cơ
   • Chi phí: 800.000 - 1.500.000 VNĐ
   • Thời gian: 1-2 giờ

**3. Tụ điện hỏng (15% khả năng)**
   • Kiểm tra: Đo điện áp tụ
   • Chi phí: 100.000 - 200.000 VNĐ
   • Thời gian: 20-30 phút

💡 **Khuyến nghị:** Nên gọi thợ chuyên nghiệp để kiểm tra chính xác.`;
    }

    if (lowerQuestion.includes('tủ lạnh') || lowerQuestion.includes('kêu')) {
      return `🔍 **Phân tích sự cố:**

Tủ lạnh kêu to có thể do:

**1. Quạt tản nhiệt bị bẩn (50% khả năng)**
   • Giải pháp: Vệ sinh quạt và lưới tản nhiệt
   • Chi phí: 100.000 - 200.000 VNĐ
   • Có thể tự làm được

**2. Máy nén cũ/hỏng (30% khả năng)**
   • Giải pháp: Thay máy nén mới
   • Chi phí: 1.500.000 - 3.000.000 VNĐ
   • Cần thợ chuyên nghiệp

**3. Gas thiếu hoặc thừa (20% khả năng)**
   • Giải pháp: Kiểm tra và điều chỉnh gas
   • Chi phí: 300.000 - 500.000 VNĐ
   • Cần thợ có thiết bị đo

💡 **Lưu ý:** Nếu tiếng kêu vừa xuất hiện, hãy kiểm tra ngay để tránh hỏng nặng.`;
    }

    if (lowerQuestion.includes('máy lạnh') || lowerQuestion.includes('điều hòa')) {
      return `🔍 **Phân tích sự cố:**

Máy lạnh không lạnh thường do:

**1. Thiếu gas (70% khả năng)**
   • Dấu hiệu: Cục nóng không nóng, dàn lạnh có đá
   • Chi phí: 300.000 - 600.000 VNĐ (bao gồm gas)
   • Thời gian: 30-45 phút

**2. Lọc gió bẩn (20% khả năng)**
   • Giải pháp: Vệ sinh/thay lọc gió
   • Chi phí: 100.000 - 200.000 VNĐ
   • Có thể tự vệ sinh

**3. Cảm biến nhiệt độ hỏng (10% khả năng)**
   • Giải pháp: Thay cảm biến
   • Chi phí: 200.000 - 400.000 VNĐ
   • Thời gian: 30 phút

🌡️ **Kiểm tra nhanh:** Chạm vào cục nóng bên ngoài, nếu không nóng thì chắc chắn thiếu gas.`;
    }

    if (lowerQuestion.includes('bóng đèn') || lowerQuestion.includes('điện')) {
      return `🔍 **Phân tích sự cố:**

Bóng đèn hay hỏng có thể do:

**1. Điện áp không ổn định (60% khả năng)**
   • Giải pháp: Lắp ổn áp
   • Chi phí: 500.000 - 1.500.000 VNĐ
   • Hiệu quả lâu dài

**2. Chất lượng bóng kém (30% khả năng)**
   • Giải pháp: Dùng bóng LED chính hãng
   • Chi phí: 50.000 - 200.000/bóng
   • Tuổi thọ cao hơn

**3. Đui đèn bị lỏng/oxy hóa (10% khả năng)**
   • Giải pháp: Vệ sinh/thay đui đèn
   • Chi phí: 20.000 - 50.000 VNĐ
   • Dễ tự sửa

💡 **Mẹo:** Chuyển sang bóng LED tiết kiệm điện và bền hơn gấp 10 lần.`;
    }

    return `🤖 Tôi đã hiểu câu hỏi của bạn về "${question}".

Để tôi có thể tư vấn chính xác hơn, bạn có thể cung cấp thêm thông tin:

📋 **Chi tiết cần thiết:**
• Vấn đề xảy ra khi nào? (bao lâu rồi?)
• Có hiện tượng gì đi kèm? (tiếng kêu, mùi, rò rỉ...)
• Thiết bị sử dụng bao lâu rồi?
• Đã thử sửa gì chưa?

Hoặc bạn có thể chọn một trong các câu hỏi mẫu bên dưới để được tư vấn nhanh! 👇`;
  };

  const generateSuggestions = (question: string): string[] => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('máy giặt')) {
      return [
        'Tìm thợ sửa máy giặt gần tôi',
        'Báo giá thay dây curoa máy giặt',
        'Hướng dẫn kiểm tra motor máy giặt'
      ];
    }
    
    if (lowerQuestion.includes('tủ lạnh') || lowerQuestion.includes('kêu')) {
      return [
        'Tìm thợ sửa tủ lạnh uy tín',
        'Vệ sinh tủ lạnh tại nhà',
        'Báo giá thay máy nén tủ lạnh'
      ];
    }

    if (lowerQuestion.includes('máy lạnh') || lowerQuestion.includes('điều hòa')) {
      return [
        'Đặt lịch nạp gas máy lạnh',
        'Vệ sinh máy lạnh giá bao nhiêu',
        'Tìm thợ điều hòa chuyên nghiệp'
      ];
    }

    return [
      'Xem danh sách thợ sửa chữa',
      'Đặt lịch hẹn ngay',
      'Tìm hiểu thêm về dịch vụ'
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl shadow-xl mb-4">
            <Bot className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Trợ Lý AI FishFix</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Chẩn đoán sự cố nhanh chóng và nhận tư vấn miễn phí từ AI
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Trò Chuyện Với AI
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Mô tả sự cố của bạn để được tư vấn miễn phí
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-[500px] p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`}>
                          {message.role === 'user' ? (
                            <UserIcon className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div
                            className={`inline-block max-w-[85%] p-4 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                          {message.suggestions && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs text-gray-500 font-medium">Gợi ý hành động:</p>
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="mr-2 text-xs rounded-full"
                                  onClick={() => handleQuickQuestion(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600">AI đang phân tích...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex gap-3">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Mô tả vấn đề bạn đang gặp phải... (Ví dụ: Máy giặt không quay, kêu to)"
                      className="resize-none rounded-2xl border-2 focus:border-blue-500"
                      rows={3}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl px-6"
                      size="lg"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="shadow-xl rounded-3xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Câu Hỏi Nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickQuestions.map((q, index) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(q.text)}
                        className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 border-2 border-transparent hover:border-blue-200 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">{q.text}</p>
                            <Badge variant="secondary" className="text-xs">
                              {q.category}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Common Issues */}
            <Card className="shadow-xl rounded-3xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Sự Cố Thường Gặp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exampleIssues.map((category, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        {category.title}
                      </h4>
                      <div className="space-y-1">
                        {category.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickQuestion(item)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-xl rounded-3xl border-0 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl">💎 Tính Năng AI</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Chẩn đoán sự cố trong 1 phút</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Ước tính chi phí chính xác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Gợi ý thợ phù hợp nhất</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Tư vấn 24/7 miễn phí</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
