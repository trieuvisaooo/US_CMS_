

window.onload = function () {
    $.ajax({
        type: 'GET',
        url: '/business/viewchart/getmember',
        data: {},
        success(data) {
           
            // Dữ liệu mẫu cho số thành viên và tài khoản bị khóa
            var clubData = {
                totalMembers: data.allUser,
                lockedAccounts: data.lockUser
            };

            // Cập nhật dữ liệu vào HTML
            document.getElementById('totalMembers').textContent = clubData.totalMembers;
            document.getElementById('lockedAccounts').textContent = clubData.lockedAccounts;
        }

    })
    $.ajax({
        type: 'GET',
        url: '/business/viewchart/gettaskandpost',
        data: {},
        success(data1) {

            // Tạo dữ liệu cho biểu đồ
            var data = {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                datasets: [{
                    label: 'Số bài viết',
                    type: 'line',
                    borderColor: 'white',
                    borderWidth: 2,
                    fill: false,
                    data: data1.postArray
                }, {
                    label: 'Số task được giao',
                    type: 'bar',
                    backgroundColor: '#008170',
                    data: data1.taskArray,
                    borderColor: 'white',
                    borderWidth: 2
                }]
            };

            // Khởi tạo biểu đồ
            var ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                
                data: data,
                options: {
                   
                    plugins: {
                        title: {
                            display: true,
                            text: 'THỐNG KÊ SỐ TASK VÀ BÀI VIẾT TRONG NĂM',
                            font: {
                                size: 50,
                                
                            },
                            color: "white"
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'white' // Đổi màu đường lưới trục y sang trắng
                            },
                            ticks: {
                                color: 'white' // Đổi màu tick (chỉ số) trục y sang trắng
                            }
                        },
                        x: {
                            grid: {
                                color: 'white' // Đổi màu đường lưới trục x sang trắng
                            },
                            ticks: {
                                color: 'white' // Đổi màu tick (chỉ số) trục x sang trắng
                            }
                        }
            
                    },
                    
                }
            });
        }

    })
}