import { AxiosError } from "axios";
import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setCategories, setLoading, setProducts } from "./productSlice";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { Product } from "@/app/(admin)/(others-pages)/(tables)/products/add/page";

// Fetch all products
export const fetchProducts = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.get(ENDPOINTS.PRODUCTS.BASE);
        if (res.data.success) {
            dispatch(setProducts(res.data.products));
        }
    } catch (error) {
        console.error('error during fetching products ', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch all categories
export const fetchCategories = () => async (dispatch: AppDispatch) => {
    try {
        const res = await api.get(ENDPOINTS.CATEGORIES.BASE);
        if (res.data.success) {
            dispatch(setCategories(res.data.categories));
        }
    } catch (error) {
        console.error('error during fetching categories ', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Fetch categories as tree structure
export const fetchCategoriesTree = () => async (dispatch: AppDispatch) => {
    try {
        const res = await api.get(ENDPOINTS.CATEGORIES.TREE);
        if (res.data.success) {
            dispatch(setCategories(res.data.categories));
        }
        return res.data;
    } catch (error) {
        console.error('error during fetching categories tree', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Fetch only root categories (no parent)
export const fetchRootCategories = () => async (dispatch: AppDispatch) => {
    try {
        const res = await api.get(ENDPOINTS.CATEGORIES.ROOT);
        if (res.data.success) {
            dispatch(setCategories(res.data.categories));
        }
        return res.data;
    } catch (error) {
        console.error('error during fetching root categories', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Fetch category path (breadcrumb)
export const fetchCategoryPath = async (categoryId: number) => {
    try {
        const res = await api.get(ENDPOINTS.CATEGORIES.PATH(categoryId));
        return res.data;
    } catch (error) {
        console.error('error during fetching category path', error);
        return null;
    }
};

// Fetch category subtree
export const fetchCategorySubtree = async (categoryId: number) => {
    try {
        const res = await api.get(ENDPOINTS.CATEGORIES.SUBTREE(categoryId));
        return res.data;
    } catch (error) {
        console.error('error during fetching category subtree', error);
        return null;
    }
};

// Fetch products and categories together
export const fetchProductsAndCategories = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const [productsRes, categoriesRes] = await Promise.all([
            api.get(ENDPOINTS.PRODUCTS.BASE),
            api.get(ENDPOINTS.CATEGORIES.BASE)
        ]);

        if (productsRes.data.success) {
            dispatch(setProducts(productsRes.data.products));
        }
        if (categoriesRes.data.success) {
            dispatch(setCategories(categoriesRes.data.categories));
        }
    } catch (error) {
        console.error('error during fetching products and categories', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoading(false));
    }
};

export const addProduct = (product: Product) => async (dispatch: AppDispatch) => {
    try {
        // Create FormData for handling images and product data
        const formData = new FormData();

        // Add product data with camelCase field names
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price.toString());
        formData.append('showOnHomepage', String(product.showOnHomepage || false));
        formData.append('categoryId', product.category_id.toString());
        if (product.quantity) formData.append('quantity', product.quantity.toString());
        if (product.prevPrice) formData.append('prevPrice', product.prevPrice.toString());
        if (product.presentation) formData.append('presentation', product.presentation);
        if (product.freeDelivery) formData.append('freeDelivery', String(product.freeDelivery));

        // Add attributes if they exist
        if (product.attributes) {
            formData.append('attributes', JSON.stringify(product.attributes));
        }

        // Add images
        if (product.images) {
            product.images.forEach((image: string) => {
                // If it's a base64 image, convert it to a file
                if (image.startsWith('data:image')) {
                    const byteString = atob(image.split(',')[1]);
                    const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);

                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }

                    const blob = new Blob([ab], { type: mimeString });
                    const file = new File([blob], `image-${Date.now()}.${mimeString.split('/')[1]}`, { type: mimeString });
                    formData.append('images', file);
                }
            });
        }

        const res = await api.post(ENDPOINTS.PRODUCTS.BASE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Product has been added successfully' }));
            dispatch(fetchProducts());
        }
    } catch (error) {
        console.error('error adding product', error);
        throw error;
    }
};

export const updateProduct = (productId: number, product: Product) => async (dispatch: AppDispatch) => {
    try {
        const formData = new FormData();
        console.log("received product to update", product);

        // Validate required fields
        if (!product.name || product.price === undefined || !product.category_id) {
            return dispatch(addToast({ type: 'error', message: 'Missing required product fields' }));
        }

        // Add product data with camelCase field names
        formData.append('name', product.name);
        if (product.description) formData.append('description', product.description);
        formData.append('showOnHomepage', String(product.showOnHomepage || false));
        formData.append('price', product.price.toString());
        formData.append('categoryId', product.category_id.toString());
        formData.append('quantity', product.quantity.toString());
        if (product.prevPrice) formData.append('prevPrice', product.prevPrice.toString());
        if (product.presentation) formData.append('presentation', product.presentation);
        if (product.freeDelivery) formData.append('freeDelivery', String(product.freeDelivery));

        // Add attributes if they exist
        if (product.attributes) {
            formData.append('attributes', JSON.stringify(product.attributes));
        }

        // Handle both existing and new images
        if (product.images && Array.isArray(product.images)) {
            // Separate existing images (URLs) and new images (base64)
            const existingImages: string[] = [];

            product.images.forEach((image: string) => {
                if (image.startsWith('data:image')) {
                    // Handle new base64 images
                    const byteString = atob(image.split(',')[1]);
                    const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);

                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }

                    const blob = new Blob([ab], { type: mimeString });
                    const file = new File([blob], `image-${Date.now()}.${mimeString.split('/')[1]}`, { type: mimeString });
                    formData.append('images', file);
                } else {
                    // Collect existing image URLs
                    existingImages.push(image);
                }
            });

            // Add existing images as JSON array
            if (existingImages.length > 0) {
                formData.append('existingImages', JSON.stringify(existingImages));
            }
        }

        console.log("formData", formData);
        const res = await api.put(ENDPOINTS.PRODUCTS.BY_ID(productId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Product has been updated successfully' }));
            dispatch(fetchProducts());
        }
    } catch (error) {
        console.error('error updating product', error);
        throw error;
    }
};

export const deleteProduct = (productId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.PRODUCTS.BY_ID(productId));

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Product has been deleted successfully' }));
            dispatch(fetchProducts());
        }
    } catch (error) {
        console.error('error deleting product', error);
        throw error;
    }
};

export const addCategory = (category: FormData) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post(ENDPOINTS.CATEGORIES.BASE, category, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Category has been added successfully' }));
            dispatch(fetchCategories());
        }
    } catch (error) {
        console.error('error adding category', error);
        throw error;
    }
};

export const updateCategory = (categoryId: number, category: FormData) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.put(ENDPOINTS.CATEGORIES.BY_ID(categoryId), category, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Category has been updated successfully' }));
            dispatch(fetchCategories());
        }
    } catch (error) {
        console.error('error updating category', error);
        throw error;
    }
};

export const deleteCategory = (categoryId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.CATEGORIES.BY_ID(categoryId));

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Category has been deleted successfully' }));
            dispatch(fetchCategories());
        }
    } catch (error) {
        console.error('error deleting category', error);
        throw error;
    }
};
