import * as THREE from '/assets/js/lib/three.module.js';
import { GLTFLoader } from '/assets/js/lib/GLTFLoader.js';

// Init

let _camera, _scene, _renderer;
let _cameraMini, _sceneMini, _rendererMini;
let modelLoaderGLTF;

let sceneWrapperId = 'av-bg' // ID HTML-блока в который будет помещена сцена с 3d-моделью
let sceneWrapperNode;

let sceneMiniWrapperId = 'av-mini'
let sceneMiniWrapperNode;

let modelA = {
    path: '/assets/models/a.glb',
    model: {},
}

let modelV = {
    path: '/assets/models/v.glb',
    model: {}
}

let modelMiniA = {
    path: '/assets/models/a.glb',
    model: {},
}

let modelMiniV = {
    path: '/assets/models/v.glb',
    model: {}
}

$(document).ready(Core);

function Core()
{
    Init();
    InitMiniScene();

    Animate();

    HandlerResize();
    SceneHoverEffect();
    SceneScrollEffect();
    ProjectScrollEffect();
    SetDropdown();

    InitOwlCarousel();
    Marquee3k.init();
}

function Init()
{
    modelLoaderGLTF = new GLTFLoader();

    _camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    _scene = new THREE.Scene();
    sceneWrapperNode = $(`#${sceneWrapperId}`)[0];

    _renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} );
    _renderer.setPixelRatio( window.devicePixelRatio );
    _renderer.setSize( window.innerWidth, window.innerHeight );
    _renderer.shadowMap.enabled = true;
    _renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    _renderer.useLegacyLights = false;

    $(sceneWrapperNode).append(_renderer.domElement);

    _camera.position.z = 5;

    let lights = [
        {
            position: {
                x: 0.25,
                y: 0.09,
                z: 1
            },
            intensity: 25
        },
        {
            position: {
                x: -0.09,
                y: -0.2,
                z: 1
            },
            intensity: 25
        },
        {
            position: {
                x: -0.69,
                y: -0.2,
                z: 1
            },
            intensity: 25
        },
        {
            position: {
                x: 0.69,
                y: -0.2,
                z: 1
            },
            intensity: 25
        }
    ];

    SetLight(_scene, lights);

    LoadModels(modelA, {
        x: -0.6,
        y: -0.5,
        z: 0
    }, 2, _scene);
    LoadModels(modelV, {
        x: 0.6,
        y: 0.38,
        z: 0
    }, 2, _scene);

    Animate()
}

function InitMiniScene()
{
    modelLoaderGLTF = new GLTFLoader();

    _cameraMini = new THREE.PerspectiveCamera(
            75,
            1,
            0.1,
            1000
    );

    _cameraMini.position.z = 2

    _sceneMini = new THREE.Scene();
    sceneMiniWrapperNode = $(`#${sceneMiniWrapperId}`)[0];

    _rendererMini = new THREE.WebGLRenderer( {alpha: true, antialias: true} );
    _rendererMini.setPixelRatio( window.devicePixelRatio );
    _rendererMini.setSize( $(sceneMiniWrapperNode).width(), $(sceneMiniWrapperNode).height() );
    _rendererMini.shadowMap.enabled = true;
    _rendererMini.shadowMap.type = THREE.PCFSoftShadowMap;
    _rendererMini.useLegacyLights = false;

    $(sceneMiniWrapperNode).append(_rendererMini.domElement);

    let lights = [
        {
            position: {
                x: 0.25,
                y: 0.09,
                z: 1
            },
            intensity: 15
        },
        {
            position: {
                x: -0.09,
                y: -0.2,
                z: 1
            },
            intensity: 15
        },
    ];

    SetLight(_sceneMini, lights);

    LoadModels(modelMiniA, {
        x: -0.35,
        y: 0,
        z: 0
    }, 1, _sceneMini);
    LoadModels(modelMiniV, {
        x: 0.35,
        y: 0.46,
        z: 0
    }, 1, _sceneMini);

    AnimateMini()
}

function LoadModels(model, position = {x: 0, y: 0, z: 0}, scale = 1, scene)
{
    modelLoaderGLTF.load(model.path,
            function (gltf) {
                model.model = gltf.scene;
                scene.add( gltf.scene );

                model.model.traverse((o) => {
                    if (o.isMesh) o.material = new THREE.MeshPhongMaterial({color: 0x16454a, shininess: 500 });
                    //if (o.isMesh) o.material = new THREE.MeshLambertMaterial( { color: 0x16454a, side: THREE.DoubleSide } );
                    o.castShadow = true
                    o.receiveShadow = true
                });

                model.model.position.x = position.x;
                model.model.position.y = position.y;
                model.model.position.z = position.z;

                model.model.rotation.x = 0;
                model.model.rotation.y = 0;
                model.model.rotation.z = 0;

                model.model.scale.x = scale;
                model.model.scale.y = scale;
                model.model.scale.z = scale;

                model.model.children[0].position.x = 0;
                model.model.children[0].position.y = 0;
                model.model.children[0].position.z = 0;
            }
    )
}

function Animate()
{
    requestAnimationFrame( Animate );

    _renderer.render( _scene, _camera );
}

function AnimateMini()
{
    requestAnimationFrame( AnimateMini );

    _rendererMini.render( _sceneMini, _cameraMini );
}



function SetLight(scene, lights) // Функция добавляет источники света на сцену
{
    let ambientLight = new THREE.AmbientLight( 0x000000, 3.0 );
    scene.add(ambientLight);

    for (let light of lights)
    {
        let dirLight =   new THREE.DirectionalLight( 0x16454a, light.intensity );

        dirLight.position.set( light.position.x, light.position.y, light.position.z );
        dirLight.castShadow = true;
        dirLight.shadow.camera.zoom = 4;

        scene.add( dirLight );
    }

}

function HandlerResize()
{
    $(window).on('resize', function (e) {
    })
}

function SceneHoverEffect()
{
    $('section.screen.main').on("mousemove", function (e) {
        let scale = 0.15;
        _scene.rotation.y = (e.clientX - (window.innerWidth / 2)) / window.innerWidth * scale;
        _scene.rotation.x = (e.clientY - (window.innerHeight / 2)) / window.innerHeight * scale;
    });

    $(window).on("mousemove", function (e) {
        let scale = 0.15;
        _sceneMini.rotation.y = (e.clientX - (window.innerWidth / 2)) / window.innerWidth * scale;
        _sceneMini.rotation.x = (e.clientY - (window.innerHeight / 2)) / window.innerHeight * scale;
    });
}

function SceneScrollEffect()
{
    $('.scrolleffect').on('scroll', function (e) {
        let scrollDistance = -$(this).find('.scroll-content')[0].getBoundingClientRect().top;
        let progressPercentage = (scrollDistance/ (window.innerHeight * 2 - document.documentElement.clientHeight)) * 100;

        if (progressPercentage < 150)
        {
            $('.screen.main').css('transform', `translateY(${progressPercentage}%)`)
        }

        progressPercentage = Math.floor(progressPercentage);
        let val = progressPercentage > 100 ? 100: progressPercentage;

        modelA.model.position.x = -0.6 - 3 * val / 100;
        modelV.model.position.x = 0.6 + 3 * val / 100;

        let scale = progressPercentage < 50 ? 0 : (progressPercentage - 50) / 100;
        console.log(progressPercentage);

        $('.content-body').css('transform', `scale(${scale > 1 ? 1 : scale}) rotate3d(0.05, 1, 0, ${90 - 90 * scale < 0 ? 0 : 90 - 90 * scale}deg)`);

        if (scale >= 1.5)
        {
            $('.content-body').addClass('anchor');
            $('.screen.main').css('transform', ``)
            $('.screen.fake').addClass('anchor')
        }
        else
        {
            $('.content-body').removeClass('anchor');
            $('.screen.fake').removeClass('anchor')
        }
    })
}

function WheelEffect(e)
{
    console.log(e)
}

function ProjectScrollEffect()
{
    $('.scrolleffect').on('scroll', function (e) {
        let scrollDistance = -$(this).find('.content-body')[0].getBoundingClientRect().top;
        let progressPercentage = scrollDistance / ($('.projects-wrapper').position().top + $('.projects-wrapper').height() )

        $('.projects-wrapper .col.left').css('transform', `translateY(${200 * progressPercentage}px)`)
        $('.projects-wrapper .col.right').css('transform', `translateY(-${500 * progressPercentage}px)`)
    })
}

function InitOwlCarousel()
{
    $('.people-carousel.owl-carousel').owlCarousel({
        items: 1,
        navs: true,
        navContainer: $('.carousel-wrapper .owl-navs .navs'),
        dots: true,
        dotsContainer: $('.carousel-wrapper .owl-navs .dots'),
        autoHeight: true
    })
}

function SetDropdown()
{
    $('.d-header').on('click', function(e) {
        $(this).closest('.dropdown').toggleClass('active')
    })
}




