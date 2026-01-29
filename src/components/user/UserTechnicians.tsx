// import { useState } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Badge } from '../ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { Search, MapPin, Star, Briefcase, Phone, MessageSquare } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// export function UserTechnicians() {
//   const [searchParams] = useSearchParams();
//   const serviceFilter = searchParams.get('service') || '';
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedService, setSelectedService] = useState(serviceFilter);
//   const [sortBy, setSortBy] = useState('rating');

//   const technicians = [
//     {
//       id: 1,
//       name: 'Nguyễn Văn An',
//       avatar: '',
//       specialties: ['electric', 'hvac'],
//       rating: 4.9,
//       reviewCount: 234,
//       jobsCompleted: 456,
//       location: 'Quận 1, TP.HCM',
//       hourlyRate: 150000,
//       description: 'Có 10 năm kinh nghiệm sửa chữa điện và điều hòa. Tận tâm, chuyên nghiệp.',
//       verified: true,
//       available: true
//     },
//     {
//       id: 2,
//       name: 'Trần Văn Bình',
//       avatar: '',
//       specialties: ['plumbing'],
//       rating: 4.8,
//       reviewCount: 189,
//       jobsCompleted: 312,
//       location: 'Quận 3, TP.HCM',
//       hourlyRate: 120000,
//       description: 'Chuyên sửa chữa hệ thống nước, thông cống, bồn cầu. Phục vụ 24/7.',
//       verified: true,
//       available: true
//     },
//     {
//       id: 3,
//       name: 'Lê Minh Công',
//       avatar: '',
//       specialties: ['electronics', 'electric'],
//       rating: 4.9,
//       reviewCount: 345,
//       jobsCompleted: 678,
//       location: 'Quận Bình Thạnh, TP.HCM',
//       hourlyRate: 180000,
//       description: 'Sửa chữa điện tử, điện thoại, máy tính. Bảo hành dài hạn.',
//       verified: true,
//       available: false
//     },
//     {
//       id: 4,
//       name: 'Phạm Văn Dũng',
//       avatar: '',
//       specialties: ['painting'],
//       rating: 4.7,
//       reviewCount: 156,
//       jobsCompleted: 289,
//       location: 'Quận 7, TP.HCM',
//       hourlyRate: 100000,
//       description: 'Thợ sơn chuyên nghiệp, thi công nhanh, giá cả hợp lý.',
//       verified: true,
//       available: true
//     },
//     {
//       id: 5,
//       name: 'Hoàng Văn Em',
//       avatar: '',
//       specialties: ['woodwork'],
//       rating: 4.8,
//       reviewCount: 198,
//       jobsCompleted: 345,
//       location: 'Quận Tân Bình, TP.HCM',
//       hourlyRate: 160000,
//       description: 'Thợ mộc lành nghề, đóng tủ, sửa cửa, làm đồ gỗ theo yêu cầu.',
//       verified: true,
//       available: true
//     },
//     {
//       id: 6,
//       name: 'Võ Văn Phúc',
//       avatar: '',
//       specialties: ['vehicle'],
//       rating: 4.6,
//       reviewCount: 223,
//       jobsCompleted: 567,
//       location: 'Quận 10, TP.HCM',
//       hourlyRate: 80000,
//       description: 'Sửa xe máy, xe đạp điện. Đến tận nơi khi cần.',
//       verified: true,
//       available: true
//     }
//   ];

//   const serviceCategories = {
//     electric: 'Điện',
//     plumbing: 'Nước',
//     hvac: 'Điều hòa',
//     painting: 'Sơn',
//     electronics: 'Điện tử',
//     woodwork: 'Mộc',
//     vehicle: 'Xe',
//     cleaning: 'Vệ sinh'
//   };

//   const filteredTechnicians = technicians
//     .filter(tech => {
//       const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            tech.description.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesService = !selectedService || tech.specialties.includes(selectedService);
//       return matchesSearch && matchesService;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'rating') return b.rating - a.rating;
//       if (sortBy === 'jobs') return b.jobsCompleted - a.jobsCompleted;
//       if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
//       if (sortBy === 'price-high') return b.hourlyRate - a.hourlyRate;
//       return 0;
//     });

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-4">Thợ Sửa Chuyên Nghiệp</h1>
//         <p className="text-gray-600 text-lg">Tìm kiếm và liên hệ với thợ phù hợp nhất</p>
//       </div>

//       {/* Search and Filters */}
//       <div className="mb-8 space-y-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <Input
//               type="text"
//               placeholder="Tìm kiếm thợ..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Select value={selectedService} onValueChange={setSelectedService}>
//             <SelectTrigger className="w-full md:w-64">
//               <SelectValue placeholder="Chọn dịch vụ" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">Tất cả dịch vụ</SelectItem>
//               {Object.entries(serviceCategories).map(([key, value]) => (
//                 <SelectItem key={key} value={key}>{value}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-full md:w-64">
//               <SelectValue placeholder="Sắp xếp theo" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
//               <SelectItem value="jobs">Nhiều công việc nhất</SelectItem>
//               <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
//               <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Technicians Grid */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTechnicians.map((tech) => (
//           <Card key={tech.id} className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <div className="flex items-start gap-4">
//                 <Avatar className="h-16 w-16">
//                   <AvatarImage src={tech.avatar} />
//                   <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <CardTitle className="flex items-center gap-2">
//                     {tech.name}
//                     {tech.verified && (
//                       <Badge variant="secondary" className="text-xs">✓ Xác minh</Badge>
//                     )}
//                   </CardTitle>
//                   <div className="flex items-center gap-1 mt-1">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span className="font-semibold">{tech.rating}</span>
//                     <span className="text-sm text-gray-500">({tech.reviewCount} đánh giá)</span>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <CardDescription className="min-h-[48px]">{tech.description}</CardDescription>

//               <div className="flex flex-wrap gap-1">
//                 {tech.specialties.map((specialty) => (
//                   <Badge key={specialty} variant="outline">
//                     {serviceCategories[specialty as keyof typeof serviceCategories]}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="space-y-2 text-sm">
//                 <div className="flex items-center gap-2">
//                   <MapPin className="h-4 w-4 text-gray-500" />
//                   <span>{tech.location}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Briefcase className="h-4 w-4 text-gray-500" />
//                   <span>{tech.jobsCompleted} công việc hoàn thành</span>
//                 </div>
//                 <div className="flex items-center gap-2 font-semibold text-blue-600">
//                   <span>{tech.hourlyRate.toLocaleString()}đ/giờ</span>
//                 </div>
//               </div>

//               {tech.available ? (
//                 <Badge className="bg-green-500">Đang rảnh</Badge>
//               ) : (
//                 <Badge variant="secondary">Đang bận</Badge>
//               )}
//             </CardContent>
//             <CardFooter className="flex gap-2">
//               <Link to={`/booking?technicianId=${tech.id}`} className="flex-1">
//                 <Button className="w-full" disabled={!tech.available}>
//                   Đặt Lịch
//                 </Button>
//               </Link>
//               <Button variant="outline" size="icon">
//                 <MessageSquare className="h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       {filteredTechnicians.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">Không tìm thấy thợ phù hợp</p>
//         </div>
//       )}
//     </div>
//   );
// }
// import { useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getTechniciansForService, labelService, technicians, type Technician } from "./technicianData";

// function useQuery() {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// }

// export function UserTechnicians() {
//   const navigate = useNavigate();
//   const query = useQuery();

//   const serviceFromQuery = query.get("service") ?? "all";
//   const fromCategory = query.get("fromCategory") ?? "";
//   const fromDetailId = query.get("fromDetailId") ?? "";

//   const [keyword, setKeyword] = useState("");
//   const [service, setService] = useState(serviceFromQuery);
//   const [onlyAvailable, setOnlyAvailable] = useState(false);

//   const list = useMemo(() => {
//     let base: Technician[] = getTechniciansForService(service);

//     if (onlyAvailable) base = base.filter((t) => t.available);

//     const k = keyword.trim().toLowerCase();
//     if (k) {
//       base = base.filter((t) => {
//         const inName = t.name.toLowerCase().includes(k);
//         const inId = t.id.toLowerCase().includes(k);
//         const inPhone = (t.phone ?? "").toLowerCase().includes(k);
//         const inServices = t.services.some((s) => s.toLowerCase().includes(k));
//         return inName || inId || inPhone || inServices;
//       });
//     }

//     base = [...base].sort((a, b) => {
//       if (a.available !== b.available) return a.available ? -1 : 1;
//       if (b.rating !== a.rating) return b.rating - a.rating;
//       return a.distanceKm - b.distanceKm;
//     });

//     return base;
//   }, [keyword, service, onlyAvailable]);

//   const hasActiveFilter = service !== "all" || onlyAvailable || keyword.trim().length > 0;

//   const resetFilters = () => {
//     setKeyword("");
//     setService("all");
//     setOnlyAvailable(false);
//     navigate(`/technicians`);
//   };

//   const applyServiceToUrl = (nextService: string) => {
//     setService(nextService);
//     const params = new URLSearchParams();
//     if (nextService && nextService !== "all") params.set("service", nextService);

//     // giữ lại thông tin quay về detail nếu có
//     if (fromCategory) params.set("fromCategory", fromCategory);
//     if (fromDetailId) params.set("fromDetailId", fromDetailId);

//     const qs = params.toString();
//     navigate(qs ? `/technicians?${qs}` : `/technicians`);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-6xl px-4 py-6">
//         <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold text-slate-900">Tìm thợ phù hợp</h1>
//             <p className="text-sm text-slate-600">Tìm theo tên / mã / số điện thoại, hoặc lọc theo dịch vụ.</p>

//             {fromCategory && fromDetailId && (
//               <button
//                 className="mt-2 text-xs text-slate-600 hover:text-slate-900 underline"
//                 onClick={() => navigate(`/services/${fromCategory}/${fromDetailId}`)}
//               >
//                 ← Quay lại dịch vụ đang xem
//               </button>
//             )}
//           </div>

//           <div className="flex gap-2">
//             {hasActiveFilter && (
//               <button
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
//                 onClick={resetFilters}
//               >
//                 Xóa lọc
//               </button>
//             )}
//             <button
//               className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
//               onClick={() => navigate("/booking")}
//             >
//               Đặt lịch
//             </button>
//           </div>
//         </div>

//         <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
//           <div>
//             <label className="mb-1 block text-xs font-medium text-slate-600">Từ khóa</label>
//             <input
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//               placeholder="VD: An, T001, 090..."
//               className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-xs font-medium text-slate-600">Dịch vụ</label>
//             <select
//               value={service}
//               onChange={(e) => applyServiceToUrl(e.target.value)}
//               className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//             >
//               <option value="all">Tất cả</option>
//               <option value="general">Sửa chữa chung</option>
//               <option value="electrical">Điện</option>
//               <option value="plumbing">Nước</option>
//               <option value="ac">Máy lạnh</option>
//               <option value="appliance">Thiết bị gia dụng</option>
//               <option value="washing">Máy giặt</option>
//             </select>
//           </div>

//           <div>
//             <label className="mb-1 block text-xs font-medium text-slate-600">Trạng thái</label>
//             <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
//               <input
//                 id="onlyAvailable"
//                 type="checkbox"
//                 checked={onlyAvailable}
//                 onChange={(e) => setOnlyAvailable(e.target.checked)}
//               />
//               <label htmlFor="onlyAvailable" className="text-sm text-slate-700">
//                 Chỉ thợ đang rảnh
//               </label>
//             </div>
//           </div>

//           {hasActiveFilter && (
//             <div className="md:col-span-3 flex flex-wrap gap-2">
//               {keyword.trim() && (
//                 <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
//                   Từ khóa: <b>{keyword.trim()}</b>
//                 </span>
//               )}
//               {service !== "all" && (
//                 <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
//                   Dịch vụ: <b>{labelService(service)}</b>
//                 </span>
//               )}
//               {onlyAvailable && (
//                 <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
//                   Trạng thái: <b>Đang rảnh</b>
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="mt-5">
//           <div className="mb-2 flex items-center justify-between">
//             <p className="text-sm text-slate-600">
//               Tìm thấy <b>{list.length}</b> thợ
//               {service !== "all" ? (
//                 <>
//                   {" "}
//                   cho <b>{labelService(service)}</b>
//                 </>
//               ) : null}
//               .
//             </p>
//             <p className="text-xs text-slate-500">Tổng dữ liệu demo: {technicians.length}</p>
//           </div>

//           {list.length === 0 ? (
//             <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
//               Không có thợ phù hợp. Thử đổi từ khóa hoặc bỏ lọc.
//             </div>
//           ) : (
//             <div className="grid gap-3 md:grid-cols-2">
//               {list.map((t) => (
//                 <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <h3 className="text-lg font-semibold text-slate-900">{t.name}</h3>
//                         <span
//                           className={`rounded-full px-2 py-0.5 text-xs ${
//                             t.available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
//                           }`}
//                         >
//                           {t.available ? "Đang rảnh" : "Bận"}
//                         </span>
//                       </div>
//                       <p className="text-xs text-slate-500">
//                         Mã: <b>{t.id}</b>
//                         {t.phone ? (
//                           <>
//                             {" "}
//                             • SĐT: <b>{t.phone}</b>
//                           </>
//                         ) : null}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p className="text-sm text-slate-900">
//                         ⭐ <b>{t.rating.toFixed(1)}</b>
//                       </p>
//                       <p className="text-xs text-slate-500">
//                         {t.jobsDone} jobs • {t.distanceKm.toFixed(1)} km
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mt-3 flex flex-wrap gap-2">
//                     {t.services.map((s) => (
//                       <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
//                         {labelService(s)}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="mt-4 flex gap-2">
//                     <button
//                       className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
//                       onClick={() => navigate(`/booking?technicianId=${t.id}&service=${service}`)}
//                     >
//                       Chọn thợ
//                     </button>
//                     <button
//                       className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
//                       onClick={() => alert(`Gọi ${t.phone ?? "N/A"}`)}
//                     >
//                       Liên hệ
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="mt-10 text-xs text-slate-500">
//           *Hiện đang dùng dữ liệu demo. Có backend thì mình đổi sang API fetch.
//         </div>
//       </div>
//     </div>
//   );
// }
// import { useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getTechniciansForService, labelService, technicians, type Technician } from "./technicianData";
// import { Search, Filter, Star, Phone, MapPin, Briefcase, ChevronDown } from "lucide-react";

// function useQuery() {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// }

// export function UserTechnicians() {
//   const navigate = useNavigate();
//   const query = useQuery();

//   // query param từ trang detail/service
//   const serviceFromQuery = query.get("service") ?? "all";
//   const fromCategory = query.get("fromCategory") ?? "";
//   const fromDetailId = query.get("fromDetailId") ?? "";

//   const [keyword, setKeyword] = useState("");
//   const [service, setService] = useState(serviceFromQuery); // giờ service là electric/plumbing/hvac/...
//   const [onlyAvailable, setOnlyAvailable] = useState(false);

//   const list = useMemo(() => {
//     let base: Technician[] = getTechniciansForService(service);

//     if (onlyAvailable) base = base.filter((t) => t.available);

//     const k = keyword.trim().toLowerCase();
//     if (k) {
//       base = base.filter((t) => {
//         const inName = t.name.toLowerCase().includes(k);
//         const inId = t.id.toLowerCase().includes(k);
//         const inPhone = (t.phone ?? "").toLowerCase().includes(k);

//         // ✅ match cả key service và label tiếng Việt (vd gõ "điện" vẫn ra)
//         const inServices = t.services.some((s) => {
//           const key = String(s).toLowerCase();
//           const label = labelService(key).toLowerCase();
//           return key.includes(k) || label.includes(k);
//         });

//         return inName || inId || inPhone || inServices;
//       });
//     }

//     // sort: available -> rating -> distance
//     base = [...base].sort((a, b) => {
//       if (a.available !== b.available) return a.available ? -1 : 1;
//       if (b.rating !== a.rating) return b.rating - a.rating;
//       return a.distanceKm - b.distanceKm;
//     });

//     return base;
//   }, [keyword, service, onlyAvailable]);

//   const hasActiveFilter = service !== "all" || onlyAvailable || keyword.trim().length > 0;

//   const resetFilters = () => {
//     setKeyword("");
//     setService("all");
//     setOnlyAvailable(false);
//     navigate(`/technicians`);
//   };

//   const applyServiceToUrl = (nextService: string) => {
//     setService(nextService);
//     const params = new URLSearchParams();
//     if (nextService && nextService !== "all") params.set("service", nextService);

//     // giữ info quay lại detail
//     if (fromCategory) params.set("fromCategory", fromCategory);
//     if (fromDetailId) params.set("fromDetailId", fromDetailId);

//     const qs = params.toString();
//     navigate(qs ? `/technicians?${qs}` : `/technicians`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* HERO giống UserServices */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-5xl font-bold mb-4">Tìm Thợ Sửa Chữa</h1>
//           <p className="text-xl text-blue-100">Tìm theo tên / mã / số điện thoại, hoặc lọc theo dịch vụ.</p>

//           {fromCategory && fromDetailId && (
//             <button
//               className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
//               onClick={() => navigate(`/services/${fromCategory}/${fromDetailId}`)}
//             >
//               ← Quay lại dịch vụ đang xem
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="container mx-auto px-4 -mt-8">
//         {/* Search & Filter (giống Services) */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Keyword */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm thợ... (VD: An, T001, 090...)"
//                 value={keyword}
//                 onChange={(e) => setKeyword(e.target.value)}
//                 className="w-full pl-12 h-12 text-lg border-2 rounded-xl focus:outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* Service Select */}
//             <div className="relative w-full md:w-72">
//               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <select
//                 value={service}
//                 onChange={(e) => applyServiceToUrl(e.target.value)}
//                 className="w-full h-12 pl-12 pr-10 text-lg border-2 rounded-xl bg-white appearance-none focus:outline-none focus:border-blue-500"
//               >
//                 <option value="all">Tất cả danh mục</option>
//                 <option value="electric">Điện</option>
//                 <option value="plumbing">Nước</option>
//                 <option value="hvac">Điều hòa</option>
//                 <option value="painting">Sơn</option>
//                 <option value="electronics">Điện tử</option>
//                 <option value="woodwork">Mộc</option>
//                 <option value="vehicle">Xe</option>
//                 <option value="cleaning">Vệ sinh</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             </div>

//             {/* Availability */}
//             <label className="flex items-center gap-3 rounded-xl border-2 bg-white px-4 h-12 text-lg text-gray-700">
//               <input
//                 type="checkbox"
//                 checked={onlyAvailable}
//                 onChange={(e) => setOnlyAvailable(e.target.checked)}
//                 className="h-4 w-4"
//               />
//               Chỉ thợ đang rảnh
//             </label>

//             {/* Buttons */}
//             <div className="flex gap-3 md:justify-end">
//               {hasActiveFilter && (
//                 <button
//                   className="h-12 rounded-xl border-2 bg-white px-5 text-lg font-semibold text-gray-700 hover:bg-gray-50"
//                   onClick={resetFilters}
//                 >
//                   Xóa lọc
//                 </button>
//               )}
//               <button
//                 className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-lg font-semibold text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
//                 onClick={() => navigate("/booking")}
//               >
//                 Đặt lịch
//               </button>
//             </div>
//           </div>

//           {/* chips */}
//           {hasActiveFilter && (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {keyword.trim() && (
//                 <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
//                   Từ khóa: <b>{keyword.trim()}</b>
//                 </span>
//               )}
//               {service !== "all" && (
//                 <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
//                   Dịch vụ: <b>{labelService(service)}</b>
//                 </span>
//               )}
//               {onlyAvailable && (
//                 <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
//                   Trạng thái: <b>Đang rảnh</b>
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Summary row */}
//         <div className="flex items-center justify-between mb-4">
//           <p className="text-gray-600 text-lg">
//             Tìm thấy <b>{list.length}</b> thợ
//             {service !== "all" ? (
//               <>
//                 {" "}
//                 cho <b>{labelService(service)}</b>
//               </>
//             ) : null}
//             .
//           </p>
//           <p className="text-sm text-gray-500">Tổng dữ liệu demo: {technicians.length}</p>
//         </div>

//         {/* Empty state */}
//         {list.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-700">
//             <div className="text-6xl mb-4">🔍</div>
//             <p className="text-xl font-medium">Không có thợ phù hợp</p>
//             <p className="text-gray-500 mt-2">Thử đổi từ khóa hoặc bỏ lọc.</p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
//             {list.map((t) => (
//               <div
//                 key={t.id}
//                 className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 p-6"
//               >
//                 {/* Header */}
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                           t.available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
//                         }`}
//                       >
//                         {t.available ? "Đang rảnh" : "Bận"}
//                       </span>
//                     </div>

//                     <p className="mt-1 text-sm text-gray-500">
//                       Mã: <b>{t.id}</b>
//                       {t.phone ? (
//                         <>
//                           {" "}
//                           • SĐT: <b>{t.phone}</b>
//                         </>
//                       ) : null}
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <div className="inline-flex items-center gap-1">
//                       <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//                       <span className="font-bold text-gray-900">{t.rating.toFixed(1)}</span>
//                     </div>
//                     <div className="mt-1 text-sm text-gray-500">
//                       {t.jobsDone} jobs • {t.distanceKm.toFixed(1)} km
//                     </div>
//                   </div>
//                 </div>

//                 {/* tags */}
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {t.services.map((s) => (
//                     <span
//                       key={String(s)}
//                       className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700"
//                     >
//                       {labelService(String(s))}
//                     </span>
//                   ))}
//                 </div>

//                 {/* rows giống Services */}
//                 <div className="mt-4 space-y-3">
//                   <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
//                     <span className="text-gray-600 font-medium inline-flex items-center gap-2">
//                       <Briefcase className="h-4 w-4 text-gray-400" />
//                       Số job
//                     </span>
//                     <span className="font-bold text-gray-900">{t.jobsDone}</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
//                     <span className="text-gray-600 font-medium inline-flex items-center gap-2">
//                       <MapPin className="h-4 w-4 text-gray-400" />
//                       Khoảng cách
//                     </span>
//                     <span className="font-bold text-gray-900">{t.distanceKm.toFixed(1)} km</span>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <button
//                   className="mt-5 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md rounded-xl py-3 text-lg font-semibold text-white"
//                   onClick={() => navigate(`/booking?technicianId=${t.id}&service=${service}`)}
//                 >
//                   Chọn thợ
//                 </button>

//                 <button
//                   className="mt-3 w-full rounded-xl border-2 bg-white py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
//                   onClick={() => alert(`Gọi ${t.phone ?? "N/A"}`)}
//                 >
//                   <Phone className="h-5 w-5 text-gray-500" />
//                   Liên hệ
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTechniciansForService, labelService, technicians, type Technician } from "./technicianData";
import { Star, Phone, MapPin, ChevronDown, BadgeCheck, MessageCircle, Clock3, Users } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Ảnh hero theo dịch vụ
const HERO_BY_SERVICE: Record<string, string> = {
  hvac: "https://images.unsplash.com/photo-1581579186898-c9d0a0b2dfee?auto=format&fit=crop&w=1600&q=80",
  electric: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1600&q=80",
  plumbing: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80",
  electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  vehicle: "https://images.unsplash.com/photo-1517524206127-48bbd363f3f7?auto=format&fit=crop&w=1600&q=80",
  cleaning: "https://images.unsplash.com/photo-1581578021420-3d7d1a7b1b0f?auto=format&fit=crop&w=1600&q=80",
  painting: "https://images.unsplash.com/photo-1523413452388-6eaa0b05a6b3?auto=format&fit=crop&w=1600&q=80",
  woodwork: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80",
  all: "https://images.unsplash.com/photo-1513612027093-46da490bbd5b?auto=format&fit=crop&w=1600&q=80",
};

const DEFAULT_HERO = HERO_BY_SERVICE.all;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function estimateYears(t: Technician) {
  return clamp(Math.round(t.jobsDone / 40), 1, 12);
}
function estimatePriceRange(t: Technician) {
  const base = 120_000 + t.distanceKm * 20_000;
  const min = Math.round(base / 10_000) * 10_000;
  const max = Math.round((min + 250_000 + (t.rating - 4.4) * 300_000) / 10_000) * 10_000;
  return `${min.toLocaleString("vi-VN")}đ - ${max.toLocaleString("vi-VN")}đ`;
}

/** Hero an toàn: bắt được onError */
function SafeHero({ src }: { src: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative overflow-hidden">
      <img
        src={imgSrc}
        alt="hero"
        className="h-[220px] md:h-[280px] w-full object-cover"
        loading="eager"
        referrerPolicy="no-referrer"
        onError={() => setImgSrc(DEFAULT_HERO)}
      />
      {/* overlay trung tính (đỡ xanh) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/55 to-slate-900/65" />
    </div>
  );
}

export function UserTechnicians() {
  const navigate = useNavigate();
  const query = useQuery();

  const serviceFromQuery = query.get("service") ?? "all";
  const fromCategory = query.get("fromCategory") ?? "";
  const fromDetailId = query.get("fromDetailId") ?? "";

  const [service, setService] = useState(serviceFromQuery);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const list = useMemo(() => {
    let base: Technician[] = getTechniciansForService(service);
    if (onlyAvailable) base = base.filter((t) => t.available);

    base = [...base].sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.distanceKm - b.distanceKm;
    });

    return base;
  }, [service, onlyAvailable]);

  const hasActiveFilter = service !== "all" || onlyAvailable;

  const resetFilters = () => {
    setService("all");
    setOnlyAvailable(false);
    navigate(`/technicians`);
  };

  const applyServiceToUrl = (nextService: string) => {
    setService(nextService);
    const params = new URLSearchParams();
    if (nextService && nextService !== "all") params.set("service", nextService);
    if (fromCategory) params.set("fromCategory", fromCategory);
    if (fromDetailId) params.set("fromDetailId", fromDetailId);
    const qs = params.toString();
    navigate(qs ? `/technicians?${qs}` : `/technicians`);
  };

  const heroBg = HERO_BY_SERVICE[service] ?? DEFAULT_HERO;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <div className="relative">
        <SafeHero src={heroBg} />

        <div className="absolute inset-0">
          <div className="mx-auto max-w-6xl px-4 pt-6">
            <button
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition"
              onClick={() =>
                fromCategory && fromDetailId ? navigate(`/services/${fromCategory}/${fromDetailId}`) : navigate(-1)
              }
            >
              ← Quay lại danh sách
            </button>

            <div className="mt-10 md:mt-12 text-center text-white">
              <p className="text-sm text-white/80">
                Danh sách thợ • {service !== "all" ? labelService(service) : "Tất cả dịch vụ"}
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">Tìm thợ phù hợp</h1>
              <p className="mt-2 text-white/85 text-sm md:text-base">
                Lọc theo dịch vụ và trạng thái để chọn người phù hợp nhất.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR (gọn đúng 2 filter, cùng hàng) */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-12 rounded-2xl bg-white/95 backdrop-blur shadow-lg border border-slate-100 p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* group 2 filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-1">
              {/* select (ngắn lại) */}
              <div className="relative w-full md:w-[240px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">☰</span>
                <select
                  value={service}
                  onChange={(e) => applyServiceToUrl(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="electric">Sửa điện</option>
                  <option value="plumbing">Sửa nước</option>
                  <option value="hvac">Điều hòa</option>
                  <option value="painting">Sơn</option>
                  <option value="electronics">Điện tử</option>
                  <option value="woodwork">Mộc</option>
                  <option value="vehicle">Sửa xe</option>
                  <option value="cleaning">Vệ sinh</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>

              {/* checkbox (ngắn lại, nằm cạnh) */}
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 md:w-[220px] whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="h-4 w-4"
                />
                Chỉ thợ đang rảnh
              </label>
            </div>

            {/* actions */}
            <div className="flex gap-2 md:ml-auto">
              {hasActiveFilter && (
                <button
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={resetFilters}
                >
                  Xóa lọc
                </button>
              )}
              <button
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:opacity-95 shadow-sm"
                onClick={() => navigate("/booking")}
              >
                Đặt lịch
              </button>
            </div>
          </div>

          {/* chips */}
          {hasActiveFilter && (
            <div className="mt-3 flex flex-wrap gap-2">
              {service !== "all" && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  Dịch vụ: <b>{labelService(service)}</b>
                </span>
              )}
              {onlyAvailable && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  Trạng thái: <b>Đang rảnh</b>
                </span>
              )}
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Tìm thấy <b>{list.length}</b> thợ phù hợp
          </p>
          <p className="text-xs text-slate-500">Tổng dữ liệu demo: {technicians.length}</p>
        </div>

        {/* LIST */}
        {list.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-slate-700 text-center">
            Không có thợ phù hợp. Thử đổi bộ lọc.
          </div>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-2 pb-12">
            {list.map((t) => {
              const years = estimateYears(t);
              const priceRange = estimatePriceRange(t);
              const reviews = Math.round(t.jobsDone * 0.75);
              const locationText = `TP.HCM • ${t.distanceKm.toFixed(1)} km`;

              return (
                <div
                  key={t.id}
                  className="relative rounded-2xl bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)] border border-slate-100 p-6"
                >
                  {/* tick góc dưới trái */}
                  <div className="absolute left-5 bottom-5">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex gap-5">
                    {/* avatar */}
                    <div className="shrink-0">
                      <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 ring-4 ring-white shadow-sm">
                        <img
                          src={
                            t.avatarUrl ?? `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(t.name)}`
                          }
                          alt={t.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;

                            // fallback 1
                            if (!img.dataset.f1) {
                              img.dataset.f1 = "1";
                              img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.id)}`;
                              return;
                            }

                            // fallback 2 (cực chắc)
                            img.src = `https://placehold.co/160x160/png?text=${encodeURIComponent(
                              t.name.split(" ").slice(-1)[0] ?? "User",
                            )}`;
                          }}
                        />
                      </div>
                    </div>

                    {/* info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-xl font-extrabold text-slate-900 truncate">{t.name}</h3>

                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                t.available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                              {t.available ? "Sẵn sàng" : "Bận"}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-700">
                            <span className="inline-flex items-center gap-2">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold">{t.rating.toFixed(1)}</span>
                              <span className="text-slate-500">({reviews})</span>
                            </span>

                            <span className="inline-flex items-center gap-2 text-slate-600">
                              <Users className="h-4 w-4 text-slate-400" />
                              <span className="font-semibold">{t.jobsDone}</span>
                            </span>
                          </div>

                          <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <div className="inline-flex items-center gap-2">
                              <Clock3 className="h-4 w-4 text-blue-600" />
                              <span>{years} năm</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span>{locationText}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span className="inline-flex items-center justify-center rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                            🏅
                          </span>
                        </div>
                      </div>

                      {/* tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {t.services.slice(0, 3).map((s) => (
                          <span key={String(s)} className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700">
                            {labelService(String(s))}
                          </span>
                        ))}
                      </div>

                      {/* price */}
                      <div className="mt-5 text-lg font-extrabold text-blue-600">{priceRange}</div>

                      {/* buttons */}
                      <div className="mt-5">
                        <button
                          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-extrabold text-white hover:bg-blue-700 shadow-sm"
                          onClick={() => navigate(`/technicians/${t.id}?service=${service}`)}
                        >
                          Xem hồ sơ
                        </button>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <button
                            className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center justify-center gap-2"
                            onClick={() => alert(`Gọi ${t.phone ?? "N/A"}`)}
                          >
                            <Phone className="h-4 w-4 text-slate-500" />
                            Gọi
                          </button>

                          <button
                            className="rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200 inline-flex items-center justify-center gap-2"
                            onClick={() => alert(`Nhắn tin cho ${t.name}`)}
                          >
                            <MessageCircle className="h-4 w-4 text-slate-500" />
                            Nhắn tin
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
