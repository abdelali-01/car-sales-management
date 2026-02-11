import { Product } from "@/components/modals/ProductModal";
import { Category } from "@/components/tables/CategoriesTable";
import { createSlice } from "@reduxjs/toolkit";

// const StaticProducts = [
//     {
//         id: 1,
//         name: 'Product 1',
//         category: 'Electronics',
//         description: 'Description 1',
//         price: 2100,
//         quantity: 0,
//         images: ['/images/product/1.jpg'],
//         attributes: {
//             color: {
//                 red: 50,
//                 green: 20,
//                 white: 10
//             },
//             size: {
//                 S: 15,
//                 M: 30,
//                 L: 25
//             }
//         }
//     },
//     {
//         id: 2,
//         name: 'Product 2',
//         category: 'Clothing',
//         description: 'Description 2',
//         price: 2100,
//         quantity: 100,
//         images: ['/images/product/2.jpg'],
//         attributes: {
//             color: {
//                 red: 50,
//                 green: 20,
//                 white: 10
//             },
//             size: {
//                 S: 15,
//                 M: 30,
//                 L: 25
//             }
//         }
//     },
// ]

// const categories = [
//     { id: 1, name: 'Electronics', description: 'Electronic devices and accessories' },
//     { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
//     { id: 3, name: 'Books', description: 'Books and publications' },
// ];


const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: null as Product[] | null,
        categories: null as Category[] | null,
        loading: false as boolean,
        error: null
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setCategories : (state , action)=>{
            state.categories = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setProducts, setLoading, setCategories , setError } = productSlice.actions;
export default productSlice.reducer;
