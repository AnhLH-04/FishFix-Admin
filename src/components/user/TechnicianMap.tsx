import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';

// Technician locations in Ho Chi Minh City
const technicianLocations = [
  { id: 1, name: 'Nguyễn Văn A', lat: 10.7769, lng: 106.7009, specialty: 'Điện lạnh' },
  { id: 2, name: 'Trần Văn B', lat: 10.8231, lng: 106.6297, specialty: 'Sửa máy giặt' },
  { id: 3, name: 'Lê Thị C', lat: 10.7626, lng: 106.6822, specialty: 'Điện nước' },
  { id: 4, name: 'Phạm Văn D', lat: 10.8142, lng: 106.6438, specialty: 'Thợ điện' },
  { id: 5, name: 'Hoàng Văn E', lat: 10.7891, lng: 106.7053, specialty: 'Điều hòa' },
  { id: 6, name: 'Vũ Thị F', lat: 10.7543, lng: 106.6621, specialty: 'Sửa tủ lạnh' },
  { id: 7, name: 'Đặng Văn G', lat: 10.8456, lng: 106.6234, specialty: 'Máy giặt' },
  { id: 8, name: 'Ngô Văn H', lat: 10.7234, lng: 106.6945, specialty: 'Điện dân dụng' },
  { id: 9, name: 'Bùi Thị I', lat: 10.7998, lng: 106.6789, specialty: 'Thợ hàn' },
  { id: 10, name: 'Dương Văn K', lat: 10.7678, lng: 106.6423, specialty: 'Điện lạnh' },
  { id: 11, name: 'Trương Văn L', lat: 10.8334, lng: 106.6567, specialty: 'Sửa máy bơm' },
  { id: 12, name: 'Phan Thị M', lat: 10.7445, lng: 106.7123, specialty: 'Thợ nước' },
  { id: 13, name: 'Võ Văn N', lat: 10.8123, lng: 106.6890, specialty: 'Điện công nghiệp' },
  { id: 14, name: 'Lý Văn O', lat: 10.7889, lng: 106.6334, specialty: 'Điều hòa' },
  { id: 15, name: 'Hồ Thị P', lat: 10.7567, lng: 106.7234, specialty: 'Sửa bếp gas' },
  { id: 16, name: 'Mai Văn Q', lat: 10.8234, lng: 106.7045, specialty: 'Điện lạnh' },
  { id: 17, name: 'Chu Văn R', lat: 10.7345, lng: 106.6556, specialty: 'Thợ hàn' },
  { id: 18, name: 'Tô Thị S', lat: 10.8012, lng: 106.6678, specialty: 'Sửa máy giặt' },
  { id: 19, name: 'Đinh Văn T', lat: 10.7712, lng: 106.6912, specialty: 'Điện nước' },
  { id: 20, name: 'Lưu Văn U', lat: 10.8445, lng: 106.6445, specialty: 'Thợ điện' },
  { id: 21, name: 'Cao Thị V', lat: 10.7623, lng: 106.7089, specialty: 'Điều hòa' },
  { id: 22, name: 'Hà Văn W', lat: 10.7934, lng: 106.6523, specialty: 'Sửa tủ lạnh' },
  { id: 23, name: 'Huỳnh Văn X', lat: 10.8267, lng: 106.6789, specialty: 'Máy giặt' },
  { id: 24, name: 'Từ Thị Y', lat: 10.7456, lng: 106.6834, specialty: 'Điện dân dụng' },
  { id: 25, name: 'Ông Văn Z', lat: 10.8089, lng: 106.7234, specialty: 'Thợ hàn' },
  { id: 26, name: 'Đỗ Văn AA', lat: 10.7789, lng: 106.6267, specialty: 'Điện lạnh' },
  { id: 27, name: 'La Thị BB', lat: 10.8356, lng: 106.6678, specialty: 'Sửa máy bơm' },
  { id: 28, name: 'Tạ Văn CC', lat: 10.7512, lng: 106.7045, specialty: 'Thợ nước' },
  { id: 29, name: 'Tôn Văn DD', lat: 10.8134, lng: 106.6456, specialty: 'Điện công nghiệp' },
  { id: 30, name: 'Lâm Thị EE', lat: 10.7867, lng: 106.6889, specialty: 'Điều hòa' },
  { id: 31, name: 'Ninh Văn FF', lat: 10.7634, lng: 106.7178, specialty: 'Sửa bếp gas' },
  { id: 32, name: 'Khương Văn GG', lat: 10.8245, lng: 106.6345, specialty: 'Điện lạnh' },
  { id: 33, name: 'Tăng Thị HH', lat: 10.7378, lng: 106.6723, specialty: 'Thợ hàn' },
  { id: 34, name: 'Quan Văn II', lat: 10.8045, lng: 106.7089, specialty: 'Sửa máy giặt' },
  { id: 35, name: 'Kiều Văn JJ', lat: 10.7723, lng: 106.6545, specialty: 'Điện nước' },
  { id: 36, name: 'Triệu Thị KK', lat: 10.8378, lng: 106.6912, specialty: 'Thợ điện' },
  { id: 37, name: 'Nghiêm Văn LL', lat: 10.7589, lng: 106.7234, specialty: 'Điều hòa' },
  { id: 38, name: 'Quách Văn MM', lat: 10.7912, lng: 106.6389, specialty: 'Sửa tủ lạnh' },
  { id: 39, name: 'Ung Thị NN', lat: 10.8289, lng: 106.6723, specialty: 'Máy giặt' },
  { id: 40, name: 'Viên Văn OO', lat: 10.7467, lng: 106.6978, specialty: 'Điện dân dụng' },
  { id: 41, name: 'Sơn Văn PP', lat: 10.8156, lng: 106.7156, specialty: 'Thợ hàn' },
  { id: 42, name: 'Thái Thị QQ', lat: 10.7801, lng: 106.6234, specialty: 'Điện lạnh' },
  { id: 43, name: 'Ứng Văn RR', lat: 10.8412, lng: 106.6589, specialty: 'Sửa máy bơm' },
  { id: 44, name: 'Vưu Văn SS', lat: 10.7523, lng: 106.7089, specialty: 'Thợ nước' },
  { id: 45, name: 'Xa Thị TT', lat: 10.8078, lng: 106.6467, specialty: 'Điện công nghiệp' },
  { id: 46, name: 'Gia Văn UU', lat: 10.7845, lng: 106.6812, specialty: 'Điều hòa' },
  { id: 47, name: 'Âu Văn VV', lat: 10.7656, lng: 106.7267, specialty: 'Sửa bếp gas' },
  { id: 48, name: 'Ất Thị WW', lat: 10.8267, lng: 106.6234, specialty: 'Điện lạnh' },
  { id: 49, name: 'Bảo Văn XX', lat: 10.7389, lng: 106.6645, specialty: 'Thợ hàn' },
  { id: 50, name: 'Châu Văn YY', lat: 10.8023, lng: 106.7023, specialty: 'Sửa máy giặt' }
];

// Custom icon with Lucide React icon
const createCustomIcon = () => {
  const iconHtml = renderToString(
    <div style={{
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      position: 'relative'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 0 0-16 0"/>
        <path d="M12 13v4"/>
        <path d="M10 17h4"/>
      </svg>
      <div style={{
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '14px',
        height: '14px',
        background: '#10b981',
        borderRadius: '50%',
        border: '2px solid white'
      }}/>
    </div>
  );

  return new DivIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

export function TechnicianMap() {
  const customIcon = createCustomIcon();

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl" style={{ zIndex: 1 }}>
      <MapContainer
        center={[10.7769, 106.6909]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={true}
        style={{ zIndex: 1 }}
      >
        {/* Use CartoDB Voyager for a beautiful, modern map style */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {technicianLocations.map((tech) => (
          <Marker
            key={tech.id}
            position={[tech.lat, tech.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm text-gray-900 mb-1">{tech.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Đang sẵn sàng</span>
                </div>
                <p className="text-xs text-blue-600 font-medium">{tech.specialty}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Zoom Instructions */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-200" style={{ zIndex: 401 }}>
        <p className="text-xs font-semibold text-gray-900 mb-1">💡 Hướng dẫn</p>
        <p className="text-xs text-gray-600">Zoom để xem thợ gần bạn</p>
      </div>
    </div>
  );
}
