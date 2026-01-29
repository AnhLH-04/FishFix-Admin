import { useState } from "react";
import { PhoneCall, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";

export default function TechSupportPage() {
  const [msg, setMsg] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Trung tâm Hỗ trợ Kỹ thuật</h1>
          <p className="text-sm text-gray-600 mt-1">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>

        <div className="rounded-2xl bg-orange-50 border border-orange-100 px-4 py-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-orange-600">HOTLINE KHẨN CẤP</div>
            <div className="font-extrabold text-gray-900">1900 888 999</div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        {/* FAQ */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-extrabold">Câu hỏi thường gặp (FAQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              <div className="text-xs font-bold text-gray-400 mt-1 mb-2">TÀI KHOẢN</div>
              <AccordionItem value="a1" className="border rounded-2xl px-3">
                <AccordionTrigger> Làm sao để đổi mật khẩu?</AccordionTrigger>
                <AccordionContent>Vào Cài đặt hệ thống → Bảo mật → Đổi mật khẩu.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="a2" className="border rounded-2xl px-3">
                <AccordionTrigger> Tôi bị khóa tài khoản phải làm sao?</AccordionTrigger>
                <AccordionContent>Liên hệ hotline hoặc chat trực tuyến để xác minh và mở khóa.</AccordionContent>
              </AccordionItem>

              <div className="text-xs font-bold text-gray-400 mt-4 mb-2">THANH TOÁN & THU NHẬP</div>
              <AccordionItem value="b1" className="border rounded-2xl px-3">
                <AccordionTrigger> Bao lâu thì nhận được tiền từ ví?</AccordionTrigger>
                <AccordionContent>Thông thường sau 24h kể từ khi đơn hoàn thành.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="b2" className="border rounded-2xl px-3">
                <AccordionTrigger> Tỉ lệ chiết khấu của ứng dụng là bao nhiêu?</AccordionTrigger>
                <AccordionContent>Hiện tại là 15%/đơn (có thể thay đổi theo chính sách).</AccordionContent>
              </AccordionItem>

              <div className="text-xs font-bold text-gray-400 mt-4 mb-2">HỖ TRỢ KỸ THUẬT</div>
              <AccordionItem value="c1" className="border rounded-2xl px-3">
                <AccordionTrigger> Ứng dụng không cập nhật vị trí?</AccordionTrigger>
                <AccordionContent>Kiểm tra quyền Location, bật GPS và thử đăng nhập lại.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="c2" className="border rounded-2xl px-3">
                <AccordionTrigger> Không nhận được thông báo đơn mới?</AccordionTrigger>
                <AccordionContent>Kiểm tra trạng thái Online và quyền Notification của trình duyệt.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-extrabold">Hỗ trợ</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="chat">Chat trực tuyến</TabsTrigger>
                <TabsTrigger value="ticket">Gửi yêu cầu hỗ trợ</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="mt-4">
                <div className="border rounded-2xl h-[360px] flex flex-col overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Online</Badge>
                  </div>

                  <div className="flex-1 p-3 space-y-3 overflow-auto bg-white">
                    <div className="max-w-[80%] bg-gray-100 rounded-2xl p-3 text-sm">
                      Chào bạn, mình là Minh - nhân viên hỗ trợ kỹ thuật. Bạn cần giúp đỡ về vấn đề gì ạ?
                      <div className="text-xs text-gray-500 mt-1">10:45 AM</div>
                    </div>

                    <div className="max-w-[80%] ml-auto bg-[#007BFF] text-white rounded-2xl p-3 text-sm">
                      Chào Minh, ứng dụng của mình đang gặp lỗi không hiển thị hình ảnh đơn hàng.
                      <div className="text-xs text-white/80 mt-1">10:46 AM</div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Bạn có thể đính kèm ảnh hoặc bảng biểu bằng biểu tượng kẹp giấy bên dưới
                    </div>
                  </div>

                  <div className="p-3 border-t bg-white">
                    <div className="flex items-center gap-2">
                      <Input
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="rounded-xl"
                      />
                      <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]" onClick={() => setMsg("")}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ticket" className="mt-4">
                <div className="border rounded-2xl p-4 bg-white">
                  <div className="text-sm text-gray-600">Tạo ticket hỗ trợ (demo UI).</div>
                  <div className="mt-3 grid gap-2">
                    <Input placeholder="Tiêu đề" className="rounded-xl" />
                    <Input placeholder="Mô tả ngắn" className="rounded-xl" />
                    <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">Gửi</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
