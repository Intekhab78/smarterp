import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        addToCart: (state, action) => {
            const exist = state.find(
                (item) => item._id === action.payload._id
            );

            if (exist) {
                exist.qty += 1;
            } else {
                state.push({ ...action.payload, qty: 1 });
            }
        },

        increaseQty: (state, action) => {
            const item = state.find((i) => i._id === action.payload);
            if (item) item.qty += 1;
        },

        decreaseQty: (state, action) => {
            const index = state.findIndex(
                (i) => i._id === action.payload
            );

            if (index !== -1) {
                if (state[index].qty > 1) {
                    state[index].qty -= 1;
                } else {
                    state.splice(index, 1); // remove item
                }
            }
        },

        // 🔥 ADD THIS (fix your error)
        clearCart: () => {
            return [];
        },
    },
});

// 🔥 Export clearCart also
export const {
    addToCart,
    increaseQty,
    decreaseQty,
    clearCart, // ✅ important
} = cartSlice.actions;

export default cartSlice.reducer;
