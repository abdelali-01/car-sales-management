import { User } from "@/components/auth/SignUpForm";
import { createSlice } from "@reduxjs/toolkit";

// {
//         username : 'abdelali' ,
//         email : 'aliaribi47@gmail.com',
//         phone : '0655878447',
//         isAdmin : true ,
//         role : 'super',
//  }

// {
//     username : 'guest' ,
//     email : 'guest@gmail.com' ,
//     phone : '' ,
//     isAdmin : true ,
//     role : 'super' , // default role
// } 

const initialState : {
    user : User | null;
    isFetching :boolean 
} = {
    user :null,
    isFetching : false ,
}

const authSlice = createSlice({
    name : 'auth' ,
    initialState ,
    reducers : {
        setIsFeching : (state , action)=>{
            state.isFetching = action.payload
        },
        setUser : (state , action) => {
            state.user = action.payload ;
            state.isFetching = false
        },
    }
});

export const {setUser ,setIsFeching} = authSlice.actions ;
export default authSlice.reducer ;