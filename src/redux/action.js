import {
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    DELETE_ALL_PRODUCT,
    CHECK_PRODUCT,
    CHECK_ALL_PRODUCT,
    VISIBILITY_FILTER,
} from "./action-types";

export const addProduct = (data) => ({
    type: ADD_PRODUCT,
    data,
});

export const updateProduct = (data) => ({
    type: UPDATE_PRODUCT,
    data,
});

export const deleteProduct = (idx) => ({
    type: DELETE_PRODUCT,
    idx,
});

export const deleteAllProduct = () => ({
    type: DELETE_ALL_PRODUCT,
});

export const checkProduct = (idx) => ({
    type: CHECK_PRODUCT,
    idx,
});

export const checkAllProduct = (payload) => ({
    type: CHECK_ALL_PRODUCT,
    payload,
});

export const setVisibilityFilter = (data) => ({
    type: VISIBILITY_FILTER,
    data,
});