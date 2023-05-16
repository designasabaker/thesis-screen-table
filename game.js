// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 食材类
class Ingredient {
  constructor(x, y, width, height, srcImg) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isDragging = false;
    this.img = new Image();
    this.img.src = srcImg;
  }
}

// 创建食材对象
const ingredient1 = new Ingredient(100, 100, 50, 50, './images/spice.png');
const ingredient2 = new Ingredient(200, 200, 50, 50, './images/spice.png');
// 添加更多的食材对象...

// 食材对象数组
const ingredientList = [ingredient1, ingredient2];
// 添加更多的食材对象到数组...

// 餐台框对象
const table = {
    x: 300,
    y: 200,
    width: 200,
    height: 200,
    baseColor: '#808080',
    maxRedValue: 255,
    redValue: 0
};

// 监听鼠标事件
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

// 处理鼠标按下事件
function handleMouseDown(event) {
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;

  // 判断鼠标是否在食材上
  ingredientList.forEach(ingredient => {
    if (
      mouseX >= ingredient.x &&
      mouseX <= ingredient.x + ingredient.width &&
      mouseY >= ingredient.y &&
      mouseY <= ingredient.y + ingredient.height
    ) {
      ingredient.isDragging = true;
    }
  });
}

// 处理鼠标移动事件
function handleMouseMove(event) {
  ingredientList.forEach(ingredient => {
    if (ingredient.isDragging) {
      const mouseX = event.clientX - canvas.offsetLeft;
      const mouseY = event.clientY - canvas.offsetTop;

      // 更新食材的位置
      ingredient.x = mouseX - ingredient.width / 2;
      ingredient.y = mouseY - ingredient.height / 2;

      // 判断食材是否在餐台框内
      const isInsideTable = (
        ingredient.x >= table.x &&
        ingredient.x + ingredient.width <= table.x + table.width &&
        ingredient.y >= table.y &&
        ingredient.y + ingredient.height <= table.y + table.height
      );

      // 更新餐台框的红色值
      if (isInsideTable) {
        table.redValue = Math.min(table.redValue + 1, table.maxRedValue);
      } else {
        table.redValue = Math.max(table.redValue - 1, 0);
      }

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制餐台框
    drawTable();

      // 绘制食材
      ingredientList.forEach(ingredient => {
        ctx.drawImage(ingredient.img, ingredient.x, ingredient.y, ingredient.width
            , ingredient.height);
      });
    }});}

        
// 处理鼠标松开事件
function handleMouseUp() {
    ingredientList.forEach(ingredient => {
    ingredient.isDragging = false;
    });
}

// 绘制餐台框
function drawTable() {
    ctx.fillStyle = `rgb(${table.redValue}, 0, 0)`;
    ctx.fillRect(table.x, table.y, table.width, table.height);
}
        
// 渲染初始画面
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制餐台框
    drawTable();
    
    // 绘制食材
    ingredientList.forEach(ingredient => {
    ctx.drawImage(ingredient.img, ingredient.x, ingredient.y, ingredient.width, ingredient.height);
    });
    
    requestAnimationFrame(render);
}
    
// 开始渲染
Promise.all(ingredientList.map(ingredient => new Promise(resolve => {
    ingredient.img.onload = resolve;
    }))).then(() => {
    render();
})