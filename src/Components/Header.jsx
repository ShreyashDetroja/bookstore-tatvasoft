import { Button, Divider } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import logo from "../assets/logo.jpg";
import { HiShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../State/Slice/cartSlice";
import { signOut } from "../State/Slice/authSlice";
import shared from "../utils/shared";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartData = useSelector((state) => state.cart.cartData);
    const authData = useSelector((state) => state.auth.user);

    const logOut = () => {
        // authContext.signOut();
        dispatch(signOut());
    };

    useEffect(() => {
        const userId = authData.id;

        if (userId && cartData.length === 0) {
            dispatch(fetchCartData(userId));
        }
    }, [authData.id, cartData.length, dispatch]);

    const items = useMemo(() => {
        return shared.NavigationItems.filter(
            (item) =>
                !item.access.length || item.access.includes(authData.roleId)
        );
    }, [authData]);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "20px",
                    alignItems: "center",
                }}
            >
                <img
                    src={logo}
                    alt="TatvaSoft_Logo"
                    className="h-24 ml-40 w-44"
                    style={{ width: "150px" }}
                />

                <div className="mr-40  space-x-1 flex">
                    {!authData.id && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                // justifyContent: "center",
                                alignItems: "center",
                                width: "23rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    variant="text"
                                    sx={{
                                        color: "#f14d54",
                                        textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    Login
                                </Button>
                                <Divider
                                    orientation="vertical"
                                    variant="middle"
                                    flexItem
                                    sx={{ backgroundColor: "#f14d54" }}
                                />
                                <Button
                                    variant="text"
                                    sx={{
                                        color: "#f14d54",
                                        textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                        navigate("/register");
                                    }}
                                >
                                    Register
                                </Button>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="outlined"
                        sx={{
                            color: "#f14d54",
                            borderColor: "#f14d54",
                            textTransform: "capitalize",
                            fontWeight: "bold",
                            position: "absolute",
                            top: "2.5rem",
                            right: "30px",
                        }}
                        startIcon={<HiShoppingCart />}
                        onClick={() => {
                            navigate("/cart-page");
                        }}
                    >
                        {cartData.length}
                        <span
                            style={{
                                color: "black",
                                marginLeft: "4px",
                                fontWeight: "normal",
                            }}
                        >
                            cart
                        </span>
                    </Button>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginRight: "20px",
                        }}
                    >
                        {items.map((item, index) => (
                            <div
                                key={`${item.name}-${item.route}-${index}`}
                                className="flex"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <Button
                                    variant="text"
                                    sx={{
                                        color: "#f14d54",
                                        textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                        navigate(item.route);
                                    }}
                                >
                                    {item.name}
                                </Button>
                                {index !== items.length - 1 && (
                                    <Divider
                                        orientation="vertical"
                                        variant="middle"
                                        flexItem
                                        sx={{ backgroundColor: "#f14d54" }}
                                    />
                                )}
                            </div>
                        ))}

                        {!!authData.id ? (
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#f14d54",
                                    "&:hover": {
                                        backgroundColor: "#f14d54", // Change the hover background color
                                    },
                                    textTransform: "capitalize",
                                    marginRight: "6rem",
                                }}
                                onClick={() => {
                                    logOut();
                                }}
                            >
                                Logout
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
