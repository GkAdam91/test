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
    const view1Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    view1Camera.position.z = 1000;
    const controls = new OrbitControls(view1Camera, this.renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);


    view1Scene.add(mesh);
    view1Scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));


    const view1Element = document.createElement('div');
    view1Element.className = 'viewTape';
    view1Element.innerHTML = "<div class='Tape'></div>";

    view1Scene.userData = {
      camera: view1Camera,
      element: view1Element.querySelector(".Tape"),
      controls: controls
    };
    content.appendChild(view1Element);
    this.scenes.push(view1Scene);
  }


  initSplitLeft() {

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
