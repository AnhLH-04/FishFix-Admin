// src/pages/technician/TechnicianSettingsPage.tsx
import { useEffect, useMemo, useState } from "react";
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

export default function TechnicianSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [meId, setMeId] = useState<string | null>(null);
  const [workerId, setWorkerId] = useState<string | null>(() => localStorage.getItem("workerId"));
  const [profile, setProfile] = useState<WorkerProfileDto | null>(null);
  const [certs, setCerts] = useState<CertificationDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasApprovedCert = useMemo(() => {
    // Nếu backend không có status, bạn chỉ cần check certs.length > 0
    return certs.some((c) => (c.status ?? "Approved") === "Approved");
  }, [certs]);

  async function bootstrap() {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      setMeId(me.id);

      // 1) Có workerId thì load profile
      if (workerId) {
        const p = await getWorkerProfile(workerId);
        setProfile(p);
      } else {
        // 2) Chưa có workerId => tạo worker profile bằng userId
        const created = await createWorkerProfile({ userId: me.id });
        setWorkerId(created.workerId);
        localStorage.setItem("workerId", created.workerId);
        setProfile(created);
      }

      // 3) Load chứng chỉ
      const wid = workerId ?? localStorage.getItem("workerId") ?? null;
      if (wid) {
        const list = await listCertifications(wid);
        setCerts(list);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Có lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSaveProfile(next: Partial<WorkerProfileDto>) {
    if (!workerId) return;
    const updated = await updateWorkerProfile(workerId, {
      bio: next.bio,
      availabilityStatus: next.availabilityStatus,
      workingRadiusKm: next.workingRadiusKm,
      hourlyRate: next.hourlyRate,
    });
    setProfile(updated);
  }

  async function onAddCert(form: {
    certName: string;
    documentUrl: string; // URL sau khi upload lên storage
    certNumber?: string;
    issuedBy?: string;
    issuedDate?: string;
    expiryDate?: string;
  }) {
    if (!workerId) return;
    await addCertification(workerId, form);
    const list = await listCertifications(workerId);
    setCerts(list);
  }

  async function onDeleteCert(certId: string) {
    await deleteCertification(certId);
    if (workerId) setCerts(await listCertifications(workerId));
  }

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Cài đặt thợ</h1>

      {/* Banner bắt buộc chứng chỉ */}
      {!hasApprovedCert && (
        <div style={{ padding: 12, border: "1px solid #f0c36d", marginBottom: 12 }}>
          <b>Bắt buộc:</b> Bạn cần tải lên bằng/chứng chỉ để kích hoạt tài khoản thợ.
        </div>
      )}

      <section style={{ marginBottom: 16 }}>
        <h2>Hồ sơ</h2>
        <div>WorkerId: {workerId}</div>
        <div>UserId: {meId}</div>

        {/* Ví dụ input (bạn thay bằng UI thật của bạn) */}
        <button
          onClick={() =>
            onSaveProfile({
              bio: "Thợ điện lạnh 5 năm kinh nghiệm",
              availabilityStatus: "Online",
              workingRadiusKm: 10,
              hourlyRate: 150000,
            })
          }
        >
          Lưu hồ sơ (demo)
        </button>
      </section>

      <section>
        <h2>Chứng chỉ</h2>
        <button
          onClick={() =>
            onAddCert({
              certName: "Chứng chỉ nghề điện lạnh",
              documentUrl: "https://your-storage.com/cert.pdf",
              issuedBy: "Trung tâm A",
              issuedDate: "2025-01-01",
            })
          }
        >
          Thêm chứng chỉ (demo)
        </button>

        <ul>
          {certs.map((c) => (
            <li key={c.id}>
              {c.certName} — {c.status ?? "Pending"} <button onClick={() => onDeleteCert(c.id)}>Xóa</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
