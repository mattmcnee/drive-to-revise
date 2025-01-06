import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Object3D } from "three";

interface FpvCameraProps {
  vehicleRef: React.RefObject<Object3D>;
  started: boolean;
}

const FpvCamera = ({ vehicleRef, started } : FpvCameraProps) => {
  const { camera, gl } = useThree();
  const moveSpeed = 0.01;
  const rotationSpeed = -0.004;
  const keyStates = useRef<{ [key: string]: boolean }>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  // Initialize camera position relative to vehicle
  useEffect(() => {
    if (vehicleRef.current) {
      const offset = new Vector3(-0.3, 0, 0.9).applyQuaternion(vehicleRef.current.quaternion);
      camera.position.copy(vehicleRef.current.position).add(offset);
      camera.position.setY(0.2);
      camera.rotation.copy(vehicleRef.current.rotation);
      const lookAtPosition = vehicleRef.current.position.clone();
      lookAtPosition.y = camera.position.y; // Keep the y position the same to avoid affecting x or z rotation
      camera.lookAt(lookAtPosition);
    }
  }, [vehicleRef.current]);

  // Handle key press and mouse drag events
  useEffect(() => {
    if (started) return; // Don't do this if the game has started

    // Set which keys are pressed
    const handleKeyDown = (e: KeyboardEvent) => keyStates.current[e.key.toLowerCase()] = true;
    const handleKeyUp = (e: KeyboardEvent) => keyStates.current[e.key.toLowerCase()] = false;
    
    // Detect when user is dragging the mouse
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(true);
        dragStartX.current = e.clientX;
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartX.current;
        camera.rotation.y += deltaX * rotationSpeed;
        dragStartX.current = e.clientX;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("mouseup", handleMouseUp);
    gl.domElement.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mouseup", handleMouseUp);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gl.domElement, isDragging, started]);

  useFrame(() => {
    if (started) return;

    // Movement vectors based on camera orientation
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    const right = new Vector3(-1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    const movement = new Vector3();

    // Map key states to movement vectors
    const keys = {
      forward: keyStates.current["w"] || keyStates.current["arrowup"],
      backward: keyStates.current["s"] || keyStates.current["arrowdown"],
      left: keyStates.current["a"] || keyStates.current["arrowleft"],
      right: keyStates.current["d"] || keyStates.current["arrowright"]
    };

    // Apply movement based on key states
    if (keys.forward) movement.add(forward.multiplyScalar(moveSpeed));
    if (keys.backward) movement.add(forward.multiplyScalar(-moveSpeed));
    if (keys.left) movement.add(right.multiplyScalar(moveSpeed / 1.2));
    if (keys.right) movement.add(right.multiplyScalar(-moveSpeed / 1.2));

    // Cap the magnitude of movement so it never exceeds moveSpeed
    if (movement.length() > moveSpeed) {
      movement.setLength(moveSpeed);
    }

    if (movement.length() === 0) return;

    // Update camera position
    camera.position.add(movement).setY(0.2);
  });

  return null;
};

export default FpvCamera;

