// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { Search, Star, Filter, Clock } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { mainServices, detailedServicesByCategory } from "./serviceData";
// import { useMemo, useState } from "react";

// const HERO_BG = "https://images.unsplash.com/photo-1513612027093-46da490bbd5b?auto=format&fit=crop&w=2000&q=80";

// // Ảnh theo category (bạn có thể thay link)
// const categoryImages: Record<string, string> = {
//   electric: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1600&q=80",
//   plumbing: "https://images.unsplash.com/photo-1600566753151-384129cf4e3a?auto=format&fit=crop&w=1600&q=80",
//   hvac: "https://images.unsplash.com/photo-1647022528152-52ed9338611d?auto=format&fit=crop&w=1600&q=80",
//   painting: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=80",
//   electronics: "https://images.unsplash.com/photo-1562568068-7a90cf9e499d?auto=format&fit=crop&w=1600&q=80",
//   woodwork: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80",
//   vehicle: "https://images.unsplash.com/photo-1515923256482-1c04580f7b4a?auto=format&fit=crop&w=1600&q=80",
//   cleaning: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1600&q=80",
// };

// // fallback ảnh “chắc ăn”
// const fallbackImg = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80";

// // convert rating -> fake reviews cho giống ảnh (demo thôi)
// const toReviews = (rating: number, technicians: number) => Math.max(30, Math.round(rating * technicians));

// /** ✅ Ảnh an toàn: fail -> fallback1 -> fallback2 */
// function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
//   const [imgSrc, setImgSrc] = useState(src);

//   return (
//     <img
//       src={imgSrc}
//       alt={alt}
//       className={className}
//       loading="lazy"
//       referrerPolicy="no-referrer"
//       onError={(e) => {
//         const img = e.currentTarget as HTMLImageElement;

//         // fallback 1: dùng fallbackImg
//         if (!img.dataset.f1) {
//           img.dataset.f1 = "1";
//           setImgSrc(fallbackImg);
//           return;
//         }

//         // fallback 2: placeholder (cực chắc)
//         setImgSrc(`https://placehold.co/1200x600/png?text=${encodeURIComponent(alt)}`);
//       }}
//     />
//   );
// }

// /** ✅ Hero cũng nên dùng img để bắt onError */
// function SafeHero({ src }: { src: string }) {
//   const [imgSrc, setImgSrc] = useState(src);

//   return (
//     <div className="absolute inset-0">
//       <img
//         src={imgSrc}
//         alt="hero"
//         className="h-full w-full object-cover"
//         loading="eager"
//         referrerPolicy="no-referrer"
//         onError={() => setImgSrc(fallbackImg)}
//       />
//     </div>
//   );
// }

// export function UserServices() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const navigate = useNavigate();

//   const filteredServices = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return mainServices.filter((service) => {
//       const matchesSearch =
//         !q || service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q);

//       const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
//       return matchesSearch && matchesCategory;
//     });
//   }, [searchTerm, selectedCategory]);

//   // "Nổi bật" giống ảnh: lấy top 3 theo rating
//   const featuredServices = useMemo(() => {
//     return [...filteredServices].sort((a, b) => b.avgRating - a.avgRating).slice(0, 3);
//   }, [filteredServices]);

//   const otherServices = useMemo(() => {
//     const featuredIds = new Set(featuredServices.map((x) => x.id));
//     return filteredServices.filter((x) => !featuredIds.has(x.id));
//   }, [filteredServices, featuredServices]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* HERO: đổi backgroundImage -> img để tránh lỗi không bắt được */}
//       <section className="relative overflow-hidden">
//         <SafeHero src={HERO_BG} />
//         <div className="absolute inset-0 bg-slate-900/55" />
//         <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-900/20 to-blue-900/35" />

//         <div className="relative z-10">
//           <div className="mx-auto max-w-7xl px-4 py-14 md:py-16 text-center">
//             <p className="text-sm md:text-base font-semibold text-blue-100">Dịch Vụ Sửa Chữa Chuyên Nghiệp</p>
//             <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
//               Nhanh chóng, chất lượng cao với đội ngũ kỹ thuật viên giàu kinh nghiệm
//             </h1>

//             {/* Search giống ảnh */}
//             <div className="mx-auto mt-6 max-w-xl">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={18} />
//                 <input
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Tìm kiếm dịch vụ: điện, nước, điều hòa..."
//                   className="w-full rounded-full bg-white/10 px-11 py-3 text-sm text-white placeholder:text-white/70 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Body */}
//       <div className="mx-auto max-w-7xl px-4 py-10">
//         {/* Filter bar */}
//         <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
//               <Filter className="h-4 w-4" />
//               <span>Lọc</span>
//             </div>

//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger className="w-full md:w-72 h-11 rounded-xl border-gray-200 bg-white">
//                 <SelectValue placeholder="Chọn danh mục" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tất cả danh mục</SelectItem>
//                 <SelectItem value="electric">Điện</SelectItem>
//                 <SelectItem value="plumbing">Nước</SelectItem>
//                 <SelectItem value="hvac">Điều hòa</SelectItem>
//                 <SelectItem value="painting">Sơn</SelectItem>
//                 <SelectItem value="electronics">Điện tử</SelectItem>
//                 <SelectItem value="woodwork">Mộc</SelectItem>
//                 <SelectItem value="vehicle">Xe</SelectItem>
//                 <SelectItem value="cleaning">Vệ sinh</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {searchTerm.trim() || selectedCategory !== "all" ? (
//             <Button
//               variant="outline"
//               className="h-11 rounded-xl"
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedCategory("all");
//               }}
//             >
//               Xóa lọc
//             </Button>
//           ) : null}
//         </div>

//         {/* ===== Dịch vụ nổi bật ===== */}
//         <div className="mb-10">
//           <div className="mb-5 flex items-center gap-2">
//             <span className="h-5 w-1 rounded-full bg-yellow-400" />
//             <h2 className="text-lg font-bold text-gray-900">Dịch Vụ Nổi Bật</h2>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {featuredServices.map((service) => {
//               const img = categoryImages[service.category] ?? fallbackImg;
//               const firstDetail = detailedServicesByCategory[service.category]?.[0];

//               return (
//                 <Card
//                   key={service.id}
//                   className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
//                 >
//                   {/* ✅ image (SafeImage) */}
//                   <div className="relative h-44 w-full bg-slate-100">
//                     <SafeImage src={img} alt={service.name} className="h-full w-full object-cover" />
//                     <div className="absolute right-3 top-3">
//                       <Badge className="bg-yellow-400 text-black hover:bg-yellow-400">Nổi bật</Badge>
//                     </div>
//                   </div>

//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-base font-bold text-gray-900">{service.name}</CardTitle>
//                     <CardDescription className="text-sm text-gray-600 line-clamp-2">
//                       {service.description}
//                     </CardDescription>
//                   </CardHeader>

//                   <CardContent className="pt-0">
//                     <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                       <span className="inline-flex items-center gap-1">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         <b className="text-gray-900">{service.avgRating.toFixed(1)}</b>
//                         <span>({toReviews(service.avgRating, service.technicianCount)} đánh giá)</span>
//                       </span>
//                       <span className="inline-flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         <span>1–3 giờ</span>
//                       </span>
//                     </div>

//                     <div className="mt-3">
//                       <p className="text-xs text-gray-500">Từ</p>
//                       <p className="text-sm font-bold text-blue-600">{service.priceRange}</p>
//                     </div>
//                   </CardContent>

//                   <CardFooter className="flex items-center justify-end gap-2">
//                     <Button
//                       className="h-9 rounded-lg bg-blue-600 hover:bg-blue-700 px-5"
//                       onClick={() => navigate(`/technicians?service=${service.category}`)}
//                     >
//                       Tìm Thợ
//                     </Button>

//                     {firstDetail && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="h-9 rounded-lg px-4"
//                         onClick={() => navigate(`/services/${service.category}/${firstDetail.id}`)}
//                       >
//                         Xem dịch vụ chi tiết
//                       </Button>
//                     )}
//                   </CardFooter>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>

//         {/* ===== Dịch vụ khác ===== */}
//         <div className="mb-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-5">Dịch Vụ Khác</h2>

//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {otherServices.map((service) => {
//               const img = categoryImages[service.category] ?? fallbackImg;
//               const firstDetail = detailedServicesByCategory[service.category]?.[0];

//               return (
//                 <Card
//                   key={service.id}
//                   className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
//                 >
//                   <div className="relative h-44 w-full bg-slate-100">
//                     <SafeImage src={img} alt={service.name} className="h-full w-full object-cover" />
//                   </div>

//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-base font-bold text-gray-900">{service.name}</CardTitle>
//                     <CardDescription className="text-sm text-gray-600 line-clamp-2">
//                       {service.description}
//                     </CardDescription>
//                   </CardHeader>

//                   <CardContent className="pt-0">
//                     <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                       <span className="inline-flex items-center gap-1">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         <b className="text-gray-900">{service.avgRating.toFixed(1)}</b>
//                         <span>({toReviews(service.avgRating, service.technicianCount)} đánh giá)</span>
//                       </span>
//                       <span className="inline-flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         <span>1–3 giờ</span>
//                       </span>
//                     </div>

//                     <div className="mt-3">
//                       <p className="text-xs text-gray-500">Từ</p>
//                       <p className="text-sm font-bold text-blue-600">{service.priceRange}</p>
//                     </div>
//                   </CardContent>

//                   <CardFooter className="flex items-center justify-end gap-2">
//                     <Button
//                       className="h-9 rounded-lg bg-blue-600 hover:bg-blue-700 px-5"
//                       onClick={() => navigate(`/technicians?service=${service.category}`)}
//                     >
//                       Tìm Thợ
//                     </Button>

//                     {firstDetail && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="h-9 rounded-lg px-4"
//                         onClick={() => navigate(`/services/${service.category}/${firstDetail.id}`)}
//                       >
//                         Xem dịch vụ chi tiết
//                       </Button>
//                     )}
//                   </CardFooter>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>

//         {filteredServices.length === 0 && (
//           <div className="text-center py-20">
//             <div className="text-6xl mb-4">🔍</div>
//             <p className="text-gray-700 text-lg font-semibold">Không tìm thấy dịch vụ phù hợp</p>
//             <p className="text-gray-500 mt-1">Thử từ khóa khác hoặc bỏ lọc danh mục.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/components/user/UserServices.tsx
// src/components/user/UserServices.tsx
// src/components/user/UserServices.tsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Search, Star, Filter, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { detailedServicesByCategory, type ServiceCategoryId } from "./serviceData";
import { getCategories, type CategoryDto } from "../../api/categories";

const HERO_BG = "https://images.unsplash.com/photo-1513612027093-46da490bbd5b?auto=format&fit=crop&w=2000&q=80";

// ✅ đổi sang Record<string,string> để index bằng string không lỗi TS
const categoryImages: Record<string, string> = {
  electric: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1600&q=80",
  plumbing: "https://images.unsplash.com/photo-1600566753151-384129cf4e3a?auto=format&fit=crop&w=1600&q=80",
  hvac: "https://images.unsplash.com/photo-1647022528152-52ed9338611d?auto=format&fit=crop&w=1600&q=80",
  painting: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=80",
  electronics: "https://images.unsplash.com/photo-1562568068-7a90cf9e499d?auto=format&fit=crop&w=1600&q=80",
  woodwork: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80",
  vehicle: "https://images.unsplash.com/photo-1515923256482-1c04580f7b4a?auto=format&fit=crop&w=1600&q=80",
  cleaning: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1600&q=80",
};

const fallbackImg = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80";

const toReviews = (rating: number, technicians: number) => Math.max(30, Math.round(rating * technicians));

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;

        if (!img.dataset.f1) {
          img.dataset.f1 = "1";
          setImgSrc(fallbackImg);
          return;
        }
        setImgSrc(`https://placehold.co/1200x600/png?text=${encodeURIComponent(alt)}`);
      }}
    />
  );
}

function SafeHero({ src }: { src: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => setImgSrc(src), [src]);

  return (
    <div className="absolute inset-0">
      <img
        src={imgSrc}
        alt="hero"
        className="h-full w-full object-cover"
        loading="eager"
        referrerPolicy="no-referrer"
        onError={() => setImgSrc(fallbackImg)}
      />
    </div>
  );
}

/**
 * mapping CategoryDto -> service key nội bộ (electric/hvac/...)
 * Nếu không match thì dùng cat-<id>
 */
function mapCategoryToKey(c: CategoryDto): string {
  const name = (c.name || "").toLowerCase();

  if (name.includes("điện lạnh") || name.includes("máy lạnh") || name.includes("tủ lạnh") || name.includes("máy giặt"))
    return "hvac";
  if (name.includes("điện tử") || name.includes("ti vi") || name.includes("máy tính")) return "electronics";
  if (name.includes("điện nước") || name.includes("ống nước") || name.includes("nước")) return "plumbing";
  if (name.includes("điện dân dụng") || (name.includes("điện") && !name.includes("điện tử"))) return "electric";

  return `cat-${c.categoryId}`;
}

/** type guard */
function isServiceCategoryKey(x: string): x is ServiceCategoryId {
  return x in detailedServicesByCategory;
}

// demo UI (vì API chưa có rating/price)
function demoAvgRating(c: CategoryDto) {
  const seed = (c.categoryId * 97) % 10;
  return Math.min(4.9, 4.4 + seed / 20);
}
function demoTechCount(c: CategoryDto) {
  const seed = (c.categoryId * 53) % 120;
  return 10 + seed;
}
function demoPriceRange(c: CategoryDto) {
  const seed = (c.categoryId * 71) % 200;
  const min = 50_000 + seed * 1_000;
  const max = min + 300_000 + (seed % 7) * 100_000;
  return `${min.toLocaleString("vi-VN")} - ${max.toLocaleString("vi-VN")}đ`;
}

export function UserServices() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  // ✅ đổi ý nghĩa: selectedCategory giờ là "categoryId" (root hoặc child) hoặc "all"
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getCategories(true); // activeOnly=true

        const sorted = [...data].sort((a, b) => {
          const ao = a.displayOrder ?? 9999;
          const bo = b.displayOrder ?? 9999;
          if (ao !== bo) return ao - bo;
          return a.categoryId - b.categoryId;
        });

        if (mounted) setCategories(sorted);
      } catch (e: any) {
        if (mounted) setErrorMsg(e?.message || "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // root để đổ vào dropdown
  const rootCategories = useMemo(() => categories.filter((c) => c.parentId == null), [categories]);

  // helper map id -> category
  const categoryById = useMemo(() => {
    const m = new Map<number, CategoryDto>();
    categories.forEach((c) => m.set(c.categoryId, c));
    return m;
  }, [categories]);

  /**
   * ✅ RENDER TẤT CẢ CATEGORIES:
   * - Nếu "all": show tất cả
   * - Nếu chọn 1 rootId: show root + toàn bộ children của nó
   * - Nếu chọn 1 childId: show riêng child đó
   * + searchTerm filter theo name/description
   */
  const filteredAllCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const selectedId = selectedCategory === "all" ? null : Number(selectedCategory);

    let list = [...categories];

    if (selectedId != null && !Number.isNaN(selectedId)) {
      const selected = categoryById.get(selectedId);
      if (selected) {
        if (selected.parentId == null) {
          // chọn root -> lấy root + children
          list = categories.filter((c) => c.categoryId === selectedId || c.parentId === selectedId);
        } else {
          // chọn child -> chỉ child (bạn muốn root+child thì đổi filter ở đây)
          list = categories.filter((c) => c.categoryId === selectedId);
        }
      }
    }

    if (q) {
      list = list.filter((c) => {
        const name = (c.name ?? "").toLowerCase();
        const desc = (c.description ?? "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }

    return list;
  }, [categories, categoryById, selectedCategory, searchTerm]);

  // featured top 3
  const featured = useMemo(() => {
    return [...filteredAllCategories].sort((a, b) => demoAvgRating(b) - demoAvgRating(a)).slice(0, 3);
  }, [filteredAllCategories]);

  const others = useMemo(() => {
    const ids = new Set(featured.map((x) => x.categoryId));
    return filteredAllCategories.filter((x) => !ids.has(x.categoryId));
  }, [filteredAllCategories, featured]);

  const clearFilter = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <SafeHero src={HERO_BG} />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-900/20 to-blue-900/35" />

        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-16 text-center">
            <p className="text-sm md:text-base font-semibold text-blue-100">Dịch Vụ Sửa Chữa Chuyên Nghiệp</p>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
              Nhanh chóng, chất lượng cao với đội ngũ kỹ thuật viên giàu kinh nghiệm
            </h1>

            <div className="mx-auto mt-6 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm dịch vụ: điện, nước, điều hòa..."
                  className="w-full rounded-full bg-white/10 px-11 py-3 text-sm text-white placeholder:text-white/70 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Filter bar */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Lọc</span>
            </div>

            {/* ✅ dropdown: root categories (lọc theo nhóm) */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-72 h-11 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {rootCategories.map((c) => (
                  <SelectItem key={c.categoryId} value={String(c.categoryId)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {searchTerm.trim() || selectedCategory !== "all" ? (
            <Button variant="outline" className="h-11 rounded-xl" onClick={clearFilter}>
              Xóa lọc
            </Button>
          ) : null}
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-700">
            Đang tải danh mục...
          </div>
        ) : errorMsg ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{errorMsg}</div>
        ) : (
          <>
            {/* ===== Featured ===== */}
            <div className="mb-10">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-yellow-400" />
                <h2 className="text-lg font-bold text-gray-900">Dịch Vụ Nổi Bật</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((cat) => {
                  const categoryKey = mapCategoryToKey(cat);

                  const img =
                    cat.iconUrl ||
                    (isServiceCategoryKey(categoryKey) ? categoryImages[categoryKey] : undefined) ||
                    fallbackImg;

                  const rating = demoAvgRating(cat);
                  const techCount = demoTechCount(cat);
                  const reviews = toReviews(rating, techCount);
                  const priceRange = demoPriceRange(cat);

                  const firstDetail = isServiceCategoryKey(categoryKey)
                    ? detailedServicesByCategory[categoryKey]?.[0]
                    : undefined;

                  return (
                    <Card
                      key={cat.categoryId}
                      className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                      <div className="relative h-44 w-full bg-slate-100">
                        <SafeImage src={img} alt={cat.name} className="h-full w-full object-cover" />
                        <div className="absolute right-3 top-3">
                          <Badge className="bg-yellow-400 text-black hover:bg-yellow-400">Nổi bật</Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-gray-900">{cat.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {cat.description || "Dịch vụ sửa chữa chuyên nghiệp"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <b className="text-gray-900">{rating.toFixed(1)}</b>
                            <span>({reviews} đánh giá)</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>1–3 giờ</span>
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500">Từ</p>
                          <p className="text-sm font-bold text-blue-600">{priceRange}</p>
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-end gap-2">
                        <Button
                          className="h-9 rounded-lg bg-blue-600 hover:bg-blue-700 px-5"
                          onClick={() => navigate(`/technicians?service=${categoryKey}`)}
                        >
                          Tìm Thợ
                        </Button>

                        {firstDetail && (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 rounded-lg px-4"
                            onClick={() => navigate(`/services/${categoryKey}/${firstDetail.id}`)}
                          >
                            Xem dịch vụ chi tiết
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* ===== Others ===== */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Dịch Vụ Khác</h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {others.map((cat) => {
                  const categoryKey = mapCategoryToKey(cat);

                  const img =
                    cat.iconUrl ||
                    (isServiceCategoryKey(categoryKey) ? categoryImages[categoryKey] : undefined) ||
                    fallbackImg;

                  const rating = demoAvgRating(cat);
                  const techCount = demoTechCount(cat);
                  const reviews = toReviews(rating, techCount);
                  const priceRange = demoPriceRange(cat);

                  const firstDetail = isServiceCategoryKey(categoryKey)
                    ? detailedServicesByCategory[categoryKey]?.[0]
                    : undefined;

                  return (
                    <Card
                      key={cat.categoryId}
                      className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                      <div className="relative h-44 w-full bg-slate-100">
                        <SafeImage src={img} alt={cat.name} className="h-full w-full object-cover" />
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-gray-900">{cat.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {cat.description || "Dịch vụ sửa chữa chuyên nghiệp"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <b className="text-gray-900">{rating.toFixed(1)}</b>
                            <span>({reviews} đánh giá)</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>1–3 giờ</span>
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500">Từ</p>
                          <p className="text-sm font-bold text-blue-600">{priceRange}</p>
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-end gap-2">
                        <Button
                          className="h-9 rounded-lg bg-blue-600 hover:bg-blue-700 px-5"
                          onClick={() => navigate(`/technicians?service=${categoryKey}`)}
                        >
                          Tìm Thợ
                        </Button>

                        {firstDetail && (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 rounded-lg px-4"
                            onClick={() => navigate(`/services/${categoryKey}/${firstDetail.id}`)}
                          >
                            Xem dịch vụ chi tiết
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Empty */}
            {filteredAllCategories.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-700 text-lg font-semibold">Không tìm thấy dịch vụ phù hợp</p>
                <p className="text-gray-500 mt-1">Thử từ khóa khác hoặc bỏ lọc danh mục.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
