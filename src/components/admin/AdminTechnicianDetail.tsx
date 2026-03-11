import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  Upload,
  Trash2,
  Plus,
  Star,
  MapPin,
  Award,
  User,
  FileText,
  Shield,
  Clock,
  Building2,
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
import {
  WorkerProfile,
  Certification,
  getWorkerProfile,
  updateWorkerProfile,
  verifyWorker,
  getWorkerCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  verifyCertification,
  // ✅ Reviews API
  getWorkerReviews,
  WorkerReview,
} from "../../services/workerService";
import { uploadFile, STORAGE_BUCKETS } from "../../lib/supabase";

export function AdminTechnicianDetail() {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // ✅ Reviews state
  const [reviews, setReviews] = useState<WorkerReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Form states...
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

  // ✅ Normalize review robustly (vì backend có thể trả nhiều shape)
  function normalizeReview(raw: any): WorkerReview {
    return {
      id: raw?.id ?? raw?.reviewId ?? raw?._id,
      rating: Number(raw?.rating ?? raw?.stars ?? raw?.score ?? 0),
      comment: raw?.comment ?? raw?.content ?? raw?.message ?? "",
      createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.time,
      updatedAt: raw?.updatedAt ?? raw?.updated_at,

      customerName:
        raw?.customerName ?? raw?.customer?.name ?? raw?.buyerName ?? raw?.user?.fullName ?? raw?.user?.name,

      fullName: raw?.fullName ?? raw?.user?.fullName,
      userName: raw?.userName ?? raw?.user?.userName,
      email: raw?.email ?? raw?.user?.email,
      phone: raw?.phone ?? raw?.user?.phone,
      customerId: raw?.customerId ?? raw?.userId ?? raw?.customer?.id,
    } as WorkerReview;
  }

  function displayReviewerName(r: WorkerReview) {
    return (
      r.customerName ||
      r.fullName ||
      r.userName ||
      r.email ||
      r.phone ||
      (r.customerId != null ? `Customer #${r.customerId}` : "Ẩn danh")
    );
  }

  function renderStars(rating: number) {
    const safe = Math.max(0, Math.min(5, Math.round(rating)));
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < safe ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
        ))}
      </div>
    );
  }

  // ✅ Tính rating từ reviews => card trên cùng không còn bị 0.0 do backend không trả ratingAvg/ratingCount
  const reviewStats = useMemo(() => {
    const list = reviews || [];
    const count = list.length;
    const sum = list.reduce((acc, r) => acc + (Number((r as any)?.rating) || 0), 0);
    const avg = count > 0 ? sum / count : 0;
    return { count, avg };
  }, [reviews]);

  async function loadWorkerReviews(id: string) {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const data = await getWorkerReviews(id);
      const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
      const normalized: WorkerReview[] = (list || []).map(normalizeReview);

      setReviews(normalized);

      // ✅ Đồng bộ worker.ratingAvg/ratingCount để chỗ khác dùng vẫn đúng (optional)
      const count = normalized.length;
      const sum = normalized.reduce((acc: number, r: WorkerReview) => acc + (Number(r.rating) || 0), 0);
      const avg = count > 0 ? sum / count : 0;

      setWorker((prev) =>
        prev
          ? ({
              ...prev,
              ratingCount: count,
              ratingAvg: avg,
            } as WorkerProfile)
          : prev,
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Không thể tải danh sách đánh giá";
      setReviewsError(msg);
      setReviews([]);
      console.error(error);
    } finally {
      setReviewsLoading(false);
    }
  }

  async function loadWorkerData() {
    setLoading(true);
    try {
      const [profileData, certsData] = await Promise.all([
        getWorkerProfile(workerId!),
        getWorkerCertifications(workerId!),
      ]);

      setWorker(profileData);
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
      toast.error("Không thể tải thông tin thợ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (workerId) {
      loadWorkerData();
      loadWorkerReviews(workerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerId]);

  async function handleSaveProfile() {
    if (!workerId) return;
    setSaving(true);
    try {
      await updateWorkerProfile(workerId, formData);
      toast.success("Đã cập nhật thông tin thành công");
      loadWorkerData();
      // ✅ giữ rating không bị reset theo profile nếu backend không trả ratingAvg
      loadWorkerReviews(workerId);
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleVerifyWorker() {
    if (!workerId) return;
    try {
      await verifyWorker(workerId);
      toast.success("Đã xác minh thợ thành công");
      loadWorkerData();
    } catch (error) {
      toast.error("Lỗi khi xác minh thợ");
      console.error(error);
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
      loadWorkerData();
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
      loadWorkerData();
    } catch (error) {
      toast.error("Lỗi khi xóa chứng chỉ");
      console.error(error);
    }
  }

  async function handleVerifyCertification(certId: string) {
    try {
      await verifyCertification(certId);
      toast.success("Đã xác minh chứng chỉ");
      loadWorkerData();
    } catch (error) {
      toast.error("Lỗi khi xác minh chứng chỉ");
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
        <h2 className="text-xl font-medium text-gray-600">Không tìm thấy thông tin thợ</h2>
        <Button className="mt-4" onClick={() => navigate("/admin/technicians")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/technicians")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{worker.fullName || "Chi tiết thợ sửa chữa"}</h1>
            <p className="text-gray-500">ID: {worker.workerId}</p>
            <div className="flex gap-4 mt-2">
              <div>
                <p className="text-xs text-gray-500">Bán kính</p>
                <p className="text-sm mt-1">{worker.workingRadiusKm} km</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Giá kỳ vọng</p>
                <p className="text-sm font-medium text-blue-600 mt-1">{(worker.hourlyRate || 0).toLocaleString()}đ</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!worker.isVerified ? (
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleVerifyWorker}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Xác minh thợ
            </Button>
          ) : (
            <Badge className="bg-green-500 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Đã xác minh
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview. */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                {/* ✅ FIX: luôn lấy từ reviews để không còn 0.0 */}
                <p className="text-2xl font-bold text-yellow-700">{reviewStats.avg.toFixed(1)}</p>
                <p className="text-xs text-gray-600">{reviewStats.count} đánh giá</p>
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
                <p className="text-2xl font-bold text-blue-700">{worker.completedJobs}</p>
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
                <p className="text-2xl font-bold text-green-700">{worker.responseTimeMinutes || 0}p</p>
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
                <p className="text-2xl font-bold text-purple-700">{worker.workingRadiusKm} km</p>
                <p className="text-xs text-gray-600">bán kính làm việc</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white shadow-lg p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Thông tin
          </TabsTrigger>

          <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Star className="w-4 h-4 mr-2" />
            Đánh giá ({reviews.length})
          </TabsTrigger>

          <TabsTrigger value="kyc" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Xác thực KYC
          </TabsTrigger>

          <TabsTrigger value="bank" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Ngân hàng
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Mô tả bản thân</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Mô tả kinh nghiệm, kỹ năng..."
                      rows={4}
                    />
                  </div>

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

                <div className="space-y-4">
                  <div>
                    <Label>Trạng thái</Label>
                    <Select
                      value={formData.availabilityStatus}
                      onValueChange={(v: string) =>
                        setFormData({
                          ...formData,
                          availabilityStatus: v as "available" | "busy" | "offline",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Sẵn sàng</SelectItem>
                        <SelectItem value="busy">Đang bận</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm text-gray-600">Ngày tham gia</p>
                    <p className="font-medium">{new Date(worker.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                    <p className="font-medium">{new Date(worker.updatedAt).toLocaleDateString("vi-VN")}</p>
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

        {/* ✅ Tab: Reviews */}
        <TabsContent value="reviews">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Đánh giá</CardTitle>
              </div>
              <Button
                variant="outline"
                onClick={() => workerId && loadWorkerReviews(workerId)}
                disabled={reviewsLoading}
              >
                {reviewsLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                ) : (
                  <Clock className="w-4 h-4 mr-2" />
                )}
                Tải lại
              </Button>
            </CardHeader>
            <CardContent>
              {reviewsError && <div className="mb-4 text-sm text-red-600">Lỗi tải đánh giá: {reviewsError}</div>}

              {reviewsLoading && (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
              )}

              {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có đánh giá nào</p>
                </div>
              )}

              {!reviewsLoading && reviews.length > 0 && (
                <div className="space-y-4">
                  {reviews.map((r, idx) => (
                    <div key={String((r as any).id ?? idx)} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{displayReviewerName(r)}</p>
                            <Badge variant="outline">{(r.rating ?? 0).toFixed(0)}/5</Badge>
                          </div>
                          <div className="mt-2">{renderStars(r.rating ?? 0)}</div>
                        </div>

                        <div className="text-right text-xs text-gray-500">
                          {r.createdAt ? <div>Tạo: {new Date(r.createdAt).toLocaleString("vi-VN")}</div> : null}
                          {r.updatedAt ? <div>Cập nhật: {new Date(r.updatedAt).toLocaleString("vi-VN")}</div> : null}
                        </div>
                      </div>

                      <div className="mt-3">
                        {r.comment ? (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.comment}</p>
                        ) : (
                          <p className="text-sm text-gray-400">(Không có comment)</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: KYC */}
        <TabsContent value="kyc">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Xác thực danh tính (KYC)</CardTitle>
              <CardDescription>Thông tin CMND/CCCD để xác minh danh tính</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Số CMND/CCCD</Label>
                <Input
                  value={formData.idCardNumber}
                  onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
                  placeholder="Nhập số CMND/CCCD"
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
                              <p className="text-sm text-gray-500 mt-2">Click để tải lên</p>
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
                              <p className="text-sm text-gray-500 mt-2">Click để tải lên</p>
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
              <CardDescription>Tài khoản nhận thanh toán</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Tên chủ tài khoản</Label>
                  <Input
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                    placeholder="NGUYEN VAN A"
                  />
                </div>

                <div>
                  <Label>Tên ngân hàng</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Vietcombank"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Số tài khoản</Label>
                  <Input
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    placeholder="1234567890"
                  />
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

        {/* Tab 4: Certifications */}
        <TabsContent value="certs">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Chứng chỉ</CardTitle>
                <CardDescription>Quản lý chứng chỉ và bằng cấp</CardDescription>
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
                  <p>Chưa có chứng chỉ nào</p>
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
                              <Badge className="bg-green-500">Đã xác minh</Badge>
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
                        {!cert.isVerified && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600"
                            onClick={() => handleVerifyCertification(cert.certId)}
                          >
                            <CheckCircle className="w-4 h-4" />
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

      {/* Certificate Dialog */}
      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCert ? "Sửa chứng chỉ" : "Thêm chứng chỉ mới"}</DialogTitle>
            <DialogDescription>Nhập thông tin chứng chỉ</DialogDescription>
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
                      Xem file
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
                        <p className="text-sm text-gray-500 mt-2">Click để tải lên PDF hoặc ảnh</p>
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

      {/* Delete Confirmation Dialog */}
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
    </div>
  );
}
