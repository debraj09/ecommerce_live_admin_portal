import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Row, Col, Card, Form, Button, Alert, Table } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ====================================================================
// FormInput Helper Component
// ====================================================================
const FormInput = ({ name, label, type, placeholder, containerClass, register, errors, rows }) => {
    const isTextarea = type === 'textarea';
    
    return (
        <Form.Group className={containerClass}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={isTextarea ? 'text' : type}
                as={isTextarea ? 'textarea' : 'input'}
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

// ====================================================================
// ProductEdit Component
// ====================================================================
const ProductEdit = () => {
    const { productId } = useParams();
    const navigate = useNavigate(); 

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProductLoading, setIsProductLoading] = useState(!!productId);
    const [productData, setProductData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const API_BASE_URL = "https://ecomm.braventra.in/api";
    const isEditing = !!productId;

    // Form validation schema
    const schemaResolver = yupResolver(yup.object().shape({
        name: yup.string().required("Please enter the product name"),
        description: yup.string().required("Please enter a short description"),
        long_description: yup.string().required("Please enter a product description"),
        price: yup.number().required("Please enter the price").typeError("Price must be a number").min(0.01, "Price must be greater than 0"),
        stock_quantity: yup.number().required("Please enter the stock quantity").typeError("Stock must be a number").integer("Stock must be an integer").min(0, "Stock must be non-negative"),
        category_id: yup.string().required("Please select a category"),
        image: yup.mixed().test('fileRequired', 'Product image is required for new products.', function(value) {
            return isEditing || (value && value.length > 0);
        }),
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
            name: '',
            description: '',
            long_description: '',
            price: 0,
            stock_quantity: 0,
            category_id: ''
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variations",
    });

    // 1. Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch from the general product/category endpoint
                const response = await fetch(`${API_BASE_URL}/products`); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if (data.data && data.data.categories) {
                    setCategories(data.data.categories);
                } else {
                    throw new Error("Invalid category data format.");
                }
                
                setIsLoading(false);
            } catch (err) {
                setError("Failed to fetch categories. Please try again later.");
                setIsLoading(false);
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, [API_BASE_URL]);


    // 2. Fetch Existing Product Data for Editing
    useEffect(() => {
        if (isEditing) {
            const fetchProductData = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
                    
                    if (!response.ok) {
                        const errorBody = await response.text();
                        throw new Error(`HTTP error ${response.status}: Failed to fetch product data. Server said: ${errorBody.slice(0, 100)}...`);
                    }
                    const data = await response.json();

                    if (data && data.data && typeof data.data === 'object') {
                        const product = data.data; 

                        // Mapping API keys ('base_price', 'base_stock') to form field names ('price', 'stock_quantity')
                        reset({
                            name: product.name || '',
                            description: product.description || '',
                            long_description: product.long_description || '',
                            price: parseFloat(product.base_price) || 0, 
                            stock_quantity: product.base_stock || 0,     
                            category_id: product.category_id ? String(product.category_id) : '',
                            variations: product.variations.map(v => ({
                                name: v.name,
                                sku: v.sku,
                                size: v.size,
                                color: v.color,
                            })) || [],
                        });

                        // For image preview
                        if (product.image_url) {
                            setPreviewImage(`https://ecomm.braventra.in${product.image_url}`);
                        }
                        setProductData(product); 
                    } else {
                        throw new Error("Invalid product data format received.");
                    }

                    setIsProductLoading(false);
                } catch (err) {
                    console.error("Error fetching product data:", err);
                    setError(`Failed to load existing product data: ${err.message}`);
                    setIsProductLoading(false);
                }
            };
            fetchProductData();
        } else {
            setIsProductLoading(false);
        }
    }, [isEditing, productId, API_BASE_URL, reset]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else if (productData && productData.image_url) {
            setPreviewImage(`https://ecomm.braventra.in${productData.image_url}`);
        } else {
            setPreviewImage(null);
        }
    };


    // ====================================================================
    // Handle form submission: UPDATE/CREATE logic (FIXED for your backend)
    // ====================================================================
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });
        setError(null); 

        let endpoint;
        let method;
        
        if (isEditing) {
            // FIX: Match the backend route: router.put('/edit/:id', ...)
            endpoint = `${API_BASE_URL}/products/edit/${productId}`; 
            // FIX: Match the backend method: router.put(...)
            method = 'PUT'; 
        } else {
            endpoint = `${API_BASE_URL}/products/create`;
            method = 'POST';
        }

        const formData = new FormData();
        
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('long_description', data.long_description);
        
        // Mapping form field names to DB columns (price, stock_quantity)
        // Note: Your backend uses 'price' and 'stock_quantity' directly in the PUT query,
        // so we'll send the data using those names, even if the FETCH was different.
        formData.append('price', data.price);        
        formData.append('stock_quantity', data.stock_quantity); 
        
        formData.append('category_id', data.category_id);
        
        // Handle image file
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }
        
        // If editing and we have an existing image, send the old URL for deletion logic in the backend
        if (isEditing && productData?.image_url) {
            formData.append('old_image_url', productData.image_url);
        }

        // The variations logic is missing from your original backend PUT, but the frontend 
        // will still submit this data. It will be ignored by your current backend PUT route.
        if (data.variations.length > 0) {
            formData.append('variations', JSON.stringify(data.variations));
        }
        
        try {
            const response = await fetch(endpoint, {
                method: method,
                body: formData,
            });
            
            // FIX: Check response.ok (status 200-299) before attempting to parse JSON
            if (!response.ok) {
                // Read the response body as text to get the actual error message
                const errorText = await response.text();
                // This prevents the SyntaxError from non-JSON responses like "Endpoint Not Found."
                throw new Error(`Server returned status ${response.status}. Error: ${errorText || response.statusText}`);
            }

            // Parse JSON 
            const result = await response.json();

            const successMessage = isEditing ? 'Product updated successfully!' : 'Product added successfully!';
            setSubmitStatus({ message: successMessage, variant: 'success' });
            
            if (!isEditing) {
                // Clear form for new product creation
                reset();
                setPreviewImage(null);
            }
            
        } catch (error) {
            // Display the detailed error message in the alert
            setSubmitStatus({ message: `Failed to ${isEditing ? 'update' : 'add'} product: ${error.message}`, variant: 'danger' });
            console.error('There was an error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || isProductLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-2">Loading {isEditing ? 'product data' : 'categories'}...</span>
            </div>
        );
    }
    
    // Show error if initial data fetching failed
    if (error && !submitStatus.message) {
         return <Alert variant="danger" className="text-center">{error}</Alert>
    }


    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f9' }}>
            <h4 className="mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h4>
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
                                    placeholder="e.g. Paracetamol 500mg"
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
                                    <Form.Label>Product Image {isEditing && "(Optional to Change)"}</Form.Label>
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
                                            <img src={previewImage} alt="Product Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} />
                                        </div>
                                    )}
                                </Form.Group>
                            </Card.Body>
                        </Card>
                        <Card className="mt-3">
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
                                                     <th>Size (Opt.)</th>
                                                     <th>Color (Opt.)</th>
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
                                                             <Button variant="danger" size="sm" onClick={() => remove(index)}>
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
                        <div className="text-center mb-3 mt-3">
                            <Button type="button" variant="light" className="me-1" onClick={() => navigate('/products')}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="success" className="me-1" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default ProductEdit;