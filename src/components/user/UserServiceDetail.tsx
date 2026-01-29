// import { useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { mainServices, detailedServicesByCategory, ServiceCategoryId } from "./serviceData";

// export function UserServiceDetail() {
//   const navigate = useNavigate();
//   const { category, detailId } = useParams<{ category: ServiceCategoryId; detailId: string }>();

//   const { mainService, detailedService } = useMemo(() => {
//     if (!category || !detailId) return { mainService: null, detailedService: null };

//     const mainService = mainServices.find((s) => s.category === category) || null;
//     const detailedList = detailedServicesByCategory[category] || [];
//     const detailedService = detailedList.find((d) => d.id === Number(detailId)) || null;

//     return { mainService, detailedService };
//   }, [category, detailId]);

//   if (!mainService || !detailedService) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="text-5xl">😕</div>
//           <p className="text-lg text-gray-600">Không tìm thấy dịch vụ bạn yêu cầu.</p>
//           <Button onClick={() => navigate("/services")}>Quay lại danh sách dịch vụ</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
//         <div className="container mx-auto px-4">
//           <button className="text-sm text-blue-100 hover:text-white mb-4" onClick={() => navigate(-1)}>
//             ← Quay lại
//           </button>
//           <h1 className="text-3xl md:text-4xl font-bold mb-2">{detailedService.name}</h1>
//           <p className="text-blue-100 text-lg">Thuộc nhóm: {mainService.name}</p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 -mt-6 pb-12">
//         <Card className="shadow-lg border-0 mb-6">
//           <CardHeader>
//             <div className="flex items-center justify-between gap-4">
//               <div>
//                 <CardTitle className="text-2xl mb-2">Chi tiết dịch vụ</CardTitle>
//                 <CardDescription className="text-base text-gray-700">{detailedService.description}</CardDescription>
//               </div>
//               {detailedService.popular && (
//                 <Badge className="bg-yellow-400 text-black text-sm h-7 px-3 flex items-center">Phổ biến</Badge>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3 text-base">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Khoảng giá tham khảo</span>
//               <span className="font-semibold text-blue-600">{detailedService.priceRange}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Thời gian thực hiện dự kiến</span>
//               <span className="font-medium">{detailedService.duration}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <Button
//             className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//             onClick={() => navigate(`/booking?service=${category}&detailId=${detailId}`)}
//           >
//             Đặt lịch dịch vụ này
//           </Button>
//           <Button variant="outline" className="flex-1" onClick={() => navigate("/services")}>
//             Xem thêm dịch vụ khác
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/user/UserServiceDetail.tsx

// import { useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
// import { mainServices, detailedServicesByCategory, type ServiceCategoryId } from "./serviceData";
// import { Clock, Wallet, ArrowLeft, Wrench, Search, Star } from "lucide-react";

// export default function UserServiceDetail() {
//   const navigate = useNavigate();
//   const { category = "", detailId = "" } = useParams();

//   // ✅ Ép kiểu category về union type
//   const cat = category as ServiceCategoryId;

//   // ✅ Ép string -> number để match DetailedService.id
//   const detailIdNum = Number(detailId);

//   const categoryInfo = useMemo(() => {
//     return mainServices.find((s) => s.category === cat) ?? null;
//   }, [cat]);

//   const detail = useMemo(() => {
//     const list = detailedServicesByCategory[cat] ?? [];
//     return list.find((d) => d.id === detailIdNum) ?? null;
//   }, [cat, detailIdNum]);

//   // gợi ý 3 dịch vụ liên quan cùng category (trừ chính nó)
//   const related = useMemo(() => {
//     const list = detailedServicesByCategory[cat] ?? [];
//     return list.filter((d) => d.id !== detailIdNum).slice(0, 3);
//   }, [cat, detailIdNum]);

//   if (!detail) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-3">Không tìm thấy dịch vụ</h1>
//             <p className="text-blue-100">
//               Category: <b className="text-white">{category || "N/A"}</b> • DetailId:{" "}
//               <b className="text-white">{detailId || "N/A"}</b>
//             </p>
//           </div>
//         </div>

//         <div className="container mx-auto px-4 -mt-8">
//           <Card className="border-0 shadow-lg rounded-2xl max-w-3xl mx-auto">
//             <CardContent className="p-6">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div>
//                   <p className="text-gray-700">Dịch vụ bạn truy cập không tồn tại hoặc URL chưa đúng.</p>
//                   <p className="text-sm text-gray-500 mt-1">Hãy quay lại trang Services để chọn lại.</p>
//                 </div>
//                 <Button
//                   className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
//                   onClick={() => navigate("/services")}
//                 >
//                   Quay lại Services
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   const icon = categoryInfo?.icon ?? "🧰";
//   const categoryName = categoryInfo?.name ?? cat;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* HERO giống trang Services */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14 md:py-16">
//         <div className="container mx-auto px-4">
//           <button
//             className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={18} />
//             Quay lại
//           </button>

//           <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div className="flex items-start gap-4">
//               <div className="bg-white/15 backdrop-blur w-16 h-16 rounded-2xl flex items-center justify-center shadow-md">
//                 <span className="text-3xl">{icon}</span>
//               </div>

//               <div>
//                 <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{detail.name}</h1>
//                 <p className="mt-1 text-blue-100">
//                   Danh mục: <b className="text-white">{categoryName}</b> • Mã: <b className="text-white">{detail.id}</b>
//                 </p>

//                 <div className="mt-3 flex flex-wrap gap-2">
//                   <Badge className="bg-white/15 text-white border border-white/15">{categoryName}</Badge>
//                   {detail.popular && <Badge className="bg-yellow-400 text-black">Phổ biến</Badge>}
//                 </div>
//               </div>
//             </div>

//             {/* Quick CTA bên phải (giống vibe trang Services) */}
//             <div className="flex gap-2">
//               <Button
//                 className="bg-white text-slate-900 hover:bg-white/90 shadow-md"
//                 onClick={() => navigate(`/booking?service=${cat}`)}
//               >
//                 Đặt lịch ngay
//               </Button>
//               <Button
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
//                 onClick={() => navigate(`/technicians?service=${cat}&fromCategory=${cat}&fromDetailId=${detail.id}`)}
//               >
//                 Tìm thợ
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="container mx-auto px-4 -mt-8 pb-12">
//         {/* Main card giống layout Services */}
//         <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
//           <CardHeader>
//             <CardTitle className="text-2xl">Thông tin dịch vụ</CardTitle>
//             <CardDescription>Chi tiết công việc, thời gian dự kiến và khoảng giá tham khảo.</CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             {/* Description */}
//             <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-5">
//               <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//                 <Wrench size={18} className="text-blue-600" />
//                 Mô tả
//               </p>
//               <p className="mt-2 text-gray-700 leading-relaxed">{detail.description}</p>
//             </div>

//             {/* Stats rows giống card Services */}
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
//                 <span className="text-gray-600 font-medium inline-flex items-center gap-2">
//                   <Wallet size={16} className="text-gray-500" />
//                   Khoảng giá
//                 </span>
//                 <span className="font-bold text-blue-600">{detail.priceRange}</span>
//               </div>

//               <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
//                 <span className="text-gray-600 font-medium inline-flex items-center gap-2">
//                   <Clock size={16} className="text-gray-500" />
//                   Thời gian dự kiến
//                 </span>
//                 <span className="font-bold text-gray-900">{detail.duration}</span>
//               </div>
//             </div>

//             {/* Extra UX note */}
//             <div className="text-sm text-gray-500">
//               * Giá và thời gian có thể thay đổi tuỳ tình trạng thực tế. Bạn có thể chọn “Tìm thợ” để xem thợ phù hợp.
//             </div>
//           </CardContent>

//           <CardFooter className="flex flex-col md:flex-row gap-3 p-6 pt-0">
//             <Button
//               className="w-full md:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
//               onClick={() => navigate(`/technicians?service=${cat}&fromCategory=${cat}&fromDetailId=${detail.id}`)}
//             >
//               <Search className="mr-2 h-4 w-4" />
//               Tìm thợ cho dịch vụ này
//             </Button>

//             <Button variant="outline" className="w-full md:flex-1" onClick={() => navigate(`/booking?service=${cat}`)}>
//               Đặt lịch ngay
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* Related services (cùng category) */}
//         {related.length > 0 && (
//           <div className="mt-10">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-2xl font-bold text-gray-900">Dịch vụ liên quan</h2>
//               <Button
//                 variant="ghost"
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => navigate("/services")}
//               >
//                 Xem tất cả
//               </Button>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {related.map((r) => (
//                 <Card
//                   key={r.id}
//                   className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
//                   onClick={() => navigate(`/services/${cat}/${r.id}`)}
//                 >
//                   <CardHeader className="pb-3">
//                     <div className="flex items-center justify-between gap-2">
//                       <CardTitle className="text-base font-semibold">{r.name}</CardTitle>
//                       {r.popular && <Badge className="bg-yellow-400 text-black">Phổ biến</Badge>}
//                     </div>
//                     <CardDescription className="mt-1 text-sm text-gray-600">{r.description}</CardDescription>
//                   </CardHeader>

//                   <CardContent className="pt-0 pb-4 text-sm space-y-2">
//                     <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
//                       <span className="text-gray-600 font-medium">Khoảng giá:</span>
//                       <span className="font-bold text-blue-600">{r.priceRange}</span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
//                       <span className="text-gray-600 font-medium">Thời gian:</span>
//                       <span className="font-bold text-gray-900">{r.duration}</span>
//                     </div>

//                     {/* small "rating-style" line to match Services vibe (optional, purely UI) */}
//                     <div className="flex items-center gap-2 text-xs text-gray-500">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span>Phù hợp danh mục {categoryName}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { mainServices, detailedServicesByCategory, type ServiceCategoryId } from "./serviceData";
import { ArrowLeft, Search, Star, Clock, ShieldCheck, BadgeDollarSign, CheckCircle2, Square } from "lucide-react";

const HERO_BG_BY_CATEGORY: Partial<Record<ServiceCategoryId, string>> = {
  hvac: "https://images.unsplash.com/photo-1647022528152-52ed9338611d?auto=format&fit=crop&w=1800&q=80",
  plumbing: "https://images.unsplash.com/photo-1581579186913-45ac2de52fdb?auto=format&fit=crop&w=1800&q=80",
  electric: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80",
  electronics: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1800&q=80",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=80",
  painting: "https://images.unsplash.com/photo-1562259949-edd4b9b12b4f?auto=format&fit=crop&w=1800&q=80",
  woodwork: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1800&q=80",
  vehicle: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1800&q=80",
};

const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1513612027093-46da490bbd5b?auto=format&fit=crop&w=1800&q=80";

export default function UserServiceDetail() {
  const navigate = useNavigate();
  const { category = "", detailId = "" } = useParams();

  const cat = category as ServiceCategoryId;
  const detailIdNum = Number(detailId);

  const categoryInfo = useMemo(() => mainServices.find((s) => s.category === cat) ?? null, [cat]);

  const detail = useMemo(() => {
    const list = detailedServicesByCategory[cat] ?? [];
    return list.find((d) => d.id === detailIdNum) ?? null;
  }, [cat, detailIdNum]);

  const listAllInCategory = useMemo(() => detailedServicesByCategory[cat] ?? [], [cat]);

  const [q, setQ] = useState("");
  const [heroImgOk, setHeroImgOk] = useState(true);

  const filteredIssues = useMemo(() => {
    const base = listAllInCategory;
    const k = q.trim().toLowerCase();
    if (!k) return base;
    return base.filter((x) => x.name.toLowerCase().includes(k) || x.description.toLowerCase().includes(k));
  }, [q, listAllInCategory]);

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Không tìm thấy dịch vụ</CardTitle>
              <CardDescription>
                Category: <b>{category || "N/A"}</b> • DetailId: <b>{detailId || "N/A"}</b>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/services")}>Quay lại Services</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const categoryName = categoryInfo?.name ?? cat;
  const rating = categoryInfo?.avgRating ?? 4.7;
  const reviews = Math.round((categoryInfo?.technicianCount ?? 150) * 3.6);
  const priceFrom = (detail.priceRange?.split("-")?.[0] ?? "").trim() || "Từ 150.000đ";

  const heroBg = HERO_BG_BY_CATEGORY[cat] ?? DEFAULT_HERO_BG;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <div className="relative overflow-hidden">
        {heroImgOk && (
          <img
            src={heroBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setHeroImgOk(false)}
          />
        )}
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-900/20 to-blue-900/35" />

        <div className="relative mx-auto max-w-6xl px-4 pt-6 pb-10 md:pb-14">
          <button
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Quay lại danh sách
          </button>

          <div className="mt-10 md:mt-12 text-center text-white">
            <p className="text-white/80 text-sm md:text-base">Dịch vụ sửa chữa chuyên nghiệp</p>

            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{categoryName}</h1>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <b className="text-white">{rating.toFixed(1)}</b>
                <span className="text-white/75">({reviews} đánh giá)</span>
              </span>
              <span className="text-white/50">•</span>
              <span className="text-white/90 font-semibold">{priceFrom}</span>
              <span className="text-white/50">•</span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/75" />
                {detail.duration}
              </span>
            </div>

            <div className="mt-6 mx-auto max-w-3xl">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm kiếm vấn đề: vỡ màn hình, hết pin, không sạc..."
                  className="w-full rounded-full bg-white/15 border border-white/20 px-12 py-4 text-sm md:text-base text-white placeholder:text-white/70 outline-none focus:ring-2 focus:ring-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>
          </div>
        </div>

        {!heroImgOk && <div className="absolute inset-0 " />}
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Hint box */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-blue-100">
              <span className="text-blue-700 font-bold">?</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Không chắc vấn đề của bạn là gì?</p>
              <p className="text-sm text-slate-600 mt-1">
                Đừng lo! Hãy đọc các “Triệu chứng” bên dưới mỗi dịch vụ để tìm đúng vấn đề bạn đang gặp.
              </p>
              <button
                className="mt-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                onClick={() => navigate(`/booking?service=${cat}`)}
              >
                Hoặc gọi thợ để được tư vấn miễn phí
              </button>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="mt-8">
          <h2 className="text-lg font-extrabold text-slate-900">Các vấn đề thường gặp ({filteredIssues.length})</h2>
          <p className="text-sm text-slate-600 mt-1">Chọn vấn đề giống với tình trạng thiết bị của bạn</p>
        </div>

        {/* Grid issues (STYLE giống ảnh) */}
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {filteredIssues.map((it) => (
            <Card
              key={it.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] transition-shadow"
            >
              <CardContent className="p-5 md:p-6">
                {/* row 1: icon + title/desc + button */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      {/* icon vuông giống ảnh */}
                      <Square className="h-6 w-6 text-blue-700" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">{it.name}</p>
                      <p className="text-sm md:text-base text-slate-600 mt-1 line-clamp-2">{it.description}</p>
                    </div>
                  </div>

                  {/* ✅ CLICK “Chọn” -> sang trang Tìm thợ */}
                  <Button
                    className="h-11 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 shrink-0"
                    onClick={() => navigate(`/technicians?service=${cat}&fromCategory=${cat}&fromDetailId=${it.id}`)}
                  >
                    Chọn
                  </Button>
                </div>

                {/* row 2: meta */}
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Chi phí dự kiến</p>
                    <p className="mt-1 text-lg font-extrabold text-blue-700">{it.priceRange}</p>

                    {/* dòng nhỏ thời gian (bên trái) nếu bạn muốn giống ảnh điện thoại */}
                    <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      {it.duration}
                    </div>
                  </div>

                  {/* bản desktop giống ảnh: time phía phải */}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-slate-500">Thời gian</p>
                    <p className="mt-2 inline-flex items-center justify-end gap-2 text-base font-semibold text-slate-800">
                      <Clock className="h-5 w-5 text-slate-500" />
                      {it.duration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why choose us */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-center text-lg font-extrabold text-slate-900">Tại sao chọn chúng tôi?</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="mt-3 font-bold text-slate-900">Thợ chuyên nghiệp</p>
              <p className="mt-1 text-sm text-slate-600">Đội ngũ thợ có kinh nghiệm, được kiểm định kỹ lưỡng</p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-blue-700" />
              </div>
              <p className="mt-3 font-bold text-slate-900">Bảo hành dài hạn</p>
              <p className="mt-1 text-sm text-slate-600">Linh kiện chính hãng, bảo hành lên đến 12 tháng</p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                <BadgeDollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <p className="mt-3 font-bold text-slate-900">Giá minh bạch</p>
              <p className="mt-1 text-sm text-slate-600">Báo giá rõ ràng, thanh toán sau khi hoàn thành</p>
            </div>
          </div>
        </div>

        {/* CTA bottom */}
        <div className="mt-10 rounded-2xl bg-blue-700 p-6 md:p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
          <h3 className="text-center text-xl font-extrabold">Vẫn chưa chắc vấn đề của bạn?</h3>
          <p className="text-center mt-2 text-white/85 text-sm md:text-base max-w-2xl mx-auto">
            Đừng lo! Liên hệ với chúng tôi để được tư vấn miễn phí bởi chuyên gia. Chúng tôi sẽ giúp bạn xác định đúng
            vấn đề và báo giá chính xác.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-white text-slate-900 hover:bg-white/90 rounded-xl px-6"
              onClick={() => navigate(`/technicians?service=${cat}&fromCategory=${cat}&fromDetailId=${detail.id}`)}
            >
              Tìm thợ ngay
            </Button>
            <Button
              variant="outline"
              className="border-white/30 hover:bg-white/10 rounded-xl px-6"
              onClick={() => alert("Gọi: 1900-xxxx")}
            >
              Gọi: 1900-xxxx
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
