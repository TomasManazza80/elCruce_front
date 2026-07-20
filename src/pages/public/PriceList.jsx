import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGetProductsQuery } from '../../services/api/productApi.js';
import { useGetCategoriesQuery } from '../../services/api/categoryApi.js';
import { Search, PlusCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/public/header.tsx';
import Loader from '../../components/public/Loader';

export default function PriceList() {
    const { data: products, isLoading } = useGetProductsQuery();
    const { data: dbCategories } = useGetCategoriesQuery();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('TODOS');
    
    const headerRef = useRef(null);
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.from(headerRef.current, {
                    y: -40,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            }
        });
        return () => ctx.revert();
    }, []);

    useLayoutEffect(() => {
        if (!isLoading && contentRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo(".category-block", 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
                );
                gsap.fromTo(".product-item", 
                    { y: 20, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.2)", delay: 0.1 }
                );
            }, contentRef);
            return () => ctx.revert();
        }
    }, [isLoading, selectedCategory, searchTerm]);

    const categories = ['TODOS', ...(dbCategories?.map(c => c.name) || [])];

    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'TODOS' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedProducts = filteredProducts?.reduce((acc, product) => {
        const category = product.category?.toUpperCase() || 'OTROS';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    const isFiltered = searchTerm !== '' || selectedCategory !== 'TODOS';

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex justify-center">
            {/* Contenedor principal adaptable - ocupa toda la pantalla en PC */}
            <div className="w-full bg-white min-h-screen shadow-2xl relative flex flex-col font-oswald">
                
                <Header alwaysSolid={true} />

                {/* Header Rojo Oscuro */}
                <div ref={headerRef} className="bg-[#800b0e] mt-[92px] md:mt-[100px] pt-6 pb-0 flex flex-col shadow-md z-10">
                    <div className="px-4 flex items-center justify-between mb-2 text-white w-full">
                        <button onClick={() => navigate('/')} className="hover:text-gray-200 transition">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </div>

                    <h1 className="text-center text-4xl text-white font-bold tracking-wider uppercase mb-4">
                        Listado de Precios
                    </h1>
                    
                    <div className="px-4 mb-4 relative w-full lg:max-w-4xl mx-auto">
                        <input
                            type="text"
                            placeholder="Buscar cortes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-4 pr-10 rounded text-gray-700 focus:outline-none font-sans"
                        />
                        <Search className="absolute right-7 top-2.5 text-gray-400 w-5 h-5" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 px-2 w-full pb-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors uppercase tracking-wider ${
                                    selectedCategory === cat 
                                    ? 'text-white border-b-2 border-white' 
                                    : 'text-white/70 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body - Lista de Productos */}
                <div ref={contentRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 font-sans" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}>
                    {isLoading ? (
                        <Loader />
                    ) : filteredProducts?.length > 0 ? (
                        <div className={isFiltered ? "flex flex-col gap-8" : "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 items-start"}>
                            {Object.keys(groupedProducts).sort().map(categoryName => (
                                <div key={categoryName} className="flex flex-col category-block">
                                    {/* Professional Section Title */}
                                    <div className="flex items-center mb-6 mt-2">
                                        <h2 className="text-2xl md:text-3xl font-bold text-[#800b0e] uppercase tracking-wider font-oswald">{categoryName}</h2>
                                        <div className="flex-1 h-px bg-gradient-to-r from-[#800b0e]/40 to-transparent ml-4"></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        {groupedProducts[categoryName].map(product => (
                                            <div key={product.id} className="product-item flex items-center justify-between p-4 border border-black/80 shadow-sm bg-white/80 rounded-md hover:bg-white hover:shadow-md transition-all">
                                                <div className="flex items-center gap-4 flex-1">
                                                    {/* Imagen */}
                                                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 shadow-sm rounded-lg overflow-hidden bg-white">
                                                        {product.imageUrl ? (
                                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">Sin foto</div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Nombre */}
                                                    <h3 className="font-bold text-gray-800 text-lg md:text-xl leading-tight line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </div>
                                                
                                                {/* Precio */}
                                                <div className="flex flex-col items-end justify-center shrink-0 ml-2">
                                                    <div className="text-right">
                                                        <span className="font-bold text-[#800b0e] text-xl md:text-3xl">${product.pricePerKilo}</span>
                                                        <span className="text-gray-500 text-sm md:text-base font-semibold"> /kg</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center p-10 text-gray-500 text-sm font-sans text-center">
                            No se encontraron productos en esta categoría o búsqueda.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
