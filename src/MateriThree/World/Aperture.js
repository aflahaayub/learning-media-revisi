import * as THREE from 'three'
import { Group, Raycaster } from 'three'
import Experience from '../ExperienceThree'
import gsap from 'gsap'
import Mikrostrip from './Mikrostrip'

export default class Aperture{
  constructor(){
    this.experience = new Experience()
    this.scene = this.experience.ApertureScene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.sizes = this.experience.sizes
    this.renderer = this.experience.renderer
    this.world = this.experience.world
    this.loadIntro = this.experience.loadIntro

    this.clicked = 0
    this.isClicked = false

    this.setLoading()
    this.setSunLight()
    this.setModel()
    this.setSlider()
    this.setExplain()
    this.nextScene()
  }

  setLoading(){

    this.overlayGeometry = new THREE.PlaneBufferGeometry(2,2,1,1)
      this.overlayMaterial = new THREE.ShaderMaterial({
        vertexShader: `void main(){
          gl_Position = vec4(position, 1.0);
        }`,
        fragmentShader: `uniform float uAlpha;
        void main(){
          gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }`,
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
  setSunLight()
  {

      this.light = new THREE.AmbientLight( 0xffffff ); // soft white light
      this.scene.add( this.light );

      this.sunLight = new THREE.DirectionalLight('#ffffff', 5)
      this.sunLight.castShadow = true
      this.sunLight.shadow.camera.far = 15
      this.sunLight.shadow.mapSize.set(512, 512)
      this.sunLight.shadow.normalBias = 0.05
      this.sunLight.position.set(5, 5, 1)
      this.scene.add(this.sunLight)

      // const directionalLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 0.3)
      //   this.scene.add(directionalLightHelper)

      }

  setModel(){

        this.group = new Group()

        console.log(this.resources.items)
        this.bgModel = {}
        this.bgModel.model = this.resources.items.bgBlankModel.scene
        this.bgModel.texture = this.resources.items.bgBlankTexture
        this.bgModel.texture.encoding = THREE.sRGBEncoding
        this.bgModel.texture.flipY = false

        this.antena = {}
        this.antena.model = this.resources.items.hornModel
       

        this.bgModel.material = new THREE.MeshBasicMaterial({map: this.bgModel.texture})
        
        this.bgModel.model.traverse(child =>{
          if(child instanceof THREE.Mesh)
          {
            child.material = this.bgModel.material
          }
        })

        this.group.add(this.bgModel.model)
        this.group.add(this.antena.model.scene)
        // this.group.scale.set(-1,-1,-1)
        this.group.rotation.y = 1.5

        this.group.position.x = -12
        this.group.position.y = -9.5
        this.group.position.z = -1
        // this.scene.add(this.group)
        console.log(this.group)
        this.scene.add(this.group)

      }

  setSlider(){
    document.querySelector('.slider').classList.add('visible')
    document.querySelector('.animasi').classList.remove('visible')
    //SLIDER
    this.slideOpen = 0
    this.slide = document.querySelector('.slide-left')
    this.slider = document.querySelector('.slider')
    this.slide.onclick = ()=>{
      this.slideOpen++
      if(this.slideOpen % 2 === 0 ){
        this.slide.style.transform = 'rotate(0deg)'
        this.slider.classList.remove('open')
        this.slider.classList.add('close')
        document.querySelector('figure').classList.remove('visible')
        console.log('close')
      }else{
        this.slide.style.transform = 'rotate(180deg)'
        this.slide.style.transition = 'transform 1.5s ease'
        document.querySelector('figure').classList.add('visible')
        this.slider.classList.remove('close')
        this.slider.classList.add('open')
        console.log('open')
      }
    }
  }

  setExplain(){

    let title = 'Antena Aperture'
    let pOne ='Antena aperture mungkin lebih akrab bagi orang awam saat ini daripada di masa lalu karena meningkatnya permintaan akan bentuk antena yang lebih canggih dan pemanfaatan frekuensi yang lebih tinggi. Antena jenis ini sangat berguna untuk aplikasi pesawat dan pesawat luar angkasa, karena dapat sangat nyaman dipasang rata pada kulit pesawat atau pesawat ruang angkasa. Sebagai tambahan, mereka dapat ditutupi dengan bahan dielektrik untuk melindunginya dari kondisi berbahaya dari lingkungan. '
    
    let pTwo = 'Antena Horn adalah antena yang terdiri dari pandu gelombang logam yang berbentuk seperti klakson untuk mengarahkan gelombang radio dalam sinar. Horn banyak digunakan sebagai antena pada frekuensi UHF dan gelombang mikro, di atas 300 MHz. Mereka digunakan sebagai antena umpan (disebut feed horns) untuk struktur antena yang lebih besar seperti antena parabola, sebagai antena kalibrasi standar untuk mengukur penguatan antena lain, dan sebagai antena direktif untuk perangkat seperti senjata radar, pembuka pintu otomatis, dan radiometer gelombang mikro.'
        //Slider UP
        document.querySelector('.slide').classList.add('visible')
        let upSlide = 0
        let upIcon = document.querySelector('.up-icon')
        document.querySelector('.slide-up').onclick = ()=>{
          console.log(this.point)
          upSlide++
          if(upSlide % 2 === 0){
            document.querySelector('.back').classList.remove('visible')
            document.querySelector('.next-scene').classList.add('visible')
            document.querySelector('.slide-up').classList.add('hide')
            document.querySelector('.slide-up').classList.remove('open')
            document.querySelector('.judul').innerHTML = ''
            document.querySelector('.p1').innerHTML = ''
            document.querySelector('.p2').innerHTML = ''
            upIcon.style.transform = 'rotate(0deg)'
          }else{
            document.querySelector('.back').classList.remove('visible')
            document.querySelector('.next-scene').classList.remove('visible')
            document.querySelector('.slide-up').classList.remove('hide')
            document.querySelector('.slide-up').classList.add('open')
            upIcon.style.transform = 'rotate(180deg)'
            upIcon.style.transition = 'transform 1.2s ease'
            document.querySelector('.judul').innerHTML = title
            document.querySelector('.p1').innerHTML = pOne
            document.querySelector('.p2').innerHTML = pTwo
          }
        }
        document.querySelector('.back').onclick=()=>{
          document.querySelector('.back').classList.remove('visible')
        }
  }

  nextScene(){
    document.querySelector(`.next-scene`).onclick =()=>{
      
      document.querySelector('.next-scene').classList.remove('visible')
      this.mikro = new Mikrostrip()
      this.renderer.setMikrostripScene()
      this.audioElement = document.querySelector('audio')
      this.audioElement.src = '/sounds/materiThree/audioNine.mp3'
      this.sunLight.dispose()
      this.light.dispose()
      this.scene.remove(this.group)
    }
  }

  update(){
    this.camera.controls.update()
  }

}