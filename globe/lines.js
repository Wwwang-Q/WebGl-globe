/**
 * Created by wangqi on 2018/4/9.
 */
// .side
// 定义表面两侧的哪一个将呈现 - 前面，后面或双面。
var groupDots=new THREE.Group();
var groupLines=new THREE.Group();

//曲线
var animateDots=[];
groupDots.children.forEach(elem=>{
  var line=addLines(groupDots.children[0].position,elem.position);
  animateDots.push(line.curve.getPoints(100));
  groupLines.add(line.lineMesh);
});

scene.add(groupDots);
scene.add(groupLines);

//添加动画
console.log(animateDots);
var aGroup=new THREE.Group();
for(let i=0;i<animateDots.length;i++){
  let aGeo=new THREE.SphereGeometry(10,10,10);
  let aMaterial=new THREE.MeshPhongMaterial({color:'yellow'});
  let aMesh=new THREE.Mesh(aGeo,aMaterial);
  aGroup.add(aMesh);
}

var vIndex=0;
function animateLine() {
  aGroup.children.forEach((elem,index)=>{
    let x=animateDots[index][vIndex];
    elem.position.set(x,y,z);
  })
  vIndex++;
  if(vIndex>=100){
    vIndex=0;
  }
  requestAnimationFrame(animateLine);
}

scene.add(aGroup);
animateLine();



function addLines(v0,v3)  {
  //夹角
  var angle=v0.angleTo(v3)*180/Math.PI/10;

  var aLen=angle*40;       //加上600的球半径
  var hLen=angle*angle*120;
  var p0=new THREE.Vector3(0,0,0);
  console.log(aLen,hLen);

//法线向量
  var rayLine=new THREE.Ray(p0,getVcenter(v0.clone(),v3.clone())); //原点到 两点中点的距离
  var atlen=rayLine.at(1).distanceTo(v2);  //v1,v2的中点到原点的距离

//顶点坐标
  var vTop=rayLine.at(hLen/rayLine.at(1).distanceTo(p0));

//两个控制点坐标
  var v1=getLenVcenter(v0.clone(),vTop,aLen);
  var v2=getLenVcenter(v3.clone(),vTop,aLen);

  /*--------生成贝塞尔曲线------------*/
  var curve = new THREE.CubicBezierCurve3(v0,v1,v2,v3);
  var geometry = new THREE.Geometry();
  geometry.vertices = curve.getPoints( 50 );  //点越多,线条越光滑

  var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final Object3d to add to the scene
  return {
    curve:curve,
    lineMesh:new THREE.Line( geometry, material )
  };
}


function getVcenter(v1,v2) {    //求中点
  let v=v1.add(v2);
  return v.divideScalar(2);
}
//计算v1,v2向量固定长度的点
function getLenVcenter(v1,v2,len) {
  let v1v2Len=v1.distanceTo(v2);
  return v1.lerp(v2,len/v1v2Len);
}



