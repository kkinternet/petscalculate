document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素 - 计算器部分
    const dogBtn = document.getElementById('dog-btn');
    const catBtn = document.getElementById('cat-btn');
    const dogIcon = document.getElementById('dog-icon');
    const catIcon = document.getElementById('cat-icon');
    const weightInput = document.getElementById('weight');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result');
    const foodResult = document.getElementById('food-result').querySelector('span');
    const waterResult = document.getElementById('water-result').querySelector('span');
    
    // 获取DOM元素 - 记录部分
    const recordDateInput = document.getElementById('record-date');
    const actualFoodInput = document.getElementById('actual-food');
    const actualWeightInput = document.getElementById('actual-weight');
    const recordBtn = document.getElementById('record-btn');
    const recordList = document.getElementById('record-list');
    
    // 初始宠物类型（默认为狗）
    let petType = 'dog';
    
    // 设置日期输入框的默认值为今天
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    recordDateInput.value = formattedDate;
    
    // 点击宠物类型按钮时切换状态
    dogBtn.addEventListener('click', function() {
        petType = 'dog';
        dogBtn.classList.add('active');
        catBtn.classList.remove('active');
        dogIcon.classList.add('active');
        catIcon.classList.remove('active');
    });
    
    catBtn.addEventListener('click', function() {
        petType = 'cat';
        catBtn.classList.add('active');
        dogBtn.classList.remove('active');
        catIcon.classList.add('active');
        dogIcon.classList.remove('active');
    });
    
    // 点击图标也可以切换宠物类型
    dogIcon.addEventListener('click', function() {
        petType = 'dog';
        dogBtn.classList.add('active');
        catBtn.classList.remove('active');
        dogIcon.classList.add('active');
        catIcon.classList.remove('active');
    });
    
    catIcon.addEventListener('click', function() {
        petType = 'cat';
        catBtn.classList.add('active');
        dogBtn.classList.remove('active');
        catIcon.classList.add('active');
        dogIcon.classList.remove('active');
    });
    
    // 点击计算按钮时计算结果
    calculateBtn.addEventListener('click', calculateResults);
    
    // 当按下Enter键时也触发计算
    weightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateResults();
        }
    });
    
    // 计算结果的函数
    function calculateResults() {
        const weight = parseFloat(weightInput.value);
        
        // 验证输入
        if (isNaN(weight) || weight <= 0) {
            alert('请输入有效的体重值！');
            return;
        }
        
        let foodMin, foodMax, waterMin, waterMax;
        
        // 根据宠物类型计算食量和饮水量
        if (petType === 'dog') {
            foodMin = weight * 25;
            foodMax = weight * 30;
            waterMin = weight * 50;
            waterMax = weight * 60;
        } else { // cat
            foodMin = weight * 20;
            foodMax = weight * 25;
            waterMin = weight * 40;
            waterMax = weight * 50;
        }
        
        // 格式化结果（保留一位小数）
        foodMin = foodMin.toFixed(1);
        foodMax = foodMax.toFixed(1);
        waterMin = waterMin.toFixed(1);
        waterMax = waterMax.toFixed(1);
        
        // 显示结果
        foodResult.textContent = `${foodMin}～${foodMax}克`;
        waterResult.textContent = `${waterMin}～${waterMax}毫升`;
        
        // 显示结果容器
        resultContainer.style.display = 'block';
        
        // 将计算结果填充到实际喂食量输入框
        actualFoodInput.value = Math.round((parseFloat(foodMin) + parseFloat(foodMax)) / 2);
        actualWeightInput.value = weight;
    }
    
    // 点击记录按钮时保存记录
    recordBtn.addEventListener('click', saveRecord);
    
    // 当按下Enter键时也触发记录
    actualWeightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveRecord();
        }
    });
    
    // 保存记录的函数
    function saveRecord() {
        const date = recordDateInput.value;
        const actualFood = parseFloat(actualFoodInput.value);
        const actualWeight = parseFloat(actualWeightInput.value);
        
        // 验证输入
        if (!date) {
            alert('请选择日期！');
            return;
        }
        
        if (isNaN(actualFood) || actualFood < 0) {
            alert('请输入有效的喂食量！');
            return;
        }
        
        if (isNaN(actualWeight) || actualWeight <= 0) {
            alert('请输入有效的体重！');
            return;
        }
        
        // 创建记录对象
        const record = {
            id: Date.now(), // 使用时间戳作为唯一ID
            date: date,
            petType: petType,
            actualFood: actualFood,
            actualWeight: actualWeight
        };
        
        // 获取现有记录，如果没有则创建空数组
        let records = JSON.parse(localStorage.getItem('petRecords')) || [];
        
        // 添加新记录
        records.push(record);
        
        // 按日期排序
        records.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // 保存到本地存储
        localStorage.setItem('petRecords', JSON.stringify(records));
        
        // 更新显示
        displayRecords();
        updateChart();
        
        // 重置表单
        recordDateInput.value = formattedDate;
        actualFoodInput.value = '';
        actualWeightInput.value = '';
        
        alert('记录已保存！');
    }
    
    // 显示记录的函数
    function displayRecords() {
        // 获取记录
        const records = JSON.parse(localStorage.getItem('petRecords')) || [];
        
        // 清空记录列表
        recordList.innerHTML = '';
        
        // 如果没有记录，显示提示
        if (records.length === 0) {
            recordList.innerHTML = '<p class="no-records">暂无记录</p>';
            return;
        }
        
        // 为每条记录创建元素
        records.forEach(record => {
            const recordItem = document.createElement('div');
            recordItem.className = 'record-item';
            
            // 格式化日期显示
            const dateObj = new Date(record.date);
            const formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
            
            // 设置记录内容
            recordItem.innerHTML = `
                <div>
                    <span class="record-date">${formattedDate}</span>
                    <span class="record-data">(${record.petType === 'dog' ? '狗' : '猫'})</span>
                </div>
                <div>
                    <span class="record-data">喂食: ${record.actualFood}克</span>
                    <span class="record-data">体重: ${record.actualWeight}kg</span>
                    <button class="delete-btn" data-id="${record.id}">删除</button>
                </div>
            `;
            
            recordList.appendChild(recordItem);
        });
        
        // 为所有删除按钮添加事件监听器
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const recordId = parseInt(this.getAttribute('data-id'));
                deleteRecord(recordId);
            });
        });
    }
    
    // 删除记录的函数
    function deleteRecord(recordId) {
        // 获取记录
        let records = JSON.parse(localStorage.getItem('petRecords')) || [];
        
        // 过滤掉要删除的记录
        records = records.filter(record => record.id !== recordId);
        
        // 保存到本地存储
        localStorage.setItem('petRecords', JSON.stringify(records));
        
        // 更新显示
        displayRecords();
        updateChart();
    }
    
    // 更新图表的函数
    function updateChart() {
        // 获取记录
        const records = JSON.parse(localStorage.getItem('petRecords')) || [];
        
        // 如果没有记录，不显示图表
        if (records.length === 0) {
            return;
        }
        
        // 准备图表数据
        const dates = records.map(record => {
            const date = new Date(record.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
        const foodData = records.map(record => record.actualFood);
        const weightData = records.map(record => record.actualWeight);
        
        // 获取图表容器
        const ctx = document.getElementById('historyChart').getContext('2d');
        
        // 如果已经有图表，先销毁
        if (window.myChart) {
            window.myChart.destroy();
        }
        
        // 创建新图表
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: '喂食量 (克)',
                        data: foodData,
                        borderColor: '#0071e3',
                        backgroundColor: 'rgba(0, 113, 227, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: '体重 (kg)',
                        data: weightData,
                        borderColor: '#ff9f0a',
                        backgroundColor: 'rgba(255, 159, 10, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: '喂食量 (克)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '体重 (kg)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                }
            }
        });
    }
    
    // 页面加载时显示记录和图表
    displayRecords();
    updateChart();
}); 