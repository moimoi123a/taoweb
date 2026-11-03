# Việt Nam Travel — Website du lịch

Website giới thiệu du lịch Việt Nam, thiết kế dạng **one-page full-screen**: 11 "trang" nằm trên trang chủ, mỗi lần lướt chuyển đúng một màn (scroll snap).

## Demo

- GitHub Pages: https://moimoi123a.github.io/taoweb/
- Chạy local: mở `index.html` hoặc `python3 -m http.server 8099`

## Nội dung — 11 trang, mỗi trang 8–10 mục

| # | Trang | Nội dung |
|---|-------|----------|
| 01 | Trang chủ | Hero toàn màn hình, số liệu nổi bật, nút xem video |
| 02 | Video | Video YouTube phát trực tiếp (tự động phát, không cần bấm card) |
| 03 | Giới thiệu | 10 số liệu về Việt Nam (tỉnh thành, bờ biển, di sản, dân tộc…) |
| 04 | Miền Bắc | 10 điểm đến: Hạ Long, Sa Pa, Hà Nội, Tràng An… |
| 05 | Miền Trung | 10 điểm đến: Hội An, Huế, Đà Nẵng, Phong Nha… |
| 06 | Miền Nam | 10 điểm đến: Phú Quốc, TP.HCM, Côn Đảo, Cần Thơ… |
| 07 | Ẩm thực | 10 món ăn đặc trưng ba miền |
| 08 | Lễ hội | 10 lễ hội tiêu biểu theo tháng |
| 09 | Kinh nghiệm | 10 mục cẩm nang du lịch |
| 10 | Thư viện | 6 ảnh + 4 video YouTube, lightbox |
| 11 | Liên hệ | 5 thông tin liên hệ + 5 FAQ + form tư vấn |

## Tính năng

- Menu cố định 11 mục, active theo section; menu hamburger toàn màn hình trên mobile
- Scroll snap: mỗi lần lướt chuyển một trang; hỗ trợ phím ↑/↓, PageUp/PageDown
- Thanh tiến trình cuộn, chấm điều hướng bên phải, nút về đầu trang
- Animation: reveal khi vào màn, Ken Burns cho hero, đếm số liệu, hover ảnh
- Modal chi tiết cho từng điểm đến/món ăn; modal video YouTube kèm link dự phòng
- Gallery lightbox, FAQ accordion, form validate demo
- Responsive: desktop, tablet, mobile (390px)
- Ảnh lưu cục bộ trong `assets/images/` — không phụ thuộc hotlink

## Cấu trúc

```
.
├── index.html
└── assets
    ├── css/style.css
    ├── js/main.js
    └── images/          # 40 ảnh điểm đến & món ăn + favicon
```

## Công nghệ

HTML5 · CSS3 (Grid, Flexbox, scroll-snap, animation) · JavaScript thuần (IntersectionObserver, modal, lightbox). Không dùng framework, không cần bước build.

## Nguồn dữ liệu

- Ảnh: Wikimedia Commons (giấy phép tự do, ghi nguồn ở footer)
- Video: YouTube (nhúng qua `youtube-nocookie.com`)
- Font: Google Fonts (Playfair Display, Be Vietnam Pro)

> Đồ án học tập — form liên hệ chỉ là demo, không gửi dữ liệu.
