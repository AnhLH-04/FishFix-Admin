import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Wrench,
    Shield,
    ArrowRight,
    Upload,
    Save,
    MapPin,
    DollarSign,
    Plus,
    Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { createWorkerProfile, addWorkerSkill } from '../../services/workerService';
import { uploadFile, STORAGE_BUCKETS } from '../../lib/supabase';

export function WorkerRegistration() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        bio: '',
        hourlyRate: 150000,
        workingRadiusKm: 10,
        availabilityStatus: 'available' as const,
        idCardNumber: '',
        idCardFrontUrl: '',
        idCardBackUrl: '',
        bankAccountName: '',
        bankAccountNumber: '',
        bankName: '',
    });

    // Skills Step State
    const [skillsList, setSkillsList] = useState<any[]>([]);
    const [currentSkill, setCurrentSkill] = useState({
        categoryId: 1,
        yearsOfExperience: 1,
        isPrimarySkill: true,
    });

    const categories = [
        { id: 1, name: 'Sửa Điện' },
        { id: 2, name: 'Sửa Nước' },
        { id: 3, name: 'Điều Hòa' },
        { id: 4, name: 'Thiết Bị Gia Dụng' },
    ];

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleAddSkill = () => {
        if (skillsList.some(s => s.categoryId === currentSkill.categoryId)) {
            toast.error('Kỹ năng này đã được thêm!');
            return;
        }
        setSkillsList([...skillsList, currentSkill]);
        setCurrentSkill({
            categoryId: 1,
            yearsOfExperience: 1,
            isPrimarySkill: skillsList.length === 0,
        });
    };

    const handleRemoveSkill = (categoryId: number) => {
        setSkillsList(skillsList.filter(s => s.categoryId !== categoryId));
    };

    const handleUpload = async (type: 'front' | 'back', file: File) => {
        setLoading(true);
        try {
            const path = `onboarding/${user?.userId}/${type}-${Date.now()}.${file.name.split('.').pop()}`;
            const { url, error } = await uploadFile(STORAGE_BUCKETS.ID_CARDS, path, file);
            if (error) throw error;

            setFormData(prev => ({
                ...prev,
                [type === 'front' ? 'idCardFrontUrl' : 'idCardBackUrl']: url
            }));
            toast.success('Đã tải ảnh lên!');
        } catch (error) {
            toast.error('Lỗi khi tải ảnh');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (skillsList.length === 0) {
            toast.error('Vui lòng thêm ít nhất một kỹ năng!');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Profile
            const profile = await createWorkerProfile({
                ...formData,
                userId: user?.userId
            });

            // 2. Add Skills
            for (const skill of skillsList) {
                await addWorkerSkill(profile.workerId, skill);
            }

            toast.success('Hồ sơ đã được tạo thành công!');
            await refreshUser();
            navigate('/worker/profile');
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi khi lưu hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold mb-2">Trở Thành Đối Tác Thợ</h1>
                <p className="text-gray-500">Hoàn thiện 3 bước để bắt đầu nhận việc ngay</p>

                {/* Stepper */}
                <div className="flex justify-center items-center mt-8 gap-4 px-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= i ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {i}
                            </div>
                            {i < 3 && <div className={`h-1 w-12 transition-all ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <Card className="border-0 shadow-2xl animate-slide-right">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Thông tin cá nhân & Hoạt động
                        </CardTitle>
                        <CardDescription>Giới thiệu về bạn và thiết lập phí dịch vụ</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Giới thiệu bản thân *</Label>
                            <Textarea
                                placeholder="Hãy viết vài dòng về kinh nghiệm của bạn (VD: 5 năm trong nghề điện lạnh...)"
                                rows={4}
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Giá theo giờ (VNĐ) *</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="number"
                                        className="pl-9"
                                        value={formData.hourlyRate}
                                        onChange={e => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Bán kính phục vụ (km) *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="number"
                                        className="pl-9"
                                        value={formData.workingRadiusKm}
                                        onChange={e => setFormData({ ...formData, workingRadiusKm: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t pt-6 bg-gray-50/50">
                        <Button variant="ghost" disabled>Quay lại</Button>
                        <Button onClick={nextStep} disabled={!formData.bio || !formData.hourlyRate}>
                            Tiếp tục
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
                <Card className="border-0 shadow-2xl animate-slide-right">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-blue-600" />
                            Kỹ năng chuyên môn
                        </CardTitle>
                        <CardDescription>Chọn những lĩnh vực bạn có thể sửa chữa</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-xl space-y-4 border border-blue-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Danh mục</Label>
                                    <Select
                                        value={currentSkill.categoryId.toString()}
                                        onValueChange={(v: string) => setCurrentSkill({ ...currentSkill, categoryId: Number(v) })}
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Số năm kinh nghiệm</Label>
                                    <Input
                                        type="number"
                                        className="bg-white"
                                        value={currentSkill.yearsOfExperience}
                                        onChange={e => setCurrentSkill({ ...currentSkill, yearsOfExperience: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <Button variant="secondary" className="w-full bg-white border" onClick={handleAddSkill}>
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm kỹ năng
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {skillsList.map(s => (
                                <div key={s.categoryId} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Wrench className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{categories.find(c => c.id === s.categoryId)?.name}</p>
                                            <p className="text-xs text-gray-500">{s.yearsOfExperience} năm kinh nghiệm</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleRemoveSkill(s.categoryId)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t pt-6 bg-gray-50/50">
                        <Button variant="outline" onClick={prevStep}>Quay lại</Button>
                        <Button onClick={nextStep} disabled={skillsList.length === 0}>
                            Tiếp tục
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
                <Card className="border-0 shadow-2xl animate-fade-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Xác thực thông tin
                        </CardTitle>
                        <CardDescription>Cung cấp CCCD và Ngân hàng để rút tiền</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* ID Card */}
                        <div className="space-y-4">
                            <Label className="text-lg font-bold">CMND/CCCD</Label>
                            <Input
                                placeholder="Nhập số CCCD (12 số)"
                                value={formData.idCardNumber}
                                onChange={e => setFormData({ ...formData, idCardNumber: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-dashed rounded-xl p-4 text-center space-y-3 bg-gray-50 h-[180px] flex flex-col justify-center">
                                    {formData.idCardFrontUrl ? (
                                        <img src={formData.idCardFrontUrl} alt="Front" className="h-full w-full object-cover rounded-lg" />
                                    ) : (
                                        <label className="cursor-pointer">
                                            <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload('front', e.target.files[0])} />
                                            <Upload className="mx-auto w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500">Mặt trước CCCD</p>
                                        </label>
                                    )}
                                </div>
                                <div className="border-2 border-dashed rounded-xl p-4 text-center space-y-3 bg-gray-50 h-[180px] flex flex-col justify-center">
                                    {formData.idCardBackUrl ? (
                                        <img src={formData.idCardBackUrl} alt="Back" className="h-full w-full object-cover rounded-lg" />
                                    ) : (
                                        <label className="cursor-pointer">
                                            <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload('back', e.target.files[0])} />
                                            <Upload className="mx-auto w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500">Mặt sau CCCD</p>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bank Info */}
                        <div className="space-y-4 pt-4 border-t">
                            <Label className="text-lg font-bold">Thông tin Ngân hàng</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ngân hàng</Label>
                                    <Input
                                        placeholder="VD: Vietcombank"
                                        value={formData.bankName}
                                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Chủ tài khoản (KO DẤU)</Label>
                                    <Input
                                        placeholder="VD: NGUYEN VAN A"
                                        value={formData.bankAccountName}
                                        onChange={e => setFormData({ ...formData, bankAccountName: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Số tài khoản</Label>
                                <Input
                                    placeholder="1234567890"
                                    value={formData.bankAccountNumber}
                                    onChange={e => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t pt-6 bg-gray-50/50">
                        <Button variant="outline" onClick={prevStep}>Quay lại</Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 font-bold px-8 shadow-blue-200 shadow-xl"
                            onClick={handleSubmit}
                            disabled={loading || !formData.idCardNumber || !formData.bankAccountNumber}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang tạo...
                                </div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Hoàn tất & Bắt đầu
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
