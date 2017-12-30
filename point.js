// global
var ctx;
var scene;
var camera;
var renderer;
var obj =  {};

// 初期化
function init(){
  // キャンバスを画面サイズに合わせる
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var canvas2 = document.getElementById("canvas2");
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;
  
  
  // ミニマップ
  ctx = document.getElementById("canvas").getContext("2d");
  ctx.scale(0.3,0.3);

  // メイン画面
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 100,200);

  renderer = new THREE.WebGLRenderer({canvas:document.getElementById('canvas2')});
  renderer.shadowMapEnabled 

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 200 );
  camera.position.z = 1;

  

  // ループ
  var fps = new FPS(60);
  var loop = function(){
    fps.check();
    enterFrame();
    setTimeout(loop, fps.getInterval());
  };
  loop();
}


var x = 320;
var y = 240;
var vx = 0;
var vy = 0;
var acc = 0;
var curve = 0;

// ループ処理
function enterFrame(){


  // ハンドリング
  var rota = Math.atan2( vx , vy );
  if( onKeys[37] ){
    rota = rota - 0.02;
  }
  if( onKeys[39] ){
    rota = rota + 0.02;
  }

  // 次のXY座標計算
  vy = Math.cos( rota );
  vx = Math.sin( rota );

  x = x + vx * acc;
  y = y + vy * acc * -1 ;

  // 四方の壁にぶつかったらとめる
  if( x < 6 ){
     x=6;
     acc = 0;
  }
  if( x > 634 ){
     x=634;
     acc = 0;
  }
  if( y < 6 ){
     y = 6;
     acc = 0;
  }
  if( y > 474 ){
     y=474;
     acc = 0;
  }

  // ミニマップ描画
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.clearRect(0,0,640*2,480*2);
  ctx.fillRect(0,0,640,480);
  ctx.clearRect(5,5,630,470);
  ctx.fillStyle = "rgb(255, 0, 0)";

  // ミニマップの三角形の座標計算
  var r = Math.sqrt( vx*vx + vy*vy);
  var ux = vx / r * 15;
  var uy = vy / r * 15;

  var tx = x + ux;
  var ty = y - uy;

  var lx = x + uy;
  var ly = y + ux;

  var rx = x - uy;
  var ry = y - ux;

  ctx.beginPath();
  ctx.moveTo( tx,ty);
  ctx.lineTo( lx,ly);
  ctx.lineTo( rx,ry);
  ctx.lineTo( tx,ty);
  ctx.fill();

  // 3D表示
  // カメラの位置を移動
  camera.position.x = px(x);
  camera.position.y = py(y);



  // レンダリング
  renderer.render(scene, camera);
}

// ミニマップ座標から3D座標への変換
function px( ix ){
  return ix - 320;
}
function py( iy ){
  return -1 * (iy - 240 );
}
//$(document).ready(init);