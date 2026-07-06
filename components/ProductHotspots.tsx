import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { Hotspot, Product } from '../types';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';


interface ProductHotspotsProps {
    image: string;
    name: string;
    hotspots: Hotspot[];
}

const ProductHotspots: React.FC<ProductHotspotsProps> = ({ image, name, hotspots }) => {
    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
    const [lastClickedCoords, setLastClickedCoords] = useState<{ x: number, y: number } | null>(null);
    const { addToCart, isInCart } = useCart();
    const { products } = useProducts();


    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        setLastClickedCoords({ x, y });
        console.log(`Hotspot Coordinates: { x: ${x}, y: ${y} }`);
    };

    return (
        <div
            className="relative rounded-2xl overflow-hidden shadow-lg group/main aspect-video cursor-crosshair bg-slate-100"
            onClick={handleImageClick}
        >
            <div className="absolute inset-0 transition-transform duration-700 group-hover/main:scale-105">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />

                {/* Hotspots */}
                {hotspots.map((hotspot, index) => {
                    const linkedProduct = products.find(p => p.id === hotspot.productId);

                    // Use overrides or fallback to linked product data
                    const displayName = hotspot.name || linkedProduct?.name;
                    const displayPrice = hotspot.price !== undefined ? hotspot.price : linkedProduct?.price;
                    const displayImage = hotspot.image || linkedProduct?.image;

                    if (!displayName) return null; // Need at least a name to display something meaningful

                    const isActive = activeHotspot === `${hotspot.productId}-${index}`;

                    return (
                        <div
                            key={`${hotspot.productId}-${index}`}
                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                            onMouseEnter={() => setActiveHotspot(`${hotspot.productId}-${index}`)}
                            onMouseLeave={() => setActiveHotspot(null)}
                            onClick={(e) => e.stopPropagation()} // Prevent coordinate picker when clicking hotspot
                        >
                            {/* Pulse Marker */}
                            <div className="relative flex items-center justify-center cursor-pointer">
                                <div className="absolute w-8 h-8 bg-white/40 rounded-full animate-ping" />
                                <div className="relative w-4 h-4 bg-white rounded-full border-2 border-amber-500 shadow-lg" />
                            </div>

                            {/* Tooltip */}
                            <div
                                className={`absolute bottom-full mb-4 z-50 transition-all duration-300 transform ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                                    }`}
                                style={{
                                    left: hotspot.x < 20 ? '0' : hotspot.x > 80 ? 'auto' : '50%',
                                    right: hotspot.x > 80 ? '0' : 'auto',
                                    transform: hotspot.x < 20 ? 'translateX(0)' : hotspot.x > 80 ? 'translateX(0)' : 'translateX(-50%)'
                                }}
                            >
                                <div className="rounded-xl shadow-2xl overflow-hidden w-64 border" style={{ backgroundColor: 'var(--surface-white)', borderColor: 'var(--outline-variant)' }}>
                                    {displayImage && (
                                        <div className="relative h-32">
                                            <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-3 left-3 text-white">
                                                {linkedProduct && <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{linkedProduct.category}</div>}
                                                <div className="font-bold text-sm leading-tight">{displayName}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--surface-white)' }}>
                                        <div>
                                            {!displayImage && (
                                                <div className="font-bold text-sm leading-tight mb-1" style={{ color: 'var(--on-surface)' }}>{displayName}</div>
                                            )}
                                            {displayPrice !== undefined && (
                                                <div className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>
                                                    ₹{displayPrice.toLocaleString('en-IN')}
                                                    {linkedProduct?.unit && <span className="text-xs font-normal ml-1" style={{ color: 'var(--outline)' }}>/ {linkedProduct.unit}</span>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {linkedProduct && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            addToCart(linkedProduct);
                                                        }}
                                                        className={`p-2 rounded-lg transition-colors ${isInCart(linkedProduct.id)
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                                            }`}
                                                        title={isInCart(linkedProduct.id) ? 'Added to cart' : 'Add to cart'}
                                                    >
                                                        <ShoppingCart size={16} />
                                                    </button>
                                                    <Link
                                                        to={`/product/${linkedProduct.id}`}
                                                        className="p-2 rounded-lg transition-colors"
                                                        style={{ backgroundColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                                                        title="View details"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ChevronRight size={16} />
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tooltip Arrow */}
                                <div
                                    className="absolute top-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px]"
                                    style={{
                                        left: hotspot.x < 20 ? '15%' : hotspot.x > 80 ? '85%' : '50%',
                                        transform: 'translateX(-50%)',
                                        borderTopColor: 'var(--surface-white)'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Coordinate Helper (Dev Mode Tip) */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-20">
                <div className="backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold shadow-sm opacity-0 group-hover/main:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--surface-white)', color: 'var(--on-surface)' }}>
                    Hover dots for details | Click anywhere for coordinates
                </div>
                {lastClickedCoords && (
                    <div className="bg-amber-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce">
                        Last Click: x: {lastClickedCoords.x}, y: {lastClickedCoords.y}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductHotspots;
