import * as THREE from 'three'
import { DoubleSide, Group, Mesh } from 'three'
import Experience from '../Experience'

import vertex from '../Shaders/Planet/vertex.glsl'
import vertexSun from '../Shaders/Planet/atmosphere/vertex.glsl'
import fragment from '../Shaders/Planet/fragment.glsl'
import fragmentSun from '../Shaders/Planet/atmosphere/fragment.glsl'

import vertexArrow from '../Shaders/Planet/arrow/vertex.glsl'
import fragmentArrow from '../Shaders/Planet/arrow/fragment.glsl'

import vertexShader from '../Shaders/Intro/vertex.glsl'
import fragmentShader from '../Shaders/Intro/fragment.glsl'

import gsap from 'gsap'
import Sea from './raging-sea'
import Ground from './Ground'

export default class Planet{
  constructor(){
    this.experience = new Experience()
    this.scene = this.experience.PlanetScene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.overlay = this.experience.overlay
    this.renderer = this.experience.renderer

    
    this.camera.controls.maxDistance = 35

    this.setLoading()

    this.setGeometry()
    this.setTexture()
    this.setMaterial()
    this.setMesh()

    this.setArrow()
    this.setStars()

    this.sceneButton()
    this.getTick()
  }

  setLoading(){

    this.overlayGeometry = new THREE.PlaneBufferGeometry(2,2,1,1)
      this.overlayMaterial = new THREE.ShaderMaterial({vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        uniforms:{
            uAlpha: {value: 1}
        }
    })
      this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)

      this.scene.add(this.overlay)

    this.loadingBarElement = document.querySelector('.loading-bar')

    gsap.delayedCall(0.5, ()=>{
      gsap.to(this.overlayMaterial.uniforms.uAlpha, {duration: 2, value: 0})

      // this.setSea()
      this.loadingBarElement.classList.add('ended')
      this.loadingBarElement.style.transform = ``
    })


  }
  

  setGeometry(){
    this.earth = new THREE.SphereGeometry(3, 50, 50)
    this.sun = new THREE.SphereGeometry(5, 50, 50)
  }

  setTexture(){
    this.earthTextures = {}
    console.log(this.resources)
    this.earthTextures.color = this.resources.items.earthDay

    this.earthTextures.color.encoding= THREE.sRGBEncoding

    this.sunTextures = {}
    this.sunTextures.color = this.resources.items.sun
    this.sunTextures.color.encoding= THREE.sRGBEncoding

  }

  setMaterial(){
    this.earthMaterial = new THREE.MeshBasicMaterial({
      map: this.earthTextures.color
    })

    this.sunMaterial = new THREE.ShaderMaterial({
      uniforms:{
        map: {value: this.sunTextures.color}
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.sunGlowMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexSun,
      fragmentShader: fragmentSun,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      transparent: true
    })

  }

  setMesh(){
    this.group = new Group()

    this.earthMesh = new THREE.Mesh(this.earth, this.earthMaterial)
    this.earthMesh.scale.set(0.5, 0.5, 0.5)
    this.earthMesh.position.x = 12
    this.earthMesh.rotation.set(0, -(Math.PI/2), 0)

    this.sunMesh = new THREE.Mesh(this.sun, this.sunMaterial)
    this.sunMesh.position.set(-13,0,5)

    this.sunGlowMesh = new THREE.Mesh(this.sun, this.sunGlowMaterial)
    this.sunGlowMesh.scale.set(1.1,1.1,1.1)
    this.sunGlowMesh.position.set(-13,0,5)

    this.group.add(this.earthMesh)
    this.group.add(this.sunMesh)
    this.group.add(this.sunGlowMesh)

    this.group.position.z = -15
    this.group.position.y = -5

    this.scene.add(this.group)

  }

  setArrow(){
    this.arrowGroup = new Group()

    this.arrowGeo = new THREE.PlaneBufferGeometry(5,0.1,32,32)

    this.arrowMat= new THREE.ShaderMaterial({
        vertexShader: vertexArrow,
        fragmentShader: fragmentArrow,
        side: THREE.DoubleSide,
        uniforms:
        {
            uTime: { value: 0 }
        }
    })

    this.arrow = new THREE.Mesh(this.arrowGeo, this.arrowMat)
    this.arrow.position.set(-3, 1, 3)
      this.arrow.rotateX(Math.PI/2)
      this.arrow.rotateZ(-0.19)
      this.arrow.position.z = -12
      this.arrow.position.y = -3

    this.arrow2 = this.arrow.clone()
    this.arrow2.position.y = - 4

    this.arrow3 = this.arrow.clone()
    this.arrow3.position.y = - 5

    this.scene.add(this.arrow)
    this.scene.add(this.arrow2)
    this.scene.add(this.arrow3)

  }

  setStars(){
    //texture
    this.starTextures = {}
    this.starTextures.color = this.resources.items.star
    this.starTextures.color.encoding= THREE.sRGBEncoding

    //geo
    this.starGeo = new THREE.BufferGeometry()
    this.count = 500

    this.positions = new Float32Array(this.count*3)

    for(let i=0; i<this.count*3; i++){
      this.positions[i] = (Math.random() - 0.5) * 100
    }

    this.starGeo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
   
    //Material
    this.starMat = new THREE.PointsMaterial()
    this.starMat.size = 0.5
    this.starMat.sizeAttenuation = true
    this.starMat.depthWrite = false
    this.starMat.blending = THREE.AdditiveBlending
    this.starMat.map = this.starTextures.color

    this.stars = new THREE.Points(this.starGeo, this.starMat)
    this.scene.add(this.stars)

  }


  sceneButton(){
    document.querySelector('.back-scene').classList.add('visible')
    document.querySelector('.next-scene').classList.add('visible')


    document.querySelector(`.back-scene`).onclick =()=>{
      document.querySelector('.next-scene').classList.remove('visible')
      document.querySelector('.back-scene').classList.remove('visible')
      this.sea = new Sea()

      this.renderer.setSeaScene()
    }

    document.querySelector(`.next-scene`).onclick =()=>{
    
      document.querySelector('.next-scene').classList.remove('visible')

      this.ground = new Ground()
      this.renderer.setGroundScene()
    }
}
  getTick(){
    this.otherTick = ()=>{
      this.arrowMat.uniforms.uTime.value = this.time.elapsed * 0.01

      // this.camera.controls.update()

     window.requestAnimationFrame(this.otherTick)
  }
  this.otherTick()
  }

 
}