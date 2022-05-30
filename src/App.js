import './App.css';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { WebGLCubeRenderTarget } from 'three';
import { RGBAFormat } from 'three';
import { LinearMipmapLinearFilter } from 'three';
import { CubeCamera } from 'three';
import { CubeTextureLoader } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useRef, useMemo, Suspense } from 'react';
extend({ OrbitControls });
//sphere
//en la esfera creaste la camara de 6 camaras que estaran viendo al objeto como si fuera un cubo
function Sphere() {
  const { scene, gl } = useThree();
  //crear renderizado de la camara del cubo esto es con el cube render target
  //esto se croe en Threejs sin usar los componentes de react, en el ejemplo de tesla lo hace cargando mas de texturas

  const cubeRenderTarget = new WebGLCubeRenderTarget(256, {
    format: RGBAFormat,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });
  //el cube camera es un metodo que requiere esos argumentos
  const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);
  scene.add(cubeCamera);
  //se agrega algo a la cubeCamera no estoy seguro que es
  useFrame(() => cubeCamera.update(gl, scene));
  return (
    <mesh>
      <directionalLight intensity={0.5} />
      <sphereGeometry attach="geometry" args={[2, 32, 32]} />
      <meshBasicMaterial
        envMap={cubeCamera.renderTarget.texture}
        attach="material"
        color="orange"
        roughness={0.1}
        metalness={1}
      />
    </mesh>
  );
}

//skybox
//el fondo 3D que se carga como un cubo de texturas
//a la escena le tienes que meter en el backgroun un path de texturas
const Skybox = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { scene, gl } = useThree();
  const loader = new CubeTextureLoader();
  //objeto de imagenes para la textura
  const texture = loader.load([
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
    '/5.jpg',
    '/6.jpg',
  ]);
  //llamar al fondo
  scene.background = texture;
  console.log(scene);
  /*  const formatted = useMemo(
    () =>
      new THREE.WebGLCubeRenderTarget(256, {
        format: RGBAFormat,
        generateMipmaps: true,
        minFilter: LinearMipmapLinearFilter,
      }).fromEquirectangularTexture(gl, texture),
    []
  );
  return <primitive attach="background" object={formatted.texture} />; */
  return null;
};

//camera controls
const CameraControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  //se le pone la ref para animar y se usa el useframe para dar el autoloop de animacion
  useFrame(() => controlsRef.current.update());
  return (
    <orbitControls
      args={[camera, gl.domElement]}
      ref={controlsRef}
      //esto es lo que hace que este girando pero se tiene que declarar la animacion con el useFrame update
      autoRotate={true}
      enableZoom={false}
    />
  );
};

function App() {
  return (
    <Canvas className="canvas">
      <CameraControls />
      <Sphere />
      <Suspense fallback={null}>
        <Skybox />
      </Suspense>
    </Canvas>
  );
}

export default App;
