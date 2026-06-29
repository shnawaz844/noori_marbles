import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Environment } from '@react-three/drei';
import { Camera, X, RotateCcw, Check, ShoppingCart, Image as ImageIcon } from 'lucide-react';

// Placeholder 3D Models (using very stable public GLB URLs from Khronos Sample Assets)
const MODELS = [
    { id: 'chair', name: 'Luxury Chair', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb' },
    { id: 'sofa', name: 'Designer Sofa', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenWoodLeatherSofa/glTF-Binary/SheenWoodLeatherSofa.glb' },
    { id: 'pouf', name: 'Silk Pouf', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SpecularSilkPouf/glTF-Binary/SpecularSilkPouf.glb' }
];

const Model = ({ url }: { url: string }) => {
    // If the model fails to load, Suspense will stay in fallback or an error boundary is needed.
    // For now, we use stable URLs.
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1.5} />;
};

interface RoomVisualizerProps {
    onClose: () => void;
    initialMode?: 'camera' | 'gallery';
}

const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ onClose, initialMode = 'camera' }) => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [isCameraActive, setIsCameraActive] = useState(initialMode === 'camera');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startCamera = async () => {
        if (initialMode === 'gallery' && !capturedImage) {
            setIsCameraActive(false);
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraActive(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            // Don't alert here, user might prefer upload
            setIsCameraActive(false);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                setCapturedImage(canvasRef.current.toDataURL('image/png'));
                setIsCameraActive(false);

                // Stop camera stream
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCapturedImage(event.target?.result as string);
                setIsCameraActive(false);
                // Stop camera if running
                if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const reset = () => {
        setCapturedImage(null);
        startCamera();
    };

    React.useEffect(() => {
        if (initialMode === 'camera') {
            startCamera();
        } else if (initialMode === 'gallery') {
            fileInputRef.current?.click();
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Camera size={20} className="text-amber-500" />
                    AI Room Visualizer
                </h3>
                <button onClick={onClose} className="text-white hover:text-amber-500 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
                {isCameraActive || !capturedImage ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                        {isCameraActive && <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />}

                        <div className="absolute bottom-10 left-0 w-full flex justify-center items-center gap-8">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                                title="Upload from Gallery"
                            >
                                <ImageIcon size={24} />
                            </button>

                            {isCameraActive && (
                                <button
                                    onClick={captureImage}
                                    className="bg-amber-500 text-white p-6 rounded-full shadow-2xl hover:scale-110 transition-transform"
                                    title="Capture Photo"
                                >
                                    <Camera size={32} />
                                </button>
                            )}

                            <button
                                onClick={startCamera}
                                className={`bg-white/10 backdrop-blur-md text-white p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all ${isCameraActive ? 'hidden' : 'block'}`}
                                title="Start Camera"
                            >
                                <RotateCcw size={24} />
                            </button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        {/* Background Room Image */}
                        <div className="absolute inset-0 z-0">
                            <img src={capturedImage!} alt="Room" className="w-full h-full object-cover opacity-60" />
                        </div>

                        {/* 3D Scene */}
                        <div className="absolute inset-0 z-10">
                            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                                <Suspense fallback={
                                    <mesh position={[0, 0, 0]}>
                                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                                        <meshStandardMaterial color="#f59e0b" wireframe />
                                    </mesh>
                                }>
                                    <Stage environment="city" intensity={0.6}>
                                        <Model url={selectedModel.url} />
                                    </Stage>
                                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
                                </Suspense>
                            </Canvas>
                        </div>

                        {/* Controls Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex gap-4 mb-6 overflow-x-auto pb-4 scrollbar-hide">
                                    {MODELS.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedModel(m)}
                                            className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-all ${selectedModel.id === m.id
                                                ? 'bg-amber-500 text-white scale-105'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {m.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button onClick={reset} className="flex items-center gap-2 text-white/70 hover:text-white">
                                        <RotateCcw size={20} />
                                        Retake Photo
                                    </button>
                                    <button className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-amber-600 shadow-xl">
                                        <ShoppingCart size={20} />
                                        Add to Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomVisualizer;
