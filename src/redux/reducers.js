import {combineReducers} from "redux";
import {
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    DELETE_ALL_PRODUCT,
    CHECK_PRODUCT,
    VISIBILITY_FILTER,
    CHECK_ALL_PRODUCT,
} from "./action-types";

const initialState = {
    lists: [
        {
            name: "iphone 12",
            description: "Apple",
            category: "Mobile",
            expiryDate: "2021-05-13",
            costPrice: "40000",
            sellPrice: "65000",
            discount: "10",
            discountedSellPrice: "58500",
            gst: "18",
            finalPrice: "69030",
            checked: false,
        },
        {
            name: "macbook pro",
            description: "Apple",
            category: "Laptop",
            expiryDate: "2021-05-13",
            costPrice: "40000",
            sellPrice: "65000",
            discount: "10",
            discountedSellPrice: "58500",
            gst: "18",
            finalPrice: "69030",
            checked: false,
        },
    ],
    checkedLength: 0,
    visibilityFilter: [],
};

const list = function (state = initialState, action) {
    switch (action.type) {
        case ADD_PRODUCT: {
            const product = action.data;
            return {
                ...state,
                lists: [...state.lists, product],
            };
        }
        case UPDATE_PRODUCT: {
            const {idx, product} = action.data;
            const copy = {...state};
            const newlists = [...copy.lists];
            newlists[idx] = product;
            return {...state, lists: newlists};
        }
        case DELETE_PRODUCT: {
            const idx = action.idx;
            const copy = {...state};
            const newlists = [...copy.lists];
            console.log(idx)
            newlists[idx].checked = false;
            const copyCheckedLength =
                copy.checkedLength !== 0 ? copy.checkedLength - 1 : 0;
            newlists.splice(idx, 1);

            return {
                ...state,
                checkedLength: copyCheckedLength,
                lists: newlists,
            };
        }
        case DELETE_ALL_PRODUCT: {
            const copy = {...state};
            const copylists = [...copy.lists];
            const newlists = copylists.filter((item) => {
                return item.checked !== true;
            });
            return {
                ...state,
                checkedLength: 0,
                lists: newlists,
            };
        }
        case CHECK_PRODUCT: {
            const idx = action.idx;
            const copy = {...state};
            const copylists = [...copy.lists];
            const copyCheckedLength = !copylists[idx].checked
                ? copy.checkedLength + 1
                : copy.checkedLength - 1;
            copylists[idx].checked = !copylists[idx].checked;

            return {
                ...state,
                checkedLength: copyCheckedLength,
                lists: copylists,
            };
        }
        case CHECK_ALL_PRODUCT: {
            const checked = action.payload;
            const copy = {...state};
            const copylists = [...copy.lists];
            const copyCheckedLength = checked ? copylists.length : 0;
            copylists.forEach((item) => {
                item.checked = checked;
            });
            return {
                ...state,
                checkedLength: copyCheckedLength,
                lists: copylists,
            };
        }
        case VISIBILITY_FILTER: {
            const {filter, checked} = action.data;
            const copyVisibilityFilter = [...state.visibilityFilter];
            let newVisibilityFilter;
            if (checked) {
                newVisibilityFilter = [...copyVisibilityFilter, filter]
            } else {
                newVisibilityFilter = copyVisibilityFilter.filter((item) => {
                    return item !== filter;
                });
            }
            return {
                ...state,
                visibilityFilter: newVisibilityFilter,
            };
        }
        default: {
            return state;
        }
    }
};

export default combineReducers({list});
