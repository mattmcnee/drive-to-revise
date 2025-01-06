import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group, Mesh } from "three";
import { getModelMatrix } from "@/components/drive/utils";

interface VehicleModelProps {
  vehicleRef: React.MutableRefObject<Group | null>;
  type: string;
}

const VehicleModel = ({ vehicleRef, type }: VehicleModelProps) => {
  const { scene } = useGLTF(`/models/${type}/scene.gltf`);
  const modelRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!modelRef.current) return;

    // Translate, scale and rotate the model to match others
    modelRef.current.matrix.identity();
    modelRef.current.applyMatrix4(getModelMatrix(type));

  }, [modelRef.current, type]);

  return (
    <group ref={vehicleRef}>
      <primitive ref={modelRef} object={scene} matrixAutoUpdate={false} />
    </group>
  );
}

export default VehicleModel;