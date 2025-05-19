document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const dogBtn = document.getElementById('dog-btn');
    const catBtn = document.getElementById('cat-btn');
    const weightInput = document.getElementById('weight');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result');
    const foodResult = document.getElementById('food-result').querySelector('span');
    const waterResult = document.getElementById('water-result').querySelector('span');
    
    // 初始宠物类型（默认为狗）
    let petType = 'dog';
    
    // 点击宠物类型按钮时切换状态
    dogBtn.addEventListener('click', function() {
        petType = 'dog';
        dogBtn.classList.add('active');
        catBtn.classList.remove('active');
    });
    
    catBtn.addEventListener('click', function() {
        petType = 'cat';
        catBtn.classList.add('active');
        dogBtn.classList.remove('active');
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
    }
}); 