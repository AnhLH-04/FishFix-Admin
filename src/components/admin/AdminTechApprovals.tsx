import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Search } from "lucide-react";

import {
  adminApprove,
  adminGetApprovalDetail,
  adminListApprovals,
  adminReject,
  ApprovalDetail,
  ApprovalItem,
} from "../../api/adminApprovals";

export function AdminTechApprovals() {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [q, setQ] = useState("");
  const [list, setList] = useState<ApprovalItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [detail, setDetail] = useState<ApprovalDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter((x) => (x.fullName || "").toLowerCase().includes(t) || (x.phone || "").includes(t));
  }, [list, q]);

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await adminListApprovals(tab);
      setList(res.data);
      if (!selectedId && res.data.length) setSelectedId(res.data[0].technicianId);
    } catch {
      toast.error("Không tải được danh sách duyệt hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id: string) => {
    setLoading(true);
    try {
      const res = await adminGetApprovalDetail(id);
      setDetail(res.data);
      setRejectReason(res.data.rejectReason || "");
    } catch {
      toast.error("Không tải được chi tiết hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const onApprove = async () => {
    if (!detail) return;
    setLoading(true);
    try {
      await adminApprove(detail.technicianId);
      toast.success("Đã phê duyệt hồ sơ");
      await loadList();
      await loadDetail(detail.technicianId);
    } catch (e: any) {
      toast.error(e?.message || "Phê duyệt thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onReject = async () => {
    if (!detail) return;
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    setLoading(true);
    try {
      await adminReject(detail.technicianId, rejectReason.trim());
      toast.success("Đã từ chối hồ sơ");
      await loadList();
      await loadDetail(detail.technicianId);
    } catch (e: any) {
      toast.error(e?.message || "Từ chối thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Duyệt hồ sơ thợ</h1>
        <p className="text-gray-600">Quản lý và phê duyệt các chứng chỉ thợ mới đăng ký</p>
      </div>

      <div className="grid xl:grid-cols-[360px_1fr] gap-4">
        {/* left */}
        <Card className="rounded-2xl">
          <CardContent className="p-4 space-y-3">
            <Tabs value={tab} onValueChange={(v: any) => setTab(v as any)}>
              <TabsList className="bg-gray-100 rounded-2xl p-1 w-full">
                <TabsTrigger className="rounded-xl flex-1" value="pending">
                  Chờ duyệt
                </TabsTrigger>
                <TabsTrigger className="rounded-xl flex-1" value="approved">
                  Đã duyệt
                </TabsTrigger>
                <TabsTrigger className="rounded-xl flex-1" value="rejected">
                  Từ chối
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên thợ hoặc SĐT..."
                className="pl-9 rounded-xl"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {filtered.map((x) => (
                <button
                  key={x.technicianId}
                  onClick={() => setSelectedId(x.technicianId)}
                  className={[
                    "w-full text-left border rounded-2xl p-3 hover:bg-gray-50 transition",
                    selectedId === x.technicianId ? "border-blue-300 bg-blue-50" : "",
                  ].join(" ")}
                >
                  <div className="font-extrabold text-gray-900">{x.fullName}</div>
                  <div className="text-sm text-gray-600">
                    {x.phone || "—"} • {x.district || ""} {x.city ? `, ${x.city}` : ""}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Trạng thái: <b>{x.status}</b>
                  </div>
                </button>
              ))}
              {!filtered.length && <div className="text-sm text-gray-600">Không có dữ liệu.</div>}
            </div>
          </CardContent>
        </Card>

        {/* right */}
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            {!detail ? (
              <div className="text-sm text-gray-600">Chọn một hồ sơ để xem chi tiết.</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-extrabold text-gray-900">{detail.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {detail.phone || "—"} • {detail.district || ""} {detail.city ? `, ${detail.city}` : ""}
                    </div>
                  </div>

                  {detail.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                        disabled={loading}
                        onClick={onReject}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Từ chối
                      </Button>
                      <Button
                        className="rounded-xl bg-green-600 hover:bg-green-700"
                        disabled={loading}
                        onClick={onApprove}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Phê duyệt
                      </Button>
                    </div>
                  )}
                </div>

                {/* reject reason */}
                {detail.status !== "approved" && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-900">Lý do (nếu từ chối)</div>
                    <Input
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="rounded-xl"
                      placeholder="VD: Thiếu CCCD mặt sau / ảnh mờ / chứng chỉ không hợp lệ..."
                    />
                  </div>
                )}

                {/* docs */}
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-gray-900">Bằng cấp & Chứng chỉ ({detail.documents.length})</div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {detail.documents.map((d) => (
                    <a
                      key={d.id}
                      href={d.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="border rounded-2xl overflow-hidden hover:shadow-md transition block"
                    >
                      <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                        {d.fileName.toLowerCase().endsWith(".pdf") ? "PDF" : "IMAGE"}
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-gray-900">{d.fileName}</div>
                        <div className="text-xs text-gray-500">{d.type || "Tài liệu"}</div>
                      </div>
                    </a>
                  ))}
                </div>

                {detail.status !== "pending" && (
                  <div className="text-sm text-gray-600">
                    Trạng thái hiện tại: <b>{detail.status}</b>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
