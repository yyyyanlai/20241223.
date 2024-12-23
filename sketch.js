// 添加背景圖片變數
let backgroundImg;

// 角色的精靈圖設定
let characterData = {
  character1: {  // 左邊角色
    actions: {
      idle: {
        spritesheet: null,
        frameWidth: 75,
        frameHeight: 91,
        frameCount: 13,
        row: 0
      },
      attack: {
        spritesheet: null,
        frameWidth: 64,
        frameHeight: 84,
        frameCount: 7,
        row: 0
      },
      jump: {
        spritesheet: null,
        frameWidth: 55,
        frameHeight: 85,
        frameCount: 12,
        row: 0
      }
    },
    currentAction: 'idle',
    frameIndex: 0,
    x: 200,
    y: 200,
    scale: 2,
    speed: 5,
    direction: 1,
    velocityY: 0,
    isJumping: false,
    jumpPower: -15,
    gravity: 0.8
  },
  character2: {  // 右邊角色
    actions: {
      idle: {
        spritesheet: null,
        frameWidth: 61,
        frameHeight: 69,
        frameCount: 6,
        row: 0
      },
      attack: {
        spritesheet: null,
        frameWidth: 76,
        frameHeight: 97,
        frameCount: 9,
        row: 0
      },
      jump: {
        spritesheet: null,
        frameWidth: 60,
        frameHeight: 68,
        frameCount: 4,
        row: 0
      }
    },
    currentAction: 'idle',
    frameIndex: 0,
    x: 600,
    y: 200,
    scale: 2,
    speed: 5,
    direction: 1,
    velocityY: 0,
    isJumping: false,
    jumpPower: -15,
    gravity: 0.8
  }
};

function preload() {
  // 載入背景圖片
  backgroundImg = loadImage('background.png');  // 請確保您有一個背景圖片檔案

  // 載入左邊角色的精靈圖
  characterData.character1.actions.idle.spritesheet = loadImage('char1_idle.png');
  characterData.character1.actions.attack.spritesheet = loadImage('char1_attack.png');
  characterData.character1.actions.jump.spritesheet = loadImage('char1_jump.png');
  
  // 載入右邊角色的精靈圖
  characterData.character2.actions.idle.spritesheet = loadImage('char2_idle.png');
  characterData.character2.actions.attack.spritesheet = loadImage('char2_attack.png');
  characterData.character2.actions.jump.spritesheet = loadImage('char2_jump.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
}

function draw() {
  // 繪製背景圖片（替換原本的 background(220)）
  push();
  imageMode(CORNER);
  // 將背景圖片縮放至視窗大小
  image(backgroundImg, 0, 0, width, height);
  pop();
  
  // 顯示操作說明
  textSize(16);
  fill(0);
  text("左邊角色: A,D移動, W跳躍, S攻擊", 20, 30);
  text("右邊角色: ←,→移動, ↑跳躍, ↓攻擊", 20, 50);
  
  // 處理移動輸入
  handleMovement();
  
  // 繪製兩個角色
  drawCharacter('character1');
  drawCharacter('character2');
}

function handleMovement() {
  // 左邊角色移動 (A,D鍵)
  if (keyIsDown(65)) { // A
    characterData.character1.x -= characterData.character1.speed;
    characterData.character1.direction = -1;
  }
  if (keyIsDown(68)) { // Dwdadwwaaaaaadw
    characterData.character1.x += characterData.character1.speed;
    characterData.character1.direction = 1;
  }
  
  // 右邊角色移動 (左右方向鍵)
  if (keyIsDown(LEFT_ARROW)) {
    characterData.character2.x -= characterData.character2.speed;
    characterData.character2.direction = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    characterData.character2.x += characterData.character2.speed;
    characterData.character2.direction = 1;
  }
  
  // 確保角色不會移出畫面
  for (let charId in characterData) {
    let char = characterData[charId];
    char.x = constrain(
      char.x, 
      0, 
      width - char.actions[char.currentAction].frameWidth * char.scale
    );
  }

  // 處理重力和跳躍
  for (let charId in characterData) {
    let char = characterData[charId];
    
    // 應用重力
    char.velocityY += char.gravity;
    char.y += char.velocityY;
    
    // 檢查地面碰撞
    let groundY = height - char.actions[char.currentAction].frameHeight * char.scale;
    if (char.y > groundY) {
      char.y = groundY;
      char.velocityY = 0;
      char.isJumping = false;
      
      // 如果沒有其他按鍵按下且正在跳躍動作，回到待機狀態
      if (char.currentAction === 'jump') {
        if (charId === 'character1' && !keyIsDown(65) && !keyIsDown(68) && !keyIsDown(83)) {
          updateCharacterAction(charId, 'idle');
        } else if (charId === 'character2' && !keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && !keyIsDown(DOWN_ARROW)) {
          updateCharacterAction(charId, 'idle');
        }
      }
    }
  }
}

function drawCharacter(charId) {
  let char = characterData[charId];
  let action = char.actions[char.currentAction];
  
  push();
  translate(char.x + (char.direction === -1 ? action.frameWidth * char.scale : 0), char.y);
  scale(char.direction * char.scale, char.scale);
  
  let sx = (char.frameIndex % action.frameCount) * action.frameWidth;
  let sy = action.row * action.frameHeight;
  
  image(action.spritesheet, 
        0, 0, 
        action.frameWidth, 
        action.frameHeight,
        sx, sy,
        action.frameWidth,
        action.frameHeight);
  
  pop();
  
  char.frameIndex = (char.frameIndex + 1) % action.frameCount;
}

function keyPressed() {
  // 左邊角色跳躍 (W鍵)
  if (keyCode === 87 && !characterData.character1.isJumping) { // W
    characterData.character1.velocityY = characterData.character1.jumpPower;
    characterData.character1.isJumping = true;
    updateCharacterAction('character1', 'jump');
  }
  // 左邊角色攻擊
  else if (keyCode === 83) { // S
    updateCharacterAction('character1', 'attack');
  }
  
  // 右邊角色跳躍 (上方向鍵)
  if (keyCode === UP_ARROW && !characterData.character2.isJumping) {
    characterData.character2.velocityY = characterData.character2.jumpPower;
    characterData.character2.isJumping = true;
    updateCharacterAction('character2', 'jump');
  }
  // 右邊角色攻擊
  else if (keyCode === DOWN_ARROW) {
    updateCharacterAction('character2', 'attack');
  }
}

function keyReleased() {
  // 左邊角色回到待機
  if (!keyIsDown(65) && !keyIsDown(68) && !keyIsDown(87) && !keyIsDown(83) && !characterData.character1.isJumping) {
    updateCharacterAction('character1', 'idle');
  }
  
  // 右邊角色回到待機
  if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && 
      !keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW) && !characterData.character2.isJumping) {
    updateCharacterAction('character2', 'idle');
  }
}

function updateCharacterAction(charId, newAction) {
  let char = characterData[charId];
  if (char.currentAction !== newAction) {
    char.currentAction = newAction;
    char.frameIndex = 0;
  }
}
