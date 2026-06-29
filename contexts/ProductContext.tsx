import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { databaseService } from '../services/databaseService';

interface ProductContextType {
    products: Product[];
    categories: Category[];
    loading: boolean;
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCategory: (category: Category) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    getProductById: (id: string) => Product | undefined;
    refreshProducts: () => Promise<void>;
    refreshCategories: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshProducts = async () => {
        const dbProducts = await databaseService.getProducts();
        setProducts(dbProducts);
    };

    const refreshCategories = async () => {
        const data = await databaseService.getCategories();
        setCategories(data);
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await Promise.all([refreshProducts(), refreshCategories()]);
            setLoading(false);
        };
        initData();
    }, []);

    const addProduct = async (product: Product) => {
        await databaseService.addProduct(product);
        setProducts(prev => [...prev, product]);
    };

    const updateProduct = async (updatedProduct: Product) => {
        await databaseService.updateProduct(updatedProduct);
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = async (id: string) => {
        await databaseService.deleteProduct(id);
        await refreshProducts();
    };

    const addCategory = async (category: Category) => {
        await databaseService.addCategory(category);
        await refreshCategories();
    };

    const deleteCategory = async (id: string) => {
        await databaseService.deleteCategory(id);
        await refreshCategories();
    };

    const getProductById = (id: string) => {
        return products.find(p => p.id === id);
    };

    return (
        <ProductContext.Provider value={{ 
            products, 
            categories,
            loading, 
            addProduct, 
            updateProduct, 
            deleteProduct, 
            addCategory,
            deleteCategory,
            getProductById, 
            refreshProducts,
            refreshCategories
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
