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

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { mainServices, detailedServicesByCategory, type ServiceCategoryId } from "./serviceData";
import { Clock, Wallet, ArrowLeft, Wrench, Search, Star } from "lucide-react";

export default function UserServiceDetail() {
  const navigate = useNavigate();
  const { category = "", detailId = "" } = useParams();

  // ✅ Ép kiểu category về union type
  const cat = category as ServiceCategoryId;

  // ✅ Ép string -> number để match DetailedService.id
  const detailIdNum = Number(detailId);

  const categoryInfo = useMemo(() => {
    return mainServices.find((s) => s.category === cat) ?? null;
  }, [cat]);

  const detail = useMemo(() => {
    const list = detailedServicesByCategory[cat] ?? [];
    return list.find((d) => d.id === detailIdNum) ?? null;
  }, [cat, detailIdNum]);

  // gợi ý 3 dịch vụ liên quan cùng category (trừ chính nó)
  const related = useMemo(() => {
    const list = detailedServicesByCategory[cat] ?? [];
    return list.filter((d) => d.id !== detailIdNum).slice(0, 3);
  }, [cat, detailIdNum]);

  if (!detail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Không tìm thấy dịch vụ</h1>
            <p className="text-blue-100">
              Category: <b className="text-white">{category || "N/A"}</b> • DetailId:{" "}
              <b className="text-white">{detailId || "N/A"}</b>
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-8">
          <Card className="border-0 shadow-lg rounded-2xl max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-gray-700">Dịch vụ bạn truy cập không tồn tại hoặc URL chưa đúng.</p>
                  <p className="text-sm text-gray-500 mt-1">Hãy quay lại trang Services để chọn lại.</p>
                </div>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                  onClick={() => navigate("/services")}
                >
                  Quay lại Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const icon = categoryInfo?.icon ?? "🧰";
  const categoryName = categoryInfo?.name ?? cat;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO giống trang Services */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14 md:py-16">
        <div className="container mx-auto px-4">
          <button
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/15 backdrop-blur w-16 h-16 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-3xl">{icon}</span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{detail.name}</h1>
                <p className="mt-1 text-blue-100">
                  Danh mục: <b className="text-white">{categoryName}</b> • Mã: <b className="text-white">{detail.id}</b>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="bg-white/15 text-white border border-white/15">{categoryName}</Badge>
                  {detail.popular && <Badge className="bg-yellow-400 text-black">Phổ biến</Badge>}
                </div>
              </div>
            </div>

            {/* Quick CTA bên phải (giống vibe trang Services) */}
            <div className="flex gap-2">
              <Button
                className="bg-white text-slate-900 hover:bg-white/90 shadow-md"
                onClick={() => navigate(`/booking?service=${cat}`)}
              >
                Đặt lịch ngay
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                onClick={() => navigate(`/technicians?service=${cat}&fromCategory=${cat}&fromDetailId=${detail.id}`)}
              >
                Tìm thợ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 -mt-8 pb-12">
        {/* Main card giống layout Services */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Thông tin dịch vụ</CardTitle>
            <CardDescription>Chi tiết công việc, thời gian dự kiến và khoảng giá tham khảo.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-5">
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Wrench size={18} className="text-blue-600" />
                Mô tả
              </p>
              <p className="mt-2 text-gray-700 leading-relaxed">{detail.description}</p>
            </div>

            {/* Stats rows giống card Services */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium inline-flex items-center gap-2">
                  <Wallet size={16} className="text-gray-500" />
                  Khoảng giá
                </span>
                <span className="font-bold text-blue-600">{detail.priceRange}</span>
              </div>

              <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium inline-flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  Thời gian dự kiến
                </span>
                <span className="font-bold text-gray-900">{detail.duration}</span>
              </div>
            </div>

            {/* Extra UX note */}
            <div className="text-sm text-gray-500">
              * Giá và thời gian có thể thay đổi tuỳ tình trạng thực tế. Bạn có thể chọn “Tìm thợ” để xem thợ phù hợp.
            </div>
          </CardContent>

          <CardFooter className="flex flex-col md:flex-row gap-3 p-6 pt-0">
            <Button
              className="w-full md:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              onClick={() => navigate(`/technicians?service=${cat}&fromCategory=${cat}&fromDetailId=${detail.id}`)}
            >
              <Search className="mr-2 h-4 w-4" />
              Tìm thợ cho dịch vụ này
            </Button>

            <Button variant="outline" className="w-full md:flex-1" onClick={() => navigate(`/booking?service=${cat}`)}>
              Đặt lịch ngay
            </Button>
          </CardFooter>
        </Card>

        {/* Related services (cùng category) */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Dịch vụ liên quan</h2>
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => navigate("/services")}
              >
                Xem tất cả
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Card
                  key={r.id}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/services/${cat}/${r.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base font-semibold">{r.name}</CardTitle>
                      {r.popular && <Badge className="bg-yellow-400 text-black">Phổ biến</Badge>}
                    </div>
                    <CardDescription className="mt-1 text-sm text-gray-600">{r.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 pb-4 text-sm space-y-2">
                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-600 font-medium">Khoảng giá:</span>
                      <span className="font-bold text-blue-600">{r.priceRange}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-600 font-medium">Thời gian:</span>
                      <span className="font-bold text-gray-900">{r.duration}</span>
                    </div>

                    {/* small "rating-style" line to match Services vibe (optional, purely UI) */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>Phù hợp danh mục {categoryName}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
