import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Trash2, Shield, User2, FileCheck2, AlertTriangle, Upload } from "lucide-react";

import {
  addCertification,
  createWorkerProfile,
  deleteCertification,
  getMe,
  getWorkerProfile,
  listCertifications,
  updateWorkerProfile,
  type CertificationDto,
  type WorkerProfileDto,
} from "../../api/technician";

// Map status badge cho certifications (nếu backend có status)
type ReviewStatus = "draft" | "pending" | "approved" | "rejected";
function statusBadge(s?: string) {
  const v = ((s || "draft") as ReviewStatus) ?? "draft";
  const map: Record<ReviewStatus, { text: string; cls: string }> = {
    draft: { text: "Chưa gửi duyệt", cls: "bg-gray-100 text-gray-700" },
    pending: { text: "Chờ duyệt", cls: "bg-amber-100 text-amber-800" },
    approved: { text: "Đã duyệt", cls: "bg-green-100 text-green-800" },
    rejected: { text: "Từ chối", cls: "bg-red-100 text-red-800" },
  };
  return map[v] ?? map.draft;
}

export default function TechProfilePage() {
  const [loading, setLoading] = useState(false);

  // IDs
  const [meId, setMeId] = useState<string | null>(null);
  const [workerId, setWorkerId] = useState<string | null>(() => localStorage.getItem("workerId"));

  // Data
  const [profile, setProfile] = useState<WorkerProfileDto | null>(null);
  const [certs, setCerts] = useState<CertificationDto[]>([]);

  // personal form (theo swagger worker profile fields)
  const [bio, setBio] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("Online");
  const [workingRadiusKm, setWorkingRadiusKm] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(150000);

  // cert form (theo swagger AddCertificationRequest)
  const [certName, setCertName] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [issuedDate, setIssuedDate] = useState(""); // YYYY-MM-DD
  const [expiryDate, setExpiryDate] = useState(""); // YYYY-MM-DD
  const [documentUrl, setDocumentUrl] = useState("");

  // “reviewStatus/rejectReason” trong UI cũ của bạn không có trong swagger worker profile.
  // Ta suy ra trạng thái từ certifications (nếu backend có status) hoặc chỉ check có cert hay chưa.
  const review = useMemo(() => {
    if (!certs.length) return statusBadge("draft");
    const hasRejected = certs.some((c) => (c.status ?? "").toLowerCase() === "rejected");
    const hasPending = certs.some((c) => (c.status ?? "").toLowerCase() === "pending");
    const hasApproved = certs.some((c) => (c.status ?? "").toLowerCase() === "approved");

    if (hasRejected) return statusBadge("rejected");
    if (hasPending) return statusBadge("pending");
    if (hasApproved) return statusBadge("approved");
    return statusBadge("draft");
  }, [certs]);

  const needsCert = useMemo(() => certs.length === 0, [certs]);

  async function ensureWorker(): Promise<{ userId: string; workerId: string }> {
    const me = await getMe(); // GET /api/identity/me
    const userId = me.id;
    setMeId(userId);

    const cached = workerId || localStorage.getItem("workerId");
    if (cached) return { userId, workerId: cached };

    // POST /api/dispatch/workers
    const created = await createWorkerProfile({ userId });
    const wid = created.workerId;

    setWorkerId(wid);
    localStorage.setItem("workerId", wid);

    return { userId, workerId: wid };
  }

  const refresh = async () => {
    setLoading(true);
    try {
      const ensured = await ensureWorker();
      const [p, c] = await Promise.all([
        getWorkerProfile(ensured.workerId), // GET /api/dispatch/workers/{workerId}
        listCertifications(ensured.workerId), // GET /api/dispatch/workers/{workerId}/certifications
      ]);

      setProfile(p);
      setCerts(c);

      // hydrate form
      setBio(p.bio ?? "");
      setAvailabilityStatus(p.availabilityStatus ?? "Online");
      setWorkingRadiusKm(p.workingRadiusKm ?? 10);
      setHourlyRate(p.hourlyRate ?? 150000);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e?.message ?? "Không tải được hồ sơ thợ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSaveProfile = async () => {
    if (!workerId) return;

    setLoading(true);
    try {
      // PUT /api/dispatch/workers/{workerId}
      const updated = await updateWorkerProfile(workerId, {
        bio,
        availabilityStatus,
        workingRadiusKm,
        hourlyRate,
      });
      setProfile(updated);
      toast.success("Đã cập nhật thông tin");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e?.message ?? "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Swagger không thấy upload multipart => dùng documentUrl
  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Giữ UX: chọn file để “nhắc người dùng”
  };

  const onAddCert = async () => {
    if (!workerId) return;

    if (!certName.trim()) {
      toast.error("Vui lòng nhập tên chứng chỉ");
      return;
    }
    if (!documentUrl.trim()) {
      toast.error("Vui lòng nhập Document URL (link file chứng chỉ đã upload)");
      return;
    }

    setLoading(true);
    try {
      // POST /api/dispatch/workers/{workerId}/certifications
      await addCertification(workerId, {
        certName: certName.trim(),
        certNumber: certNumber.trim() || undefined,
        issuedBy: issuedBy.trim() || undefined,
        issuedDate: issuedDate || undefined,
        expiryDate: expiryDate || undefined,
        documentUrl: documentUrl.trim(),
      });

      // reload
      const next = await listCertifications(workerId);
      setCerts(next);

      // reset
      setCertName("");
      setCertNumber("");
      setIssuedBy("");
      setIssuedDate("");
      setExpiryDate("");
      setDocumentUrl("");

      toast.success("Đã thêm chứng chỉ");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e?.message ?? "Thêm chứng chỉ thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteDoc = async (id: string) => {
    setLoading(true);
    try {
      // DELETE /api/dispatch/certifications/{certId}
      await deleteCertification(id);
      if (workerId) {
        const next = await listCertifications(workerId);
        setCerts(next);
      }
      toast.success("Đã xóa chứng chỉ");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e?.message ?? "Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Swagger không thấy “submit for review” cho thợ.
  // Duyệt thường nằm phía Admin: POST /api/dispatch/certifications/{certId}/verify
  const onSubmit = async () => {
    if (certs.length === 0) {
      toast.error("Bạn cần thêm ít nhất 1 chứng chỉ/bằng cấp trước.");
      return;
    }
    toast.info("Backend hiện duyệt chứng chỉ từ phía Admin. Bạn chỉ cần thêm chứng chỉ và chờ duyệt.");
  };

  // Swagger không thấy change password rõ ràng => giữ UI nhưng báo chưa hỗ trợ
  const onChangePassword = async () => {
    toast.info("Backend swagger hiện chưa public endpoint đổi mật khẩu (hoặc bạn chưa bật trong swagger).");
  };

  return (
    <div className="space-y-6">
      {/* banner warning giống ảnh */}
      {needsCert && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Tài khoản chưa thể nhận việc nếu chưa có chứng chỉ</div>
            <div className="text-sm text-gray-700 mt-1">
              Vui lòng tải lên bằng/chứng chỉ (bằng cách nhập Document URL) để tăng độ tin cậy.
            </div>
          </div>
          <Button className="rounded-xl" onClick={() => document.getElementById("tab-cert")?.click()}>
            Hoàn thiện ngay
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Hồ sơ thợ</h1>
          <p className="text-gray-600">Xem và cập nhật thông tin, chứng chỉ.</p>
        </div>

        <Badge className={`rounded-full px-3 py-1 ${review.cls}`}>Trạng thái: {review.text}</Badge>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="rounded-2xl p-1 bg-gray-100">
          <TabsTrigger value="profile" className="rounded-xl" id="tab-profile">
            <User2 className="h-4 w-4 mr-2" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="cert" className="rounded-xl" id="tab-cert">
            <FileCheck2 className="h-4 w-4 mr-2" />
            Bằng cấp & Chứng chỉ
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl" id="tab-security">
            <Shield className="h-4 w-4 mr-2" />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        {/* Personal */}
        <TabsContent value="profile" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-extrabold">Cập nhật thông tin (Worker Profile)</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái sẵn sàng</Label>
                <Input
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  className="rounded-xl"
                  placeholder="Online / Offline / Busy"
                />
              </div>

              <div className="space-y-2">
                <Label>Bán kính làm việc (km)</Label>
                <Input
                  type="number"
                  value={workingRadiusKm}
                  onChange={(e) => setWorkingRadiusKm(Number(e.target.value || 0))}
                  className="rounded-xl"
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label>Giá theo giờ (VNĐ)</Label>
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value || 0))}
                  className="rounded-xl"
                  min={0}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Giới thiệu</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-xl min-h-[110px]" />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" className="rounded-xl" disabled={loading} onClick={refresh}>
                  Tải lại
                </Button>
                <Button
                  disabled={loading}
                  onClick={onSaveProfile}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Lưu thay đổi
                </Button>
              </div>

              {/* Debug small */}
              <div className="md:col-span-2 text-xs text-gray-500">
                Backend: {profile ? "Đã tải profile" : "Chưa có"} • Certifications: {certs.length}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications */}
        <TabsContent value="cert" className="mt-4">
          <div className="grid xl:grid-cols-[360px_1fr] gap-4">
            {/* left profile card */}
            {/* <Card className="rounded-2xl h-fit">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 font-extrabold">
                    {(meId || "T").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900">Technician</div>
                    <div className="text-xs text-blue-700 font-semibold">Worker profile</div>
                  </div>
                </div>

                <div className="mt-5">
                  <Badge className={`rounded-full ${review.cls}`}>{review.text}</Badge>
                </div>
              </CardContent>
            </Card> */}

            {/* right cert manager */}
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-extrabold">Thêm chứng chỉ </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* giữ UX “upload” nhưng chỉ để chọn file nhắc user */}
                <label className="block">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files)}
                  />

                  <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 transition">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="mt-2 font-semibold text-gray-900">Chọn file (không upload trực tiếp)</div>
                  </div>
                </label>

                {/* form add certification */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Tên chứng chỉ *</Label>
                    <Input value={certName} onChange={(e) => setCertName(e.target.value)} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label>Số chứng chỉ</Label>
                    <Input value={certNumber} onChange={(e) => setCertNumber(e.target.value)} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label>Nơi cấp</Label>
                    <Input value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label>Ngày cấp</Label>
                    <Input
                      type="date"
                      value={issuedDate}
                      onChange={(e) => setIssuedDate(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Ngày hết hạn</Label>
                    <Input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Document URL *</Label>
                    <Input
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      className="rounded-xl"
                      placeholder="https://.../certificate.pdf"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <Button variant="outline" className="rounded-xl" disabled={loading} onClick={refresh}>
                    Làm mới
                  </Button>

                  <Button
                    onClick={onAddCert}
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Thêm chứng chỉ
                  </Button>

                  <Button
                    onClick={onSubmit}
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black"
                  >
                    Gửi yêu cầu xét duyệt →
                  </Button>
                </div>

                <div className="text-sm font-semibold text-gray-900">Danh sách chứng chỉ ({certs.length})</div>

                <div className="grid md:grid-cols-2 gap-3">
                  {certs.map((d) => (
                    <div key={d.id} className="border rounded-2xl p-3 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                        {(d.documentUrl ?? "").toLowerCase().endsWith(".pdf") ? "PDF" : "URL"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate">{d.certName ?? "Chứng chỉ"}</div>
                        <div className="text-xs text-gray-600 truncate">
                          {d.status ? `Trạng thái: ${d.status}` : "Đã lưu"}
                        </div>
                        {d.documentUrl && (
                          <a
                            className="text-xs text-blue-700 hover:underline"
                            href={d.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Xem file
                          </a>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        disabled={loading}
                        onClick={() => onDeleteDoc(d.id)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-extrabold">Bảo mật tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Swagger hiện chưa public endpoint đổi mật khẩu trong tài liệu. Tab này giữ UI, nhưng tạm thời chỉ hiển
                thị thông báo.
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={loading}
                  onClick={onChangePassword}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Kiểm tra đổi mật khẩu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
