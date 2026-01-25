/**
 * Script tự động sửa đường dẫn asset trong các file HTML
 * Thay đổi đường dẫn tuyệt đối /limbus-storylogs/assets/ thành đường dẫn tương đối ../assets/
 * 
 * Cách sử dụng:
 *   node fix-asset-paths.js [file_path]
 *   - Nếu không có tham số, sẽ sửa file chapters/chapter9.html
 *   - Nếu có tham số, sẽ sửa file được chỉ định
 */

const fs = require('fs');
const path = require('path');

// Lấy đường dẫn file từ tham số dòng lệnh hoặc dùng mặc định
const targetFile = process.argv[2] || path.join(__dirname, 'chapters', 'chapter9.html');
const filePath = path.isAbsolute(targetFile) ? targetFile : path.join(__dirname, targetFile);

// Kiểm tra file có tồn tại không
if (!fs.existsSync(filePath)) {
  console.error(`Lỗi: Không tìm thấy file ${filePath}`);
  process.exit(1);
}

console.log(`Đang xử lý file: ${filePath}`);

// Đọc file
let content = fs.readFileSync(filePath, 'utf8');

// Đếm số lần xuất hiện trước khi sửa
const beforeCount = (content.match(/\/limbus-storylogs\/assets\//g) || []).length;
console.log(`Tìm thấy ${beforeCount} đường dẫn cần sửa`);

if (beforeCount === 0) {
  console.log('Không có đường dẫn nào cần sửa!');
  process.exit(0);
}

// Thay thế tất cả đường dẫn tuyệt đối thành đường dẫn tương đối
// Sửa trong src="..." hoặc src='...'
content = content.replace(/src=["']\/limbus-storylogs\/assets\//g, (match) => {
  const quote = match.includes('"') ? '"' : "'";
  return `src=${quote}../assets/`;
});

// Sửa trong url(...) - có thể có hoặc không có dấu ngoặc kép
content = content.replace(/url\(["']?\/limbus-storylogs\/assets\//g, (match) => {
  // Giữ nguyên dấu ngoặc kép hoặc dấu nháy đơn nếu có
  const quote = match.includes('"') ? '"' : (match.includes("'") ? "'" : '');
  return `url(${quote}../assets/`;
});

// Đếm số lần xuất hiện sau khi sửa
const afterCount = (content.match(/\/limbus-storylogs\/assets\//g) || []).length;
const fixedCount = beforeCount - afterCount;

console.log(`Đã sửa ${fixedCount} đường dẫn`);

// Ghi lại file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã lưu file thành công!');

// Hiển thị thống kê
if (afterCount > 0) {
  console.log(`⚠️  Cảnh báo: Vẫn còn ${afterCount} đường dẫn chưa được sửa`);
} else {
  console.log('✅ Tất cả đường dẫn đã được sửa thành công!');
}
