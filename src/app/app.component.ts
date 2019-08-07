import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('rendererContainer', { static: false }) rendererContainer: ElementRef;
  title = 'cinderella';
  scenes: THREE.Scene[] = [];
  view1Canvas = null;
  renderer: THREE.WebGLRenderer;

  labelContainerElem = document.querySelector('#labels');


  constructor() {

  }

  initView1() {
    const content = document.getElementById('content');
    console.log('content:', content)
    const view1Scene = new THREE.Scene();
    
    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    
    
    view1Scene.add(mesh);
    view1Scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));
    
    
    const view1Element = document.createElement('div');
    view1Element.className = 'viewTape';
    view1Element.innerHTML = "<div class='Tape'></div>";
    content.appendChild(view1Element);
    
    const width = view1Element.querySelector(".Tape").clientWidth;
    const height = view1Element.querySelector(".Tape").clientHeight;
    console.log('height:', height)
    const view1Camera = new THREE.PerspectiveCamera(75, 100 / 15, 1, 10000);
    view1Camera.position.z = 400;
    
    const controls = new OrbitControls(view1Camera, view1Element.querySelector(".Tape"));
    controls.target.set(0, 0, 0);
    controls.update();
    
    view1Scene.userData = {
      camera: view1Camera,
      element: view1Element.querySelector(".Tape"),
      controls: controls,
      clearColor: 0x202020
    };
    this.scenes.push(view1Scene);
  }


  initSplitLeft() {
    const content = document.getElementById('content');
    
    const leftScene = new THREE.Scene();
    
    const geometry = new THREE.CylinderGeometry(100, 100, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    
    
    leftScene.add(mesh);
    leftScene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));
    
    const leftElement = document.createElement('div');
    leftElement.className = 'splitView';
    leftElement.innerHTML = "<div class='split'></div>";
    content.appendChild(leftElement);
    
    const leftCamera = new THREE.PerspectiveCamera(70, 49/85, 1, 1000 );
    leftCamera.position.z = 50;
    
    const controls = new OrbitControls(leftCamera, leftElement.querySelector(".split"));
    controls.target.set(0, 0, 0);
    controls.update();

    leftScene.userData = {
      camera: leftCamera,
      element: leftElement.querySelector(".split"),
      controls: controls,
      clearColor: 0x808080
    };
    this.scenes.push(leftScene);
  }

  initSplitRight() {

  }

  ngAfterViewInit() {
    this.view1Canvas as HTMLCanvasElement;
    this.view1Canvas = document.getElementById('c');
    console.log('this.view1Canvas id :', this.view1Canvas);
    // this.view1Canvas = this.view1Canvas.getContext("2d");
    this.renderer = new THREE.WebGLRenderer({canvas:this.view1Canvas});

    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.initView1();
    this.initSplitLeft();
    // this.view1Canvas.appendChild(this.renderer.domElement);
    this.labelContainerElem = document.querySelector('#labels');
    console.log('this.labelContainerElem:', this.labelContainerElem)
    // this.labelContainerElem.appendChild(this.elem);
    this.animate();
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());
    this.render();

  }

  render() {
    this.renderer.setScissorTest(false);

    this.renderer.clear();
    this.renderer.setScissorTest(true);

    this.scenes.forEach((scene) => {
      let element = scene.userData.element;

      let rect = element.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
        rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {
        console.log('out of bounds');

      }
      // set the viewport
      var width = rect.right - rect.left;
      var height = rect.bottom - rect.top;
      var left = rect.left;
      var bottom = this.renderer.domElement.clientHeight - rect.bottom;
      this.renderer.setViewport(left, bottom, width, height+50);
      // console.log('height:', height + 50)
      // console.log('width:', width)
      // console.log('bottom:', bottom)
      // console.log('left:', left)
      this.renderer.setScissor(left, bottom, width, height+50);
      var camera = scene.userData.camera;
      this.renderer.setClearColor(scene.userData.clearColor);
      //  console.log('camera:', camera)
      //camera.aspect = width / height; // not changing in this example
      //camera.updateProjectionMatrix();
      //scene.userData.controls.update();
      this.renderer.render(scene, camera);

    })

  }

  updateSize() {
    var width = this.view1Canvas.clientWidth;
    var height = this.view1Canvas.clientHeight;
    if ( this.view1Canvas.width !== width || this.view1Canvas.height !== height ) {
      this.renderer.setSize( width, height, false );
    }
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.renderer.setSize(event.target.innerWidth, event.target.innerHeight)
  }
}
