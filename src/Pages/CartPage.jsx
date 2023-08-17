import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import cartService from "../service/cart.service";
// import { useCartContext } from "../context/cart";
import { Button, Typography } from "@mui/material";
import shared from "../utils/shared";
import orderService from "../service/order.service";

import { useSelector, useDispatch } from "react-redux";
import { fetchCartData, removeFromCart } from "../State/Slice/cartSlice";
import { setCartData } from "../State/Slice/cartSlice";

const CartPage = () => {
    // const authContext = useAuthContext();
    // const cartContext = useCartContext();
    const dispatch = useDispatch();
    // Get the dispatch function
    // Access the cart data from the Redux store
    const cartData = useSelector((state) => state.cart.cartData);
    const navigate = useNavigate();
    const authData = useSelector((state) => state.auth.user);
    const [cartList, setCartList] = useState([]);
    const [itemsInCart, setItemsInCart] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const getTotalPrice = (itemList) => {
        let totalPrice = 0;
        itemList.forEach((item) => {
            const itemPrice = item.quantity * parseInt(item.book.price);
            totalPrice = totalPrice + itemPrice;
        });
        setTotalPrice(totalPrice);
    };

    // useEffect(() => {
    //   setCartList(cartContext.cartData);
    //   setItemsInCart(cartContext.cartData.length);
    //   getTotalPrice(cartContext.cartData);
    // }, [cartContext.cartData]);

    useEffect(() => {
        setCartList(cartData);
        setItemsInCart(cartData.length);
        getTotalPrice(cartData);
    }, [cartData]);

    // const removeItem = async (id) => {
    //   try {
    //     const res = await cartService.removeItem(id);
    //     if (res) {
    //       cartContext.updateCart();
    //     }
    //   } catch (error) {
    //     toast.error("Something went wrong!");
    //   }
    // };
    const removeItem = async (id) => {
        try {
            const res = await cartService.removeItem(id);
            if (res) {
                dispatch(removeFromCart(id)); // Dispatch the action to remove item from cart
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };
    // const updateQuantity = async (cartItem, inc) => {
    //   const currentCount = cartItem.quantity;
    //   const quantity = inc ? currentCount + 1 : currentCount - 1;
    //   if (quantity === 0) {
    //     toast.error("Item quantity should not be zero");
    //     return;
    //   }

    //   try {
    //     const res = await cartService.updateItem({
    //       id: cartItem.id,
    //       userId: cartItem.userId,
    //       bookId: cartItem.book.id,
    //       quantity,
    //     });
    //     if (res) {
    //       const updatedCartList = cartList.map((item) =>
    //         item.id === cartItem.id ? { ...item, quantity } : item
    //       );
    //       cartContext.updateCart(updatedCartList);
    //       const updatedPrice =
    //         totalPrice +
    //         (inc
    //           ? parseInt(cartItem.book.price)
    //           : -parseInt(cartItem.book.price));
    //       setTotalPrice(updatedPrice);
    //     }
    //   } catch (error) {
    //     toast.error("Something went wrong!");
    //   }
    // };
    const updateQuantity = async (cartItem, inc) => {
        const currentCount = cartItem.quantity;
        const quantity = inc ? currentCount + 1 : currentCount - 1;
        if (quantity === 0) {
            toast.error("Item quantity should not be zero");
            return;
        }

        try {
            const res = await cartService.updateItem({
                id: cartItem.id,
                userId: cartItem.userId,
                bookId: cartItem.book.id,
                quantity,
            });
            if (res) {
                const updatedCartList = cartList.map((item) =>
                    item.id === cartItem.id ? { ...item, quantity } : item
                );
                dispatch(setCartData(updatedCartList)); // Dispatch the action to update cart data in the Redux store
                const updatedPrice =
                    totalPrice +
                    (inc
                        ? parseInt(cartItem.book.price)
                        : -parseInt(cartItem.book.price));
                setTotalPrice(updatedPrice);
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    // const placeOrder = async () => {
    //   if (authContext.user.id) {
    //     const userCart = await cartService.getList(authContext.user.id);
    //     if (userCart.length) {
    //       try {
    //         let cartIds = userCart.map((element) => element.id);
    //         const newOrder = {
    //           userId: authContext.user.id,
    //           cartIds,
    //         };
    //         const res = await orderService.placeOrder(newOrder);
    //         if (res) {
    //           cartContext.updateCart();
    //           navigate("/");
    //           toast.success(shared.messages.ORDER_SUCCESS);
    //         }
    //       } catch (error) {
    //         toast.error(`Order cannot be placed ${error}`);
    //       }
    //     } else {
    //       toast.error("Your cart is empty");
    //     }
    //   }
    // };
    const placeOrder = async () => {
        if (authData.id) {
            const userCart = await cartService.getList(authData.id);
            if (userCart.length) {
                try {
                    let cartIds = userCart.map((element) => element.id);
                    const newOrder = {
                        userId: authData.id,
                        cartIds,
                    };
                    const res = await orderService.placeOrder(newOrder);
                    if (res) {
                        dispatch(fetchCartData(authData.id)); // Dispatch the action to fetch updated cart data
                        navigate("/");
                        toast.success(shared.messages.ORDER_SUCCESS);
                    }
                } catch (error) {
                    toast.error(`Order cannot be placed ${error}`);
                }
            } else {
                toast.error("Your cart is empty");
            }
        }
    };

    return (
        <div className="flex-1 mb-5" style={{ width: "80%", margin: "auto" }}>
            <Typography
                variant="h3"
                sx={{
                    marginTop: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#474747",
                }}
            >
                Shopping Cart
            </Typography>
            <div
                className="d-flex justify-content-between mt-3"
                style={{ display: "flex", marginTop: "0px" }}
            >
                <div className="flex-1">
                    <Button
                        variant="contained"
                        sx={{
                            color: "white",
                            backgroundColor: "#80BF32",
                            "&:hover": {
                                backgroundColor: "#10AE10", // Change the hover background color
                            },
                            textTransform: "capitalize",
                            fontWeight: "bold",
                        }}
                        onClick={placeOrder}
                    >
                        Place order
                    </Button>
                </div>

                <div className="flex-1" style={{}}>
                    <Button
                        variant="contained"
                        sx={{
                            color: "white",
                            backgroundColor: "#f14d54",
                            "&:hover": {
                                backgroundColor: "#f14d54", // Change the hover background color
                            },
                            textTransform: "capitalize",
                            fontWeight: "bold",
                        }}
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>

            <div
                className="flex font-semibold justify-between"
                style={{ width: "30%", margin: "0px 35%", textAlign: "center" }}
            >
                <Typography variant="h6">
                    My Shopping Bag ({itemsInCart} Items)
                </Typography>
                <span>Total price: {totalPrice}</span>
            </div>
            <div
                className="flex-1 mt-4"
                style={{ display: "flex", flexWrap: "wrap" }}
            >
                {cartList.map((cartItem) => {
                    return (
                        <div
                            className="flex border rounded-md shadow-lg p-2 mt-4 mx-2"
                            key={cartItem.id}
                            style={{
                                display: "flex",
                                marginTop: "10px",
                                flexDirection: "column",
                                width: "23%",
                            }}
                        >
                            <div className="text-center w-32 h-40 overflow-hidden rounded-sm">
                                <img
                                    src={cartItem.book.base64image}
                                    alt="BookImage"
                                    className="h-full w-full object-cover"
                                    style={{ width: "200px", height: "200px" }}
                                />
                            </div>
                            <div className="flex">
                                <div className="flex-1 text-center pt-2">
                                    <p className="brand text-xl font-semibold">
                                        {cartItem.book.name}
                                    </p>
                                    <p className="text-[#f14d54] mt-2">
                                        Cart item name
                                    </p>
                                    <div>
                                        <span className="current-price font-semibold text-right">
                                            MRP &#8377; {cartItem.book.price}
                                        </span>
                                    </div>
                                    <div
                                        className="flex mt-3"
                                        style={{ margin: "5px" }}
                                    >
                                        <Button
                                            sx={{
                                                color: "white",
                                                backgroundColor: "#f14d54",
                                                "&:hover": {
                                                    backgroundColor: "#f14d54", // Change the hover background color
                                                },
                                                fontWeight: "bold",
                                            }}
                                            size="small"
                                            onClick={() =>
                                                updateQuantity(cartItem, true)
                                            }
                                        >
                                            +
                                        </Button>
                                        <span
                                            className=" inline-block w-8 text-center leading-8 mx-2"
                                            style={{ margin: "10px" }}
                                        >
                                            {cartItem.quantity}
                                        </span>
                                        <Button
                                            sx={{
                                                color: "white",
                                                backgroundColor: "#f14d54",
                                                "&:hover": {
                                                    backgroundColor: "#f14d54", // Change the hover background color
                                                },
                                                fontWeight: "bold",
                                            }}
                                            size="small"
                                            onClick={() =>
                                                updateQuantity(cartItem, false)
                                            }
                                        >
                                            -
                                        </Button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center flex-1 mt-3">
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderColor: "#f14d54",
                                            "&:hover": {
                                                backgroundColor: "#f14d54", // Change the hover background color
                                                color: "white",
                                            },
                                            textTransform: "capitalize",
                                            width: "90px",
                                            color: "#f14d54",
                                            marginTop: "10px",
                                        }}
                                        onClick={() => removeItem(cartItem.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CartPage;
