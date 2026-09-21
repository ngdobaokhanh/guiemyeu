# THE LAST PAGE — Premium Edition

Website tĩnh cinematic, không cần Node.js, npm hoặc build.

## Cá nhân hóa

- Sửa tên, lời kể, voice, timeline và lời cầu hôn trong `data/story.js`.
- Sửa danh sách kỷ niệm trong `data/memories.js`.
- Sửa nhạc, video, địa điểm và bản đồ trong `data/settings.js`.

## Assets

- Ảnh memory: `assets/photos/memories/`
- Ảnh gallery: `assets/photos/gallery/`
- Voice MP3: `assets/audio/voice/`
- Nhạc nền: `assets/audio/music/background.mp3`
- Video: `assets/video/`

Đường dẫn trong các file data phải khớp chính xác cả chữ hoa/chữ thường.

## Upload cPanel

1. Mở File Manager.
2. Vào `public_html`.
3. Upload và giải nén toàn bộ project.
4. Đảm bảo `index.html` nằm trực tiếp trong `public_html`.
5. Mở domain bằng HTTPS.

## Checklist

- Thay toàn bộ sample data.
- Kiểm tra ảnh, voice, nhạc và video.
- Test Chrome/Safari trên điện thoại.
- Test desktop và phím mũi tên.
- Kiểm tra địa điểm, giờ hẹn và link Google Maps.
- Nhạc chỉ bắt đầu sau tương tác người dùng.

Các thư mục asset rỗng có thể tạo thủ công trên cPanel nếu Git không giữ thư mục rỗng.
