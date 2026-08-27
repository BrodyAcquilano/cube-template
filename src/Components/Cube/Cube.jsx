import Face1 from "../Faces/Face1";
import Face2 from "../Faces/Face2";
import Face3 from "../Faces/Face3";
import Face4 from "../Faces/Face4";
import Face5 from "../Faces/Face5";
import Face6 from "../Faces/Face6";


const FACE_OFFSET =
  1.005;


function Cube({
  onChoose,
}) {
  return (
    <group>
      <mesh>
        <boxGeometry
          args={[
            2,
            2,
            2,
          ]}
        />

        <meshStandardMaterial
          color="#666666"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>


      {/* FRONT */}

      <group
        position={[
          0,
          0,
          FACE_OFFSET,
        ]}
      >
        <Face1
          onChoose={
            onChoose
          }
        />
      </group>


      {/* RIGHT */}

      <group
        position={[
          FACE_OFFSET,
          0,
          0,
        ]}
        rotation={[
          0,
          Math.PI /
            2,
          0,
        ]}
      >
        <Face2
          onChoose={
            onChoose
          }
        />
      </group>


      {/* BACK */}

      <group
        position={[
          0,
          0,
          -FACE_OFFSET,
        ]}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
      >
        <Face3
          onChoose={
            onChoose
          }
        />
      </group>


      {/* LEFT */}

      <group
        position={[
          -FACE_OFFSET,
          0,
          0,
        ]}
        rotation={[
          0,
          -Math.PI /
            2,
          0,
        ]}
      >
        <Face4
          onChoose={
            onChoose
          }
        />
      </group>


      {/* TOP */}

      <group
        position={[
          0,
          FACE_OFFSET,
          0,
        ]}
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
      >
        <Face5
          onChoose={
            onChoose
          }
        />
      </group>


      {/* BOTTOM */}

      <group
        position={[
          0,
          -FACE_OFFSET,
          0,
        ]}
        rotation={[
          Math.PI /
            2,
          0,
          0,
        ]}
      >
        <Face6
          onChoose={
            onChoose
          }
        />
      </group>
    </group>
  );
}


export default Cube;