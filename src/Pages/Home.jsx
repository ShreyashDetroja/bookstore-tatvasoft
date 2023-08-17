import { Button, Pagination, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { defaultFilter } from "../Constant/constant";

import bookService from "../service/book.service";
import categoryService from "../service/category.service";
import shared from "../utils/shared";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../State/Slice/cartSlice";

function Home() {
    const [filters, setFilters] = useState(defaultFilter);
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState();
    // const authContext = useAuthContext();
    // const cartContext = useCartContext();
    const authData = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();
    const [bookResponse, setBookResponse] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });

    const searchAllBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
            setBookResponse(res);
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            searchAllBooks({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
            if (res) {
                setCategories(res);
            }
        });
    };
    useEffect(() => {
        getAllCategories();
    }, []);
    const books = useMemo(() => {
        const bookList = [...bookResponse.items];
        if (bookList) {
            bookList.forEach((element) => {
                element.category = categories.find(
                    (a) => a.id === element.categoryId
                )?.name;
            });
            return bookList;
        }
        return [];
    }, [categories, bookResponse]);

    const sortBook = (e) => {
        setSortBy(e.target.value);
        let bookList = [...bookResponse.items];
        if (e.target.value === "a-z") {
            bookList.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (e.target.value === "z-a") {
            bookList.sort((a, b) => b.name.localeCompare(a.name));
        }
        setBookResponse({ ...bookResponse, items: bookList });
    };

    const addToCart = (book) => {
        shared
            .addToCart(book, authData.id)
            .then((res) => {
                if (res.error) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    dispatch(fetchCartData(authData.id));
                    // dispatch(addtoCart(book)); // Dispatch the addToCart action
                }
            })
            .catch((err) => {
                toast.warning(err);
            });
    };

    return (
        <div
            className="flex-1 ml-40 mr-40"
            style={{ width: "100%", padding: "0px" }}
        >
            <Typography
                variant="h3"
                sx={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#474747",
                }}
            >
                Book Listing
            </Typography>
            {/* <div className="flex items-center justify-center m-5">
                <div className="border-t-2 border-black w-32"></div>
            </div> */}
            <div className="flex justify-between items-center">
                <div
                    className="flex items-center space-x-10"
                    style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        width: "40%",
                        margin: "auto",
                        marginTop: "30px",
                    }}
                >
                    <TextField
                        name="text"
                        placeholder="Search for books"
                        variant="outlined"
                        size="small"
                        onChange={(e) => {
                            setFilters({
                                ...filters,
                                keyword: e.target.value,
                                pageIndex: 1,
                            });
                        }}
                        sx={{
                            backgroundColor: "white",
                            fontStyle: "italic",
                            "& .MuiInputBase-input": {
                                fontStyle: "normal",
                            },
                        }}
                    />
                    <div
                        className="flex"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                marginRight: "10px",
                                width: "100px",
                                textAlign: "right",
                            }}
                        >
                            Sort By
                        </Typography>

                        <select
                            className="form-select"
                            onChange={sortBook}
                            value={sortBy}
                        >
                            <option value="a-z">a - z</option>
                            <option value="z-a">z - a</option>
                        </select>
                    </div>
                </div>
                <Typography
                    variant="h6"
                    style={{
                        textAlign: "center",
                        fontSize: "0.8rem",
                        marginTop: "20px",
                    }}
                >
                    Total - {bookResponse.totalItems} items found
                </Typography>
            </div>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: "10px",
                }}
            >
                {books.map((book, index) => (
                    <div
                        className="card border shadow rounded-lg shadow-xl flex flex-col space-y-4"
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid black",
                            width: "300px",
                            margin: "10px",
                        }}
                    >
                        <div className="card-img-top w-full h-56 overflow-hidden rounded-lg">
                            <img
                                src={book.base64image}
                                alt=""
                                className="w-full h-full object-cover"
                                style={{
                                    width: "300px",
                                    height: "300px",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                            <div>
                                <h2 className="card-title text-xl font-bold line-clamp-1 text-[#474747] ">
                                    {book.name}
                                </h2>
                                <p className="card-subtitle text-secondary">
                                    {book.category}
                                </p>
                                <p className="card-text line-clamp-2 h-14 mt-2">
                                    {book.description}
                                </p>
                                <p className=" mb-2 text-xl text-gray-500">
                                    MRP
                                    <span className="mx-1">&#8377;</span>
                                    {book.price}
                                </p>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    sx={{
                                        color: "white",
                                        backgroundColor: "#f14d54",
                                        "&:hover": {
                                            backgroundColor: "#f14d54", // Change the hover background color
                                        },

                                        fontWeight: "bold",
                                    }}
                                    fullWidth
                                    onClick={() => addToCart(book)}
                                >
                                    add to cart
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <Pagination
                    sx={{
                        marginTop: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    count={bookResponse.totalPages}
                    page={filters.pageIndex}
                    onChange={(e, newPage) => {
                        setFilters({
                            ...filters,
                            pageIndex: newPage,
                        });
                    }}
                />
            </div>
        </div>
    );
}

export default Home;

// Attack on titan is a manga written by hajime iseyama. it is a story about a young boy who wants freedom from the constant fear of titans and wants to travel the world outside the walls. AOT touches variety of real world problems and it is a great mix of suspense, thrill, mystery and action.
