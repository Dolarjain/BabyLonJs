window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    

    // Define a box mesh to act as the parent of the camera
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.1 }, scene);
    box.position.y = 0; // Adjust position as needed
    box.visibility = false; // Hide the box from the camera's view
    
     // Define a FreeCamera
     const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1, 0), scene);
     camera.parent = box; // Attach the camera to the box

       // Remove the keyboard inputs for the camera
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
     
   // Restrict camera movement to only left, right, forward, and backward
   camera.inputs.clear();
  
   camera.inputs.add(new BABYLON.FreeCameraMouseInput({ touchEnabled: true }));

   // Set the target for the camera to look at
   camera.setTarget(BABYLON.Vector3.Zero());

   // Attach the camera to the canvas
   camera.attachControl(canvas, true);


   
  // Smooth movement parameters
  const animationFPS = 30; // Frames per second for animation
  const moveDuration = 0.5; // Duration for each movement (in seconds)
  const moveDistance = 1; // Adjust movement distance as needed

  // Define box movement based on camera's forward direction
  scene.onKeyboardObservable.add((kbInfo) => {
      const keyCode = kbInfo.event.keyCode;
      const initialPosition = box.position.clone(); // Initial position of the box
      let finalPosition = box.position.clone(); // Final position of the box
      const forwardVector = camera.getForwardRay().direction; // Get camera's forward direction
      forwardVector.y = 0; // Exclude vertical component

      // Normalize the forward vector to ensure consistent movement distance
      forwardVector.normalize();

      switch (keyCode) {
          case 87: // W key
              finalPosition.addInPlace(forwardVector.scale(moveDistance));
              break;
          case 83: // S key
              finalPosition.subtractInPlace(forwardVector.scale(moveDistance));
              break;
          case 65: // A key
              finalPosition.addInPlace(forwardVector.scale(-moveDistance)); // Move left
              break;
          case 68: // D key
              finalPosition.addInPlace(forwardVector.scale(moveDistance)); // Move right
              break;
      }

      // Animate the box movement
      const animationBox = new BABYLON.Animation(
          "boxAnimation",
          "position",
          animationFPS,
          BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      const keys = [
          { frame: 0, value: initialPosition },
          { frame: animationFPS * moveDuration, value: finalPosition }
      ];
      animationBox.setKeys(keys);
      box.animations = [animationBox];
      scene.beginAnimation(box, 0, animationFPS * moveDuration, false);
  });
const light = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -2, -1), scene);
light.intensity = 1; // Adjust light intensity as needed
const light2 = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 1; // Adjust light intensity as needed


// Set the target for the camera to look at
camera.setTarget(BABYLON.Vector3.Zero(1));

// Attach the camera to the canvas
camera.attachControl(canvas, true);


const videoTexture = new BABYLON.VideoTexture("video", ["AdaniMetaverse_EXE.mp4"], scene, true, true);
    
// Adjust video texture settings for better quality
videoTexture.video.play(); // Start playing the video
videoTexture.video.loop = true; // Loop the video
videoTexture.video.muted = true; // Mute the video to avoid feedback
videoTexture.video.autoplay = true; // Autoplay the video
videoTexture.video.preload = "auto"; // Preload the video

    // Create video material
    const videoMaterial = new BABYLON.StandardMaterial("videoMaterial", scene);
    videoMaterial.diffuseTexture = videoTexture;
    
    // Create plane mesh for the video
    const videoPlane = BABYLON.MeshBuilder.CreatePlane("plane", { width: 1.7, height: 0.96 }, scene);
    videoPlane.material = videoMaterial;
    videoPlane.position = new BABYLON.Vector3(0.3, 1.016, -1.6);
    videoPlane.rotation.y = BABYLON.Tools.ToRadians(180);
    videoPlane.rotation.z = BABYLON.Tools.ToRadians(0);
    videoPlane.rotation.x = BABYLON.Tools.ToRadians(0);
    camera.minZ = 0.1;
    console.log(camera.minZ); // Adjust position as needed
    

    // Flip the video texture vertically by modifying UVs
    const vertexData = BABYLON.VertexData.CreatePlane({ width: 1.7, height: 0.96 });
    const uvs = vertexData.uvs;
    for (let i = 1; i < uvs.length; i += 2) {
        uvs[i] = 1 - uvs[i]; // Flip vertically
    }
    vertexData.applyToMesh(videoPlane);

    //Load the room GLB model
    const roomGlb = BABYLON.SceneLoader.Append("./", "ClassRoom.glb", scene, function () {
        
        // Scene loaded callback
        // You can perform actions after the scene is loaded here
    });
    
    engine.runRenderLoop(() => {
        scene.render();
    });
});