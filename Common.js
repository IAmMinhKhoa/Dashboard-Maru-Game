 class Common {
    // Hàm chuyển đổi thời gian ISO sang định dạng ngày tháng năm
    static convertISOToDateTime(isoString) {
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const formattedTime = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return `${formattedDate} ${formattedTime}`;
    }

    // Hàm kiểm tra chuỗi có rỗng không
    static isEmptyString(str) {
        return !str || str.trim() === '';
    }

    // Hàm định dạng số với dấu phân cách hàng nghìn
    static formatNumber(num) {
        return num.toLocaleString();
    }

    // Bạn có thể thêm nhiều hàm tiện ích khác tại đây
}
window.Common = Common;