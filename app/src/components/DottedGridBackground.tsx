import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Create a custom shader material for the dotted grid background
const DottedGridMaterial = shaderMaterial(
	{
		uScale: 500.0,          // Controls density of dots
		uCameraPosition: new THREE.Vector2(0, 0),
		dotSize: 0.45          // Controls the size of each dot
	},
	// Vertex shader
	`
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
	`,
	// Fragment shader
	`
	varying vec2 vUv;
	uniform float uScale;
	uniform vec2 uCameraPosition;
	uniform float dotSize;

	void main() {
		// Calculate the grid position based on camera position and scale
		vec2 gridPosition = vUv * uScale - uCameraPosition;
		vec2 gridCellCenter = fract(gridPosition) - 0.5;

		// Calculate the circular distance from the center of each grid cell
		float distanceToCenter = length(gridCellCenter);

		// Use dotSize to set the radius of each dot
		float strength = smoothstep(dotSize, dotSize + 0.005, 0.5 - distanceToCenter);

		vec4 color = mix(vec4(0.0), vec4(0.5, 0.5, 0.5, 1.0), strength);
		gl_FragColor = color;
	}
	`
)

extend({ DottedGridMaterial })

export const GridBackground = () => {
	const materialRef = useRef<THREE.ShaderMaterial>(null)
	const { camera } = useThree()

	// Update the grid background based on the camera's position
	useFrame((state) => {
        // camera zoom level
        const zoom = state.camera.zoom;


        // scale is larger when zoomed out
        const scale = 500 * zoom;

		if (materialRef.current) {
			materialRef.current.uniforms.uCameraPosition.value.set(
				camera.position.x,
				camera.position.y
			)
            materialRef.current.uniforms.uScale.value = scale
		}

	})

	return (
		<mesh position={[0, 0, -5]}>
			<planeGeometry args={[200, 200]} />
            {/* @ts-expect-error-next-line */}
			<dottedGridMaterial ref={materialRef} />
		</mesh>
	)
}