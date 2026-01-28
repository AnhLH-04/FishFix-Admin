import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Clock, MapPin, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { bookingApi } from '../../services/api';

export function UserBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    service: '',
    timeSlot: '',
    description: ''
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const services = [
    { value: 'electric', label: 'Sửa Điện' },
    { value: 'plumbing', label: 'Sửa Nước' },
    { value: 'hvac', label: 'Điều Hòa' },
    { value: 'painting', label: 'Sơn Nhà' },
    { value: 'electronics', label: 'Sửa Điện Tử' },
    { value: 'woodwork', label: 'Mộc & Đồ Gỗ' },
    { value: 'vehicle', label: 'Sửa Xe' },
    { value: 'cleaning', label: 'Vệ Sinh' }
  ];

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error('Vui lòng chọn ngày');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.service || !formData.timeSlot) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      // Create booking description
      const bookingDescription = `${formData.description}\n\nDịch vụ: ${services.find(s => s.value === formData.service)?.label}\nNgày: ${format(date, 'PPP', { locale: vi })}\nGiờ: ${formData.timeSlot}\nĐịa chỉ: ${formData.address}`;
      
      const bookingId = await bookingApi.createBooking({
        customerName: formData.name,
        description: bookingDescription
      });

      toast.success('Đặt lịch thành công! Thợ sẽ liên hệ bạn sớm.');
      console.log('Booking ID:', bookingId);
      
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đặt lịch thất bại!';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Đặt Lịch Sửa Chữa</h1>
        <p className="text-gray-600 text-lg">Điền thông tin để đặt lịch với thợ</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Thông Tin Đặt Lịch</CardTitle>
            <CardDescription>
              Vui lòng điền đầy đủ thông tin để thợ có thể liên hệ và phục vụ bạn tốt nhất
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">
                  <User className="inline h-4 w-4 mr-2" />
                  Họ và tên *
                </Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Số điện thoại *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0912345678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Địa chỉ *
                </Label>
                <Textarea
                  id="address"
                  placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Service Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Dịch vụ cần sửa *</Label>
                <Select value={formData.service} onValueChange={(value: string) => handleInputChange('service', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ngày làm việc *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date: Date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="timeSlot">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Khung giờ *
                </Label>
                <Select value={formData.timeSlot} onValueChange={(value: string) => handleInputChange('timeSlot', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khung giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả vấn đề cần sửa chữa..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Lưu ý:</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Thợ sẽ liên hệ lại với bạn để xác nhận trong vòng 30 phút</li>
                <li>Chi phí cụ thể sẽ được báo sau khi thợ kiểm tra thực tế</li>
                <li>Bạn có thể hủy lịch miễn phí trước 2 giờ</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1" disabled={isLoading}>
              Quay Lại
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác Nhận Đặt Lịch'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
