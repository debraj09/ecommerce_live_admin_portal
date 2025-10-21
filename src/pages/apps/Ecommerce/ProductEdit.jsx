import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Table } from "react-bootstrap";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BannerAdd from "./bannerAdd";
const ProductAdd = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });
    const [error, setError] = useState(null);
    
    const API_BASE_URL = "https://ecomm.braventra.in/api";

    // Fetch categories from the API dynamically
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/category`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                setCategories(data.data.categories);
                setIsLoading(false);
            } catch (err) {
                setError("Failed to fetch categories. Please try again later.");
                setIsLoading(false);
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Form validation schema
    const schemaResolver = yupResolver(yup.object().shape({
        name: yup.string().required("Please enter the product name"),
        description: yup.string().required("Please enter a short description"),
        long_description: yup.string().required("Please enter a product description"),
        price: yup.number().required("Please enter the price").typeError("Price must be a number"),
        stock_quantity: yup.number().required("Please enter the stock quantity").typeError("Stock must be a number"),
        category_id: yup.string().required("Please select a category"),
        image: yup.mixed().test('required', 'Please upload a product image', (value) => value && value.length > 0),
        variations: yup.array().of(
            yup.object().shape({
                name: yup.string().required("Variation name is required"),
                sku: yup.string().required("SKU is required"),
                size: yup.string(),
                color: yup.string(),
            })
        ),
    }));

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        reset
    } = useForm({
        resolver: schemaResolver,
        defaultValues: {
            variations: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variations",
    });
    
    // State for the preview image
    const [previewImage, setPreviewImage] = useState(null);

    // Handle image file selection for preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        const formData = new FormData();
        
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('long_description', data.long_description);
        formData.append('price', data.price);
        formData.append('stock_quantity', data.stock_quantity);
        formData.append('category_id', data.category_id);
        
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }

        if (data.variations.length > 0) {
            formData.append('variations', JSON.stringify(data.variations));
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/products/create`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }

            setSubmitStatus({ message: result.message, variant: 'success' });
            console.log('Product added successfully:', result);
            reset();
            setPreviewImage(null);
        } catch (error) {
            setSubmitStatus({ message: `Failed to add product: ${error.message}`, variant: 'danger' });
            console.error('There was an error adding the product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const FormInput = ({ name, label, type, placeholder, containerClass, register, errors, rows }) => {
        return (
            <Form.Group className={containerClass}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    type={type}
                    as={type === 'textarea' ? 'textarea' : 'input'}
                    rows={rows}
                    placeholder={placeholder}
                    {...register(name)}
                    isInvalid={!!errors[name]}
                />
                <Form.Control.Feedback type="invalid">
                    {errors[name]?.message}
                </Form.Control.Feedback>
            </Form.Group>
        );
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f9' }}>
            {submitStatus.message && (
                <Alert variant={submitStatus.variant} className="mb-3 text-center">
                    {submitStatus.message}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col lg={6}>
                        <Card>
                            <Card.Body>
                                <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                    General
                                </h5>
                                <FormInput
                                    name="name"
                                    label="Product Name"
                                    placeholder="e.g. Apple iMac"
                                    containerClass="mb-3"
                                    register={register}
                                    errors={errors}
                                />
                                <FormInput
                                    type="textarea"
                                    rows="3"
                                    name="description"
                                    label="Short Description"
                                    placeholder="Please enter a short summary"
                                    containerClass="mb-3"
                                    register={register}
                                    errors={errors}
                                />
                                <FormInput
                                    type="textarea"
                                    rows="5"
                                    name="long_description"
                                    label="Product Description"
                                    placeholder="Please enter a detailed product description"
                                    containerClass="mb-3"
                                    register={register}
                                    errors={errors}
                                />
                                <FormInput
                                    type="number"
                                    name="price"
                                    label="Price"
                                    placeholder="Enter amount"
                                    containerClass="mb-3"
                                    register={register}
                                    errors={errors}
                                />
                                <FormInput
                                    type="number"
                                    name="stock_quantity"
                                    label="Stock Quantity"
                                    placeholder="Enter stock quantity"
                                    containerClass="mb-3"
                                    register={register}
                                    errors={errors}
                                />
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    {isLoading && <p>Loading categories...</p>}
                                    {error && <p className="text-danger">{error}</p>}
                                    {!isLoading && !error && (
                                        <Form.Select 
                                            name="category_id"
                                            {...register("category_id")}
                                            isInvalid={!!errors.category_id}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                    <Form.Control.Feedback type="invalid">
                                        {errors.category_id?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card>
                            <Card.Body>
                                <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                                    Product Image
                                </h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        name="image" 
                                        {...register('image')}
                                        onChange={handleImageChange}
                                        isInvalid={!!errors.image}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.image?.message}
                                    </Form.Control.Feedback>
                                    {previewImage && (
                                        <div className="mt-3 text-center">
                                            <h6>Image Preview:</h6>
                                            <img src={previewImage} alt="Product Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                        </div>
                                    )}
                                </Form.Group>
                            </Card.Body>
                        </Card>
                        <Card>
                             <Card.Body>
                                <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                                    Product Variations
                                </h5>
                                <p>Add different variations for your product (e.g., size, color, SKU).</p>
                                <Button 
                                    variant="outline-primary" 
                                    onClick={() => append({ name: "", sku: "", size: "", color: "" })}
                                    className="mb-3"
                                >
                                    Add Variation
                                </Button>
                                {fields.length > 0 && (
                                    <div className="table-responsive">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>SKU</th>
                                                    <th>Size</th>
                                                    <th>Color</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fields.map((field, index) => (
                                                    <tr key={field.id}>
                                                        <td>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="e.g. 500mg"
                                                                {...register(`variations.${index}.name`)}
                                                                isInvalid={!!errors.variations?.[index]?.name}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="e.g. ABC123"
                                                                {...register(`variations.${index}.sku`)}
                                                                isInvalid={!!errors.variations?.[index]?.sku}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="e.g. Large"
                                                                {...register(`variations.${index}.size`)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="e.g. Red"
                                                                {...register(`variations.${index}.color`)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Button variant="danger" onClick={() => remove(index)}>
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="text-center mb-3">
                            <Button type="button" variant="light" className="me-1">
                                Cancel
                            </Button>
                            <Button type="submit" variant="success" className="me-1" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Product'}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </form>
            {/* <div style={{marginTop:20}}>
                <BannerAdd/>
            </div> */}
        </div>
    );
};

export default ProductAdd;
