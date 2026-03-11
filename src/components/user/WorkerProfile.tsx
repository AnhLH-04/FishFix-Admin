import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  CheckCircle,
  XCircle,
  Upload,
  Trash2,
  Plus,
  Star,
  Award,
  User,
  FileText,
  Shield,
  Clock,
  Building2,
  Briefcase,
  MapPin,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import {
  WorkerProfile as WorkerProfileType,
  Certification,
  WorkerSkill,
  getWorkerProfileByUserId,
  updateWorkerProfile,
  getWorkerCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  addWorkerSkill,
  deleteWorkerSkill,
} from "../../services/workerService";
import { uploadFile, STORAGE_BUCKETS } from "../../lib/supabase";

export function WorkerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [worker, setWorker] = useState<WorkerProfileType | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [workerId, setWorkerId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    bio: "",
    hourlyRate: 0,
    workingRadiusKm: 10,
    availabilityStatus: "available" as "available" | "busy" | "offline",
    idCardNumber: "",
    idCardFrontUrl: "",
    idCardBackUrl: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",
  });

  // Skills dialog
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [skillForm, setSkillForm] = useState({
    categoryId: 0,
    yearsOfExperience: 0,
    isPrimarySkill: false,
  });
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [skillDeleteOpen, setSkillDeleteOpen] = useState(false);

  // Certificate dialog
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState({
    certName: "",
    certNumber: "",
    issuedBy: "",
    issuedDate: "",
    expiryDate: "",
    documentUrl: "",
  });

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<string | null>(null);

  // Upload states
  const [uploadingIdFront, setUploadingIdFront] = useState(false);
  const [uploadingIdBack, setUploadingIdBack] = useState(false);
  const [uploadingCertDoc, setUploadingCertDoc] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      // For worker, workerId = userId (they're the same in most cases)
      // Or we need to fetch worker profile by userId first
      loadWorkerByUserId(user.userId);
    }
  }, [user]);

  async function loadWorkerByUserId(userId: string) {
    setLoading(true);
    try {
      // Use the new API endpoint to get worker profile by userId
      const profileData = await getWorkerProfileByUserId(userId);
      setWorkerId(profileData.workerId);
      setWorker(profileData);

      const certsData = await getWorkerCertifications(profileData.workerId);
      setCertifications(certsData);

      setFormData({
        bio: profileData.bio || "",
        hourlyRate: profileData.hourlyRate || 0,
        workingRadiusKm: profileData.workingRadiusKm || 10,
        availabilityStatus: profileData.availabilityStatus || "available",
        idCardNumber: profileData.idCardNumber || "",
        idCardFrontUrl: profileData.idCardFrontUrl || "",
        idCardBackUrl: profileData.idCardBackUrl || "",
        bankAccountName: profileData.bankAccountName || "",
        bankAccountNumber: profileData.bankAccountNumber || "",
        bankName: profileData.bankName || "",
      });
    } catch (error) {
      console.error("Failed to load worker profile:", error);
      toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!workerId) return;
    setSaving(true);
    try {
      console.log("Saving profile with data:", formData);
      await updateWorkerProfile(workerId, formData);
      toast.success("Đã cập nhật thông tin thành công!");
      loadWorkerByUserId(user!.userId);
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadIdCard(type: "front" | "back", file: File) {
    const setUploading = type === "front" ? setUploadingIdFront : setUploadingIdBack;
    setUploading(true);

    try {
      const path = `${workerId}/id-card-${type}-${Date.now()}.${file.name.split(".").pop()}`;
      const { url, error } = await uploadFile(STORAGE_BUCKETS.ID_CARDS, path, file);

      if (error) throw error;

      setFormData((prev) => ({
        ...prev,
        [type === "front" ? "idCardFrontUrl" : "idCardBackUrl"]: url,
      }));
      toast.success(`Đã tải lên ${type === "front" ? "mặt trước" : "mặt sau"} CMND/CCCD`);
    } catch (error) {
      toast.error("Lỗi khi tải lên hình ảnh");
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  async function handleUploadCertDoc(file: File) {
    setUploadingCertDoc(true);
    try {
      const path = `${workerId}/cert-${Date.now()}.${file.name.split(".").pop()}`;
      const { url, error } = await uploadFile(STORAGE_BUCKETS.CERTIFICATES, path, file);

      if (error) throw error;

      setCertForm((prev) => ({ ...prev, documentUrl: url || "" }));
      toast.success("Đã tải lên chứng chỉ");
    } catch (error) {
      toast.error("Lỗi khi tải lên chứng chỉ");
      console.error(error);
    } finally {
      setUploadingCertDoc(false);
    }
  }

  function openNewCertDialog() {
    setEditingCert(null);
    setCertForm({
      certName: "",
      certNumber: "",
      issuedBy: "",
      issuedDate: "",
      expiryDate: "",
      documentUrl: "",
    });
    setCertDialogOpen(true);
  }

  function openEditCertDialog(cert: Certification) {
    setEditingCert(cert);
    setCertForm({
      certName: cert.certName,
      certNumber: cert.certNumber || "",
      issuedBy: cert.issuedBy || "",
      issuedDate: cert.issuedDate || "",
      expiryDate: cert.expiryDate || "",
      documentUrl: cert.documentUrl || "",
    });
    setCertDialogOpen(true);
  }

  async function handleSaveCertification() {
    if (!workerId || !certForm.certName) return;

    try {
      if (editingCert) {
        await updateCertification(editingCert.certId, certForm);
        toast.success("Đã cập nhật chứng chỉ");
      } else {
        await addCertification(workerId, certForm);
        toast.success("Đã thêm chứng chỉ mới");
      }
      setCertDialogOpen(false);
      loadWorkerByUserId(user!.userId);
    } catch (error) {
      toast.error("Lỗi khi lưu chứng chỉ");
      console.error(error);
    }
  }

  async function handleDeleteCertification() {
    if (!certToDelete) return;

    try {
      await deleteCertification(certToDelete);
      toast.success("Đã xóa chứng chỉ");
      setDeleteDialogOpen(false);
      setCertToDelete(null);
      loadWorkerByUserId(user!.userId);
    } catch (error) {
      toast.error("Lỗi khi xóa chứng chỉ");
      console.error(error);
    }
  }

  async function handleSaveSkill() {
    if (!workerId || skillForm.categoryId === 0) return;

    try {
      await addWorkerSkill(workerId, skillForm);
      toast.success("Đã thêm kỹ năng mới");
      setSkillDialogOpen(false);
      loadWorkerByUserId(user!.userId);
    } catch (error) {
      toast.error("Lỗi khi lưu kỹ năng");
      console.error(error);
    }
  }

  async function handleDeleteSkill() {
    if (!skillToDelete) return;

    try {
      await deleteWorkerSkill(skillToDelete);
      toast.success("Đã xóa kỹ năng");
      setSkillDeleteOpen(false);
      setSkillToDelete(null);
      loadWorkerByUserId(user!.userId);
    } catch (error) {
      toast.error("Lỗi khi xóa kỹ năng");
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-600 mb-2">Chưa có hồ sơ thợ</h2>
        <p className="text-gray-500 mb-4">Bạn cần tạo hồ sơ thợ để bắt đầu nhận việc</p>
        <Button onClick={() => navigate("/worker/register")}>Tạo hồ sơ thợ</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ thợ</h1>
          <p className="text-gray-500">Cập nhật thông tin cá nhân và chứng chỉ của bạn</p>
        </div>
        <div className="flex gap-2">
          {worker.isVerified ? (
            <Badge className="bg-green-500 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Đã xác minh
            </Badge>
          ) : (
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Chờ xác minh
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-yellow-700">{worker.ratingAvg?.toFixed(1) || "0.0"}</p>
                <p className="text-xs text-gray-600">{worker.ratingCount || 0} đánh giá</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-blue-700">{worker.completedJobs || 0}</p>
                <p className="text-xs text-gray-600">việc hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-700">{worker.responseTimeMinutes || 0}p</p>
                <p className="text-xs text-gray-600">phản hồi TB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-purple-700">{worker.workingRadiusKm} km</p>
                <p className="text-xs text-gray-600">bán kính</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white shadow-lg p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="kyc" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            CMND/CCCD
          </TabsTrigger>
          <TabsTrigger value="bank" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Ngân hàng
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Wrench className="w-4 h-4 mr-2" />
            Kỹ năng
          </TabsTrigger>
          <TabsTrigger value="certs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Award className="w-4 h-4 mr-2" />
            Chứng chỉ ({certifications.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Thông tin hồ sơ và cài đặt hoạt động</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Mô tả bản thân</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Mô tả kinh nghiệm, kỹ năng chuyên môn của bạn..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Giá theo giờ (VNĐ)</Label>
                    <Input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label>Bán kính làm việc (km)</Label>
                    <Input
                      type="number"
                      value={formData.workingRadiusKm}
                      onChange={(e) => setFormData({ ...formData, workingRadiusKm: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Trạng thái hoạt động</Label>
                  <Select
                    value={formData.availabilityStatus}
                    onValueChange={(v: string) =>
                      setFormData({ ...formData, availabilityStatus: v as "available" | "busy" | "offline" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">🟢 Sẵn sàng nhận việc</SelectItem>
                      <SelectItem value="busy">🟠 Đang bận</SelectItem>
                      <SelectItem value="offline">⚫ Tạm nghỉ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: KYC */}
        <TabsContent value="kyc">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Xác thực danh tính</CardTitle>
              <CardDescription>Cập nhật CMND/CCCD để được xác minh tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Số CMND/CCCD</Label>
                <Input
                  value={formData.idCardNumber}
                  onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
                  placeholder="Nhập số CMND/CCCD 12 số"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Mặt trước CMND/CCCD</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                    {formData.idCardFrontUrl ? (
                      <div className="relative">
                        <img src={formData.idCardFrontUrl} alt="ID Front" className="max-h-48 mx-auto rounded" />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, idCardFrontUrl: "" })}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadIdCard("front", file);
                          }}
                        />
                        <div className="py-8">
                          {uploadingIdFront ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-500 mt-2">Bấm để tải lên</p>
                            </>
                          )}
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Mặt sau CMND/CCCD</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                    {formData.idCardBackUrl ? (
                      <div className="relative">
                        <img src={formData.idCardBackUrl} alt="ID Back" className="max-h-48 mx-auto rounded" />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, idCardBackUrl: "" })}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadIdCard("back", file);
                          }}
                        />
                        <div className="py-8">
                          {uploadingIdBack ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-500 mt-2">Bấm để tải lên</p>
                            </>
                          )}
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Bank */}
        <TabsContent value="bank">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Thông tin ngân hàng</CardTitle>
              <CardDescription>Tài khoản nhận thanh toán từ các công việc</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tên chủ tài khoản</Label>
                  <Input
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value.toUpperCase() })}
                    placeholder="NGUYEN VAN A"
                  />
                  <p className="text-xs text-gray-500 mt-1">Viết IN HOA, không dấu</p>
                </div>

                <div>
                  <Label>Tên ngân hàng</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Vietcombank, BIDV, Techcombank..."
                  />
                </div>
              </div>

              <div>
                <Label>Số tài khoản</Label>
                <Input
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  placeholder="1234567890"
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Skills */}
        <TabsContent value="skills">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Kỹ năng chuyên môn</CardTitle>
                <CardDescription>Quản lý các lĩnh vực sửa chữa chuyên môn của bạn</CardDescription>
              </div>
              <Button onClick={() => setSkillDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm kỹ năng
              </Button>
            </CardHeader>
            <CardContent>
              {!worker.skills || worker.skills.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Bạn chưa thêm kỹ năng nào</p>
                  <p className="text-sm">Hãy thêm kỹ năng để khách hàng tìm thấy bạn</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {worker.skills.map((skill) => (
                    <div
                      key={skill.skillId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Wrench className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Danh mục #{skill.categoryId}</p>
                            {skill.isPrimarySkill && <Badge className="bg-blue-600">Chính</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">{skill.yearsOfExperience} năm kinh nghiệm</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => {
                          setSkillToDelete(skill.skillId);
                          setSkillDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Certifications */}
        <TabsContent value="certs">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Chứng chỉ & Bằng cấp</CardTitle>
                <CardDescription>Thêm chứng chỉ để tăng độ tin cậy</CardDescription>
              </div>
              <Button onClick={openNewCertDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm chứng chỉ
              </Button>
            </CardHeader>
            <CardContent>
              {certifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Bạn chưa có chứng chỉ nào</p>
                  <p className="text-sm">Thêm chứng chỉ để khách hàng tin tưởng hơn</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div
                      key={cert.certId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{cert.certName}</p>
                            {cert.isVerified ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Đã xác minh
                              </Badge>
                            ) : (
                              <Badge variant="outline">Chờ xác minh</Badge>
                            )}
                            {cert.isExpired && <Badge className="bg-red-500">Hết hạn</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">
                            {cert.issuedBy} • {cert.certNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            {cert.issuedDate} - {cert.expiryDate || "Không thời hạn"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {cert.documentUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={cert.documentUrl} target="_blank" rel="noreferrer">
                              <FileText className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => openEditCertDialog(cert)}>
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() => {
                            setCertToDelete(cert.certId);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cert Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chứng chỉ này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCertification} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Certificate Dialog */}
      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCert ? "Sửa chứng chỉ" : "Thêm chứng chỉ mới"}</DialogTitle>
            <DialogDescription>Nhập thông tin chứng chỉ của bạn</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Tên chứng chỉ *</Label>
              <Input
                value={certForm.certName}
                onChange={(e) => setCertForm({ ...certForm, certName: e.target.value })}
                placeholder="Chứng chỉ điện lạnh cấp 3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Số chứng chỉ</Label>
                <Input
                  value={certForm.certNumber}
                  onChange={(e) => setCertForm({ ...certForm, certNumber: e.target.value })}
                  placeholder="DL-2024-12345"
                />
              </div>
              <div>
                <Label>Đơn vị cấp</Label>
                <Input
                  value={certForm.issuedBy}
                  onChange={(e) => setCertForm({ ...certForm, issuedBy: e.target.value })}
                  placeholder="Sở Công Thương"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày cấp</Label>
                <Input
                  type="date"
                  value={certForm.issuedDate}
                  onChange={(e) => setCertForm({ ...certForm, issuedDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Ngày hết hạn</Label>
                <Input
                  type="date"
                  value={certForm.expiryDate}
                  onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>File chứng chỉ</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-4">
                {certForm.documentUrl ? (
                  <div className="flex items-center justify-between">
                    <a
                      href={certForm.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      Xem file đã tải
                    </a>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setCertForm({ ...certForm, documentUrl: "" })}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block text-center">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadCertDoc(file);
                      }}
                    />
                    {uploadingCertDoc ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">Bấm để tải lên PDF hoặc ảnh</p>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCertDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveCertification} disabled={!certForm.certName}>
              {editingCert ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skill Add Dialog */}
      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm kỹ năng mới</DialogTitle>
            <DialogDescription>Chọn danh mục và số năm kinh nghiệm</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Danh mục kỹ năng *</Label>
              <Select
                value={skillForm.categoryId.toString()}
                onValueChange={(v: string) => setSkillForm({ ...skillForm, categoryId: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sửa Điện</SelectItem>
                  <SelectItem value="2">Sửa Nước</SelectItem>
                  <SelectItem value="3">Điều Hòa</SelectItem>
                  <SelectItem value="4">Thiết Bị Gia Dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Số năm kinh nghiệm *</Label>
              <Input
                type="number"
                value={skillForm.yearsOfExperience}
                onChange={(e) => setSkillForm({ ...skillForm, yearsOfExperience: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={skillForm.isPrimarySkill}
                onChange={(e) => setSkillForm({ ...skillForm, isPrimarySkill: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isPrimary">Là kỹ năng chính của tôi</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveSkill} disabled={skillForm.categoryId === 0}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skill Delete Dialog */}
      <AlertDialog open={skillDeleteOpen} onOpenChange={setSkillDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa kỹ năng này?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSkill} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
