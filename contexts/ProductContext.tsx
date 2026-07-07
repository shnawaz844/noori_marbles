import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { databaseService } from '../services/databaseService';
import { PRODUCTS, CATEGORIES } from '../constants';

const defaultCategories: Category[] = CATEGORIES.map(name => ({
    id: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
    name,
    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
}));

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
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [categories, setCategories] = useState<Category[]>(defaultCategories);
    const [loading, setLoading] = useState(true);

    const refreshProducts = async () => {
        try {
            const dbProducts = await databaseService.getProducts();
            if (dbProducts && dbProducts.length > 0) {
                setProducts(dbProducts);
            }
        } catch (err) {
            console.error('Error refreshing products:', err);
        }
    };

    const refreshCategories = async () => {
        try {
            const data = await databaseService.getCategories();
            if (data && data.length > 0) {
                setCategories(data);
            }
        } catch (err) {
            console.error('Error refreshing categories:', err);
        }
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
        setProducts(prev => [...prev, product]);
        try {
            await databaseService.addProduct(product);
        } catch (err) {
            console.error('Error adding product to DB:', err);
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        try {
            await databaseService.updateProduct(updatedProduct);
        } catch (err) {
            console.error('Error updating product in DB:', err);
        }
    };

    const deleteProduct = async (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        try {
            await databaseService.deleteProduct(id);
        } catch (err) {
            console.error('Error deleting product from DB:', err);
        }
    };

    const addCategory = async (category: Category) => {
        setCategories(prev => {
            if (prev.some(c => c.id === category.id)) return prev;
            return [...prev, category];
        });
        try {
            await databaseService.addCategory(category);
        } catch (err) {
            console.error('Error adding category to DB:', err);
        }
    };

    const deleteCategory = async (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        try {
            await databaseService.deleteCategory(id);
        } catch (err) {
            console.error('Error deleting category from DB:', err);
        }
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
