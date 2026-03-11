import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, CheckCircle, Eye, Star, Award, Clock } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

// ✅ dùng workerService.ts của bạn
import {
  getAllWorkers,
  verifyWorker,
  getWorkerCertifications,
  getWorkerReviews, // ✅ ADD
  WorkerProfile,
  Certification,
} from "../../services/workerService";

export function AdminTechnicians() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeWorkers, setActiveWorkers] = useState<WorkerProfile[]>([]);
  const [pendingWorkers, setPendingWorkers] = useState<WorkerProfile[]>([]);

  const [selectedTech, setSelectedTech] = useState<WorkerProfile | null>(null);
  const [selectedPending, setSelectedPending] = useState<WorkerProfile | null>(null);

  const [pendingCerts, setPendingCerts] = useState<Certification[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  // ✅ Helper: tính avg/count từ API reviews (fallback mapping field)
  const computeRatingFromReviewsResponse = (data: any) => {
    const list: any[] = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
    const count = list.length;

    const sum = list.reduce((acc: number, r: any) => {
      const rating = Number(r?.rating ?? r?.stars ?? r?.score ?? 0) || 0;
      return acc + rating;
    }, 0);

    const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    return { avg, count };
  };

  // ✅ Hydrate rating cho list (ít thợ thì ok, như bạn đang có 5)
  const hydrateRatings = async (workers: WorkerProfile[]) => {
    const updated = await Promise.all(
      workers.map(async (w) => {
        try {
          const data = await getWorkerReviews(w.workerId);
          const { avg, count } = computeRatingFromReviewsResponse(data);
          return {
            ...w,
            ratingAvg: avg,
            ratingCount: count,
          } as WorkerProfile;
        } catch {
          return w;
        }
      }),
    );

    setActiveWorkers(updated);

    // Nếu dialog đang mở "Xem nhanh" thì update luôn rating trong dialog
    setSelectedTech((prev) => {
      if (!prev) return prev;
      const found = updated.find((x) => x.workerId === prev.workerId);
      return found ?? prev;
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [active, pending] = await Promise.all([getAllWorkers(true), getAllWorkers(false)]);

      const activeList = (active || []) as WorkerProfile[];
      const pendingList = (pending || []) as WorkerProfile[];

      setActiveWorkers(activeList);
      setPendingWorkers(pendingList);

      // ✅ FIX: lấy reviews để rating trên list không còn 0.0
      // (pending không cần rating, chỉ hydrate active)
      await hydrateRatings(activeList);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thợ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPendingCerts = async (workerId: string) => {
    setLoadingCerts(true);
    try {
      const certs = await getWorkerCertifications(workerId);
      setPendingCerts(certs || []);
    } catch (error) {
      console.error("Error loading certifications:", error);
      setPendingCerts([]);
    } finally {
      setLoadingCerts(false);
    }
  };

  useEffect(() => {
    if (selectedPending?.workerId) loadPendingCerts(selectedPending.workerId);
    else setPendingCerts([]);
  }, [selectedPending]);

  const handleApproveWorker = async (workerId: string) => {
    try {
      await verifyWorker(workerId);
      toast.success("Đã phê duyệt thợ!");
      setSelectedPending(null);
      await loadData();
    } catch (error) {
      toast.error("Lỗi khi phê duyệt");
      console.error(error);
    }
  };

  // ✅ Reject: giữ UI nhưng chưa gọi API vì backend chưa có endpoint
  const handleRejectWorker = async () => {
    if (!selectedPending || !rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setRejecting(true);
    try {
      // 🔕 Backend chưa có endpoint reject => tạm thời chỉ thông báo
      toast.info("Backend chưa hỗ trợ endpoint Reject. Tạm thời chưa thể từ chối trên hệ thống.");
      // giữ nguyên data, không xóa khỏi list
      setRejectDialogOpen(false);
    } finally {
      setRejecting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
      case "online":
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Sẵn sàng
          </Badge>
        );
      case "busy":
        return <Badge className="bg-orange-500">Đang bận</Badge>;
      case "offline":
        return <Badge variant="secondary">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredActive = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return activeWorkers;

    return activeWorkers.filter(
      (w) =>
        (w.fullName || "").toLowerCase().includes(q) ||
        (w.phone || "").includes(searchTerm) ||
        (w.bio || "").toLowerCase().includes(q),
    );
  }, [activeWorkers, searchTerm]);

  // ✅ Rating TB (weighted theo ratingCount, chuẩn hơn)
  const overallRatingAvg = useMemo(() => {
    const totalCount = activeWorkers.reduce((acc: number, w) => acc + (Number(w.ratingCount) || 0), 0);
    const totalSum = activeWorkers.reduce(
      (acc: number, w) => acc + (Number(w.ratingAvg) || 0) * (Number(w.ratingCount) || 0),
      0,
    );
    const avg = totalCount > 0 ? totalSum / totalCount : 0;
    return Number.isFinite(avg) ? avg.toFixed(1) : "0.0";
  }, [activeWorkers]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Thợ Sửa Chữa</h1>
          <p className="text-gray-600">Tổng {activeWorkers.length} thợ đang hoạt động</p>
        </div>
        <div className="flex gap-2">
          {pendingWorkers.length > 0 && (
            <Badge className="bg-orange-500 px-4 py-2">{pendingWorkers.length} đơn chờ duyệt</Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Sẵn sàng</p>
                <p className="text-3xl text-green-600">
                  {activeWorkers.filter((t) => t.availabilityStatus === "available").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Đang bận</p>
                <p className="text-3xl text-orange-600">
                  {activeWorkers.filter((t) => t.availabilityStatus === "busy").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Đã xác minh</p>
                <p className="text-3xl text-purple-600">{activeWorkers.filter((t) => t.isVerified).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Rating TB</p>
                <p className="text-3xl text-blue-600">{overallRatingAvg}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-white shadow-lg p-1">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007BFF] data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Đang hoạt động ({activeWorkers.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
          >
            Chờ phê duyệt ({pendingWorkers.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Technicians */}
        <TabsContent value="active" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Thợ</TableHead>
                    <TableHead>Kỹ năng</TableHead>
                    <TableHead>Giá/h</TableHead>
                    <TableHead className="text-center">Đánh giá</TableHead>
                    <TableHead className="text-center">Số việc</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                          Đang tải dữ liệu...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredActive.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                        Không tìm thấy thợ nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActive.map((tech) => (
                      <TableRow key={tech.workerId} className="hover:bg-blue-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white relative">
                              {(tech.fullName || "T").charAt(0)}
                              {tech.isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{tech.fullName || "Chưa đặt tên"}</p>
                              <p className="text-sm text-gray-500">{tech.phone || "N/A"}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {(tech.skills || []).map((s) => (
                              <Badge key={s.skillId} variant="outline" className="text-xs">
                                Cat {s.categoryId}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="font-medium text-green-600">
                          {(tech.hourlyRate || 0).toLocaleString("vi-VN")}đ
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{Number(tech.ratingAvg ?? 0).toFixed(1)}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">{tech.completedJobs ?? 0}</TableCell>

                        <TableCell className="text-center">{getStatusBadge(tech.availabilityStatus)}</TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTech(tech)} title="Xem nhanh">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/technicians/${tech.workerId}`)}
                              title="Đi tới trang chi tiết"
                            >
                              Chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Technicians */}
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingWorkers.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-100" />
                  <p>Không có đơn đăng ký nào đang chờ duyệt</p>
                </CardContent>
              </Card>
            ) : (
              pendingWorkers.map((tech) => (
                <Card key={tech.workerId} className="border-2 border-orange-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl">
                          {(tech.fullName || "T").charAt(0)}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-1">{tech.fullName || "Chưa đặt tên"}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tech.phone || "N/A"}</p>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Kỹ năng</p>
                              <div className="flex gap-1 flex-wrap mt-1">
                                {(tech.skills || []).map((s) => (
                                  <Badge key={s.skillId} variant="outline" className="text-xs">
                                    Cat {s.categoryId}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Bán kính</p>
                              <p className="text-sm font-medium mt-1">{tech.workingRadiusKm ?? 0} km</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Giá kỳ vọng</p>
                              <p className="text-sm font-medium text-blue-600 mt-1">
                                {(tech.hourlyRate || 0).toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedPending(tech)}>
                          <Eye className="w-4 h-4 mr-1" /> Chi tiết
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                          onClick={() => handleApproveWorker(tech.workerId)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Detail Dialog */}
      <Dialog open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Hồ sơ thợ sửa chữa</DialogTitle>
          </DialogHeader>

          {selectedTech && (
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {(selectedTech.fullName || "T").charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedTech.fullName || "Chưa đặt tên"}</h3>
                  <p className="text-gray-500">{selectedTech.phone || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Trạng thái</p>
                  <div className="mt-1">{getStatusBadge(selectedTech.availabilityStatus)}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Giá theo giờ</p>
                  <p className="font-bold text-lg">{(selectedTech.hourlyRate || 0).toLocaleString("vi-VN")}đ</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Xác minh</p>
                  <p className="font-medium text-green-600">
                    {selectedTech.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Tham gia</p>
                  <p className="font-medium">
                    {selectedTech.createdAt ? new Date(selectedTech.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                  </p>
                </div>

                {/* ✅ thêm quick rating trong dialog */}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Rating</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{Number(selectedTech.ratingAvg ?? 0).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({selectedTech.ratingCount ?? 0})</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">Giới thiệu</p>
                <p className="text-sm text-gray-600 italic">"{selectedTech.bio || ""}"</p>
              </div>

              <div>
                <p className="font-medium mb-2">Kỹ năng</p>
                <div className="flex gap-2 flex-wrap">
                  {(selectedTech.skills || []).map((s) => (
                    <Badge key={s.skillId} variant="secondary">
                      Category {s.categoryId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTech(null)}>
              Đóng
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={() => toast.info("Chức năng khóa tài khoản: cần endpoint backend để thực hiện.")}
            >
              Tạm khóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pending Detail Dialog */}
      <Dialog open={!!selectedPending} onOpenChange={() => setSelectedPending(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Đơn đăng ký thợ mới</DialogTitle>
            <DialogDescription>Kiểm tra kỹ thông tin CCCD và chứng chỉ trước khi duyệt</DialogDescription>
          </DialogHeader>

          {selectedPending && (
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {(selectedPending.fullName || "T").charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedPending.fullName || "Chưa đặt tên"}</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Ngày ký:{" "}
                      {selectedPending.createdAt
                        ? new Date(selectedPending.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Số điện thoại</p>
                  <p className="font-medium">{selectedPending.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Bán kính phục vụ</p>
                  <p className="font-medium">{selectedPending.workingRadiusKm ?? 0} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Giá mong muốn</p>
                  <p className="font-bold text-blue-600">
                    {(selectedPending.hourlyRate || 0).toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">CCCD</p>
                  <p className="font-medium">{selectedPending.idCardNumber || "Chưa cung cấp"}</p>
                </div>
              </div>

              {/* CCCD Images */}
              <div>
                <p className="font-medium mb-3">Hình ảnh CCCD</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase">Mặt trước</p>
                    {selectedPending.idCardFrontUrl ? (
                      <a href={selectedPending.idCardFrontUrl} target="_blank" rel="noreferrer" className="block">
                        <img
                          src={selectedPending.idCardFrontUrl}
                          alt="CCCD Mặt trước"
                          className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                        />
                      </a>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                        Chưa tải lên
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase">Mặt sau</p>
                    {selectedPending.idCardBackUrl ? (
                      <a href={selectedPending.idCardBackUrl} target="_blank" rel="noreferrer" className="block">
                        <img
                          src={selectedPending.idCardBackUrl}
                          alt="CCCD Mặt sau"
                          className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                        />
                      </a>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                        Chưa tải lên
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">Giới thiệu</p>
                <div className="bg-white p-3 border rounded-lg text-sm text-gray-600">{selectedPending.bio || ""}</div>
              </div>

              <div>
                <p className="font-medium mb-3">Thông tin Ngân hàng</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p>
                    <strong>Ngân hàng:</strong> {selectedPending.bankName || "N/A"}
                  </p>
                  <p>
                    <strong>Chủ TK:</strong> {selectedPending.bankAccountName || "N/A"}
                  </p>
                  <p>
                    <strong>Số TK:</strong> {selectedPending.bankAccountNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-3">Chứng chỉ xác thực</p>
                {loadingCerts ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin h-3 w-3 border-b-2 border-blue-600 rounded-full" />
                    Đang tải chứng chỉ...
                  </div>
                ) : pendingCerts.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Không có chứng chỉ đính kèm</p>
                ) : (
                  <div className="space-y-3">
                    {pendingCerts.map((cert) => (
                      <div
                        key={cert.certId}
                        className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{cert.certName}</p>
                            <p className="text-xs text-gray-500">
                              Cấp bởi: {cert.issuedBy || "N/A"} •{" "}
                              {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString("vi-VN") : "N/A"}
                            </p>
                          </div>
                        </div>

                        {cert.documentUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={cert.documentUrl} target="_blank" rel="noreferrer">
                              <Eye className="w-4 h-4 mr-2" />
                              Xem File
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSelectedPending(null)}>
              Hủy
            </Button>

            <div className="flex gap-2">
              {/* ✅ giữ nút Reject + dialog, nhưng tạm disable logic backend */}
              <Button
                variant="destructive"
                onClick={() => {
                  setRejectDialogOpen(true);
                }}
              >
                Từ chối
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700 font-bold"
                onClick={() => selectedPending && handleApproveWorker(selectedPending.workerId)}
              >
                Phê duyệt ngay
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog (UI giữ nguyên) */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối hồ sơ</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối hồ sơ này. <br />
              <span className="text-orange-600 font-medium">
                Lưu ý: Backend hiện chưa có endpoint Reject, nên chức năng này tạm thời chỉ hiển thị UI.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lý do từ chối</Label>
              <Textarea
                placeholder="Ví dụ: Ảnh CMND bị mờ, Chứng chỉ không hợp lệ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleRejectWorker} disabled={rejecting}>
              {rejecting ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
