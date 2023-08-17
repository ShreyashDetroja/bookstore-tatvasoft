import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as Yup from "yup";
import { toast } from "react-toastify";

import {
    Button,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { Formik } from "formik";

import userService from "../../service/user.service";
import shared from "../../utils/shared";
import { useSelector } from "react-redux";
function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const authData = useSelector((state) => state.auth.user);
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState();

    const initialValues = {
        name: "",
        price: "",
        categoryId: 0,
        description: "",
        base64image: "",
    };

    const [initialValuestate, setInitialValueState] = useState(initialValues);

    useEffect(() => {
        getRoles();
    }, []);
    useEffect(() => {
        if (id) {
            getUserById();
        }
        // eslint-disable-next-line
    }, [id]);
    useEffect(() => {
        if (user && roles.length) {
            const roleId = roles.find((role) => role.name === user?.role)?.id;

            setInitialValueState({
                id: user.id,
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                roleId,
                password: user.password,
            });
        }
    }, [user, roles]);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        roleId: Yup.number().required("Role is required"),
    });

    const getUserById = () => {
        userService.getById(Number(id)).then((res) => {
            if (res) {
                setUser(res);
            }
        });
    };

    const getRoles = () => {
        userService.getAllRoles().then((res) => {
            if (res) {
                setRoles(res);
            }
        });
    };
    const onSubmit = (values) => {
        const updatedValue = {
            ...values,
            role: roles.find((r) => r.id === values.roleId).name,
        };
        userService
            .update(updatedValue)
            .then((res) => {
                if (res) {
                    toast.success(shared.messages.UPDATED_SUCCESS);
                    navigate("/user");
                }
            })
            .catch((e) => toast.error(shared.messages.UPDATED_FAIL));
    };

    return (
        <div className="flex-1 ml-40 mr-40">
            <Typography
                variant="h4"
                sx={{
                    marginTop: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#474747",
                }}
            >
                Edit User
            </Typography>

            {/* <div className="flex items-center justify-center mt-5">
                <div className="border-t-2 border-[#f14d54] w-32"></div>
            </div> */}
            <Formik
                initialValues={initialValuestate}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit} className="flex-1 ">
                        <div
                            className="grid grid-cols-2 gap-2 mt-3 "
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <FormControl style={{ width: "60%" }}>
                                <label style={{ marginBottom: "0.5rem" }}>
                                    First Name*
                                </label>
                                <TextField
                                    size="small"
                                    type="text"
                                    name="firstName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstName}
                                    sx={{
                                        height: "40px",
                                        marginBottom: "0.5rem",
                                    }}
                                />
                                <div className="text-red-600">
                                    {errors.firstName &&
                                        touched.firstName &&
                                        errors.firstName}
                                </div>
                            </FormControl>
                            <FormControl style={{ width: "60%" }}>
                                <label style={{ marginBottom: "0.5rem" }}>
                                    Last Name*
                                </label>
                                <TextField
                                    size="small"
                                    type="text"
                                    name="lastName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastName}
                                    sx={{
                                        height: "40px",
                                        marginBottom: "0.5rem",
                                    }}
                                />
                                <div className="text-red-600">
                                    {errors.lastName &&
                                        touched.lastName &&
                                        errors.lastName}
                                </div>
                            </FormControl>

                            <FormControl style={{ width: "60%" }}>
                                <label style={{ marginBottom: "0.5rem" }}>
                                    Email Address*
                                </label>
                                <TextField
                                    size="small"
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    sx={{
                                        height: "40px",
                                        marginBottom: "0.5rem",
                                    }}
                                />
                                <div className="text-red-600">
                                    {errors.email &&
                                        touched.email &&
                                        errors.email}
                                </div>
                            </FormControl>
                            {values.id !== authData.id && (
                                <FormControl
                                    style={{ width: "60%" }}
                                    disabled={values.id === authData.id}
                                >
                                    <label
                                        htmlFor="roleId"
                                        style={{ marginBottom: "0.5rem" }}
                                    >
                                        Role*
                                    </label>
                                    <Select
                                        name="roleId"
                                        label="RoleId"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={Number(values.roleId)}
                                        size="small"
                                        disabled={values.id === authData.id}
                                        style={{ marginBottom: "0.5rem" }}
                                    >
                                        {roles.length > 0 &&
                                            roles.map((role) => (
                                                <MenuItem
                                                    value={role.id}
                                                    key={"name" + role.id}
                                                >
                                                    {role.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            )}
                        </div>
                        <div
                            className="mt-16"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "2rem",
                            }}
                        >
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    color: "white",
                                    backgroundColor: "#80BF32",
                                    "&:hover": {
                                        backgroundColor: "#80BF32",
                                    },
                                    marginLeft: "8px",
                                    width: "100px",
                                }}
                                disableElevation
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    navigate("/user");
                                }}
                                sx={{
                                    color: "white",
                                    backgroundColor: "#f14d54",
                                    "&:hover": {
                                        backgroundColor: "#f14d54",
                                    },
                                    marginLeft: "8px",
                                    width: "100px",
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default EditUser;
