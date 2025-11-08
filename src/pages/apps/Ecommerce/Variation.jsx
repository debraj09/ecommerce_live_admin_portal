import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Table, Modal, Badge } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaTags } from 'react-icons/fa';

// Define the base URL for the API
const API_BASE_URL = "https://ecomm.braventra.in/api"; 
const VARIATION_API_URL = `${API_BASE_URL}/variations`;
const PRODUCT_API_URL = `${API_BASE_URL}/products`; // Assuming this exists to fetch product names

// ====================================================================
// FormInput Helper Component (Re-used for consistency)
// ====================================================================
const FormInput = ({ name, label, type, placeholder, containerClass, register, errors, readOnly, children }) => {
    return (
        <Form.Group className={containerClass}>
            <Form.Label>{label}</Form.Label>
            {type === 'select' ? (
                <Form.Select
                    {...register(name)}
                    isInvalid={!!errors[name]}
                    disabled={readOnly}
                >
                    {children}
                </Form.Select>
            ) : (
                <Form.Control
                    type={type}
                    placeholder={placeholder}
                    {...register(name)}
                    isInvalid={!!errors[name]}
                    readOnly={readOnly}
                />
            )}
            <Form.Control.Feedback type="invalid">
                {errors[name]?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
};

// ====================================================================
// Variation Manager Component
// ====================================================================
const Variation = () => {
    const [products, setProducts] = useState([]); 
    const [selectedProductId, setSelectedProductId] = useState('');
    const [variants, setVariants] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });

    // Modal States
    const [createModalShow, setCreateModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [currentAttribute, setCurrentAttribute] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);


    // --- Creation Validation Schema ---
    const createSchema = yup.object().shape({
        product_id: yup.number().typeError("Select product").required("Product is required").positive("Must be positive"),
        sku: yup.string().required("SKU is required").max(50),
        price_modifier: yup.number().typeError("Modifier must be a number").required("Modifier is required").min(0, "Cannot be negative"),
        attributes: yup.array().of(
            yup.object().shape({
                type: yup.string().required("Type is required").max(50),
                value: yup.string().required("Value is required").max(50),
            })
        ).min(1, "At least one attribute is required"),
    });

    // --- Edit Validation Schema ---
    const editSchema = yup.object().shape({
        variation_type: yup.string().max(50).nullable(true),
        variation_value: yup.string().max(50).nullable(true),
        price_modifier: yup.number().typeError("Modifier must be a number").min(0, "Cannot be negative").nullable(true),
    });

    // Use separate form instances for clarity
    const createForm = useForm({
        resolver: yupResolver(createSchema),
        defaultValues: { product_id: '', sku: '', price_modifier: 0, attributes: [{ type: 'Size', value: '' }] },
    });
    const { fields, append, remove } = useFieldArray({ control: createForm.control, name: "attributes" });
    
    const editForm = useForm({
        resolver: yupResolver(editSchema),
    });
    
    // ====================================================================
    // Data Fetching Functions
    // ====================================================================

    // Fetch all products for the main dropdown
    const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
            // NOTE: Assuming your /api/products returns data.data.products or data.products
            const response = await fetch(PRODUCT_API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            // Adjust this line based on your actual product API response structure
            setProducts(data.data && data.data.products ? data.data.products : data.data || []); 
        } catch (err) {
            console.error("Error fetching products:", err);
            setSubmitStatus({ message: `Failed to fetch products: ${err.message}`, variant: 'danger' });
        } finally {
            setIsProductsLoading(false);
        }
    };
    
    // Fetch variations for the selected product
    const fetchVariations = async (productId) => {
        if (!productId) {
            setVariants([]);
            return;
        }

        setIsLoading(true);
        setSubmitStatus({ message: '', variant: '' });
        try {
            const response = await fetch(`${VARIATION_API_URL}/${productId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.error || `Server returned status ${response.status}`);
            }
            const data = await response.json();
            // The backend groups the data by SKU and returns an array in data.data
            setVariants(data.data || []);
        } catch (err) {
            console.error("Error fetching variations:", err);
            setSubmitStatus({ message: `Failed to fetch variations: ${err.message}`, variant: 'danger' });
            setVariants([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Automatically refetch variants when a product is selected
        fetchVariations(selectedProductId);
    }, [selectedProductId]);
    
    // Helper to get product name
    const getProductNameById = (productId) => {
        const product = products.find(p => p.product_id === parseInt(productId));
        return product ? product.name : `Product ID ${productId}`;
    };

    // ====================================================================
    // Modal Management
    // ====================================================================

    const openCreateModal = () => {
        // Use the currently selected product ID as the default for convenience
        createForm.reset({ product_id: selectedProductId || '', sku: '', price_modifier: 0, attributes: [{ type: 'Size', value: '' }] });
        setCreateModalShow(true);
    };

    const handleCreateModalClose = () => {
        setCreateModalShow(false);
        setSubmitStatus({ message: '', variant: '' });
    };

    const openEditModal = (attributeRow, parentVariant) => {
        setCurrentAttribute({
            ...attributeRow, 
            sku: parentVariant.sku,
            product_id: parentVariant.product_id,
            price_modifier: parentVariant.price_modifier // Pass the SKU-level modifier
        });
        
        editForm.reset({
            variation_type: attributeRow.variation_type,
            variation_value: attributeRow.variation_value,
            // Only set price_modifier if this attribute row is the one that holds the price modifier data
            // We'll use the price_modifier from the parentVariant object for the form display
            price_modifier: parentVariant.price_modifier
        });
        setEditModalShow(true);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
        setSubmitStatus({ message: '', variant: '' });
        setCurrentAttribute(null);
    };

    // ====================================================================
    // CRUD Submission Handlers
    // ====================================================================

    // Handle Variant Creation 
    const handleCreateSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        const payload = {
            product_id: parseInt(data.product_id),
            sku: data.sku,
            // Ensure modifier is a number (or string) before sending, though backend handles parseFloat
            price_modifier: parseFloat(data.price_modifier), 
            attributes: data.attributes.filter(attr => attr.type && attr.value)
        };

        try {
            const response = await fetch(`${VARIATION_API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const responseData = await response.json().catch(() => ({ message: 'Successfully created variant, but no JSON response.' }));
            
            if (!response.ok) {
                const errorMsg = responseData.error || `Server returned status ${response.status}`;
                throw new Error(errorMsg);
            }

            setSubmitStatus({ message: responseData.message || 'New variant created successfully!', variant: 'success' });
            // Select the new product ID to auto-refresh the table
            setSelectedProductId(String(data.product_id)); 
            handleCreateModalClose();

        } catch (error) {
            setSubmitStatus({ message: `Failed to create variant: ${error.message}`, variant: 'danger' });
            console.error('Creation error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handle Attribute Update 
    const handleEditSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        const payload = {};
        if (data.variation_type !== currentAttribute.variation_type && data.variation_type !== undefined) {
            payload.variation_type = data.variation_type;
        }
        if (data.variation_value !== currentAttribute.variation_value && data.variation_value !== undefined) {
            payload.variation_value = data.variation_value;
        }
        // Price modifier update logic: The price_modifier field is updated 
        // on the specific attribute row that held it originally. 
        // Since we are showing it in the modal, we send it regardless if it was changed.
        // We ensure it's sent as a number/null.
        if (data.price_modifier !== undefined) {
             payload.price_modifier = data.price_modifier;
        }

        if (Object.keys(payload).length === 0) {
            setSubmitStatus({ message: 'No changes detected to update.', variant: 'info' });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${VARIATION_API_URL}/edit/${currentAttribute.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const responseData = await response.json().catch(() => ({ message: 'Successfully updated attribute, but no JSON response.' }));
            
            if (!response.ok) {
                const errorMsg = responseData.error || `Server returned status ${response.status}`;
                throw new Error(errorMsg);
            }

            setSubmitStatus({ message: responseData.message || 'Attribute updated successfully!', variant: 'success' });
            // Refresh variants for the currently selected product
            fetchVariations(selectedProductId); 
            handleEditModalClose();

        } catch (error) {
            setSubmitStatus({ message: `Failed to update attribute: ${error.message}`, variant: 'danger' });
            console.error('Update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Variant Deletion
    const handleDeleteVariant = async (sku) => {
        if (!window.confirm(`Are you sure you want to delete the entire variant with SKU: ${sku}? This action cannot be undone.`)) {
            return;
        }

        setSubmitStatus({ message: 'Deleting variant...', variant: 'info' });
        
        try {
            const response = await fetch(`${VARIATION_API_URL}/delete/${sku}`, {
                method: 'DELETE',
            });

            const responseData = await response.json().catch(() => ({ message: 'Successfully deleted variant, but no JSON response.' }));
            
            if (!response.ok) {
                const errorMsg = responseData.error || `Server returned status ${response.status}`;
                throw new Error(errorMsg);
            }
            
            setSubmitStatus({ message: responseData.message || `Variant ${sku} deleted successfully.`, variant: 'success' });
            fetchVariations(selectedProductId); 
            
        } catch (error) {
            setSubmitStatus({ message: `Failed to delete variant: ${error.message}`, variant: 'danger' });
            console.error('Deletion error:', error);
        }
    };

    // ====================================================================
    // Render Components
    // ====================================================================

    const CreateVariationModal = () => (
        <Modal show={createModalShow} onHide={handleCreateModalClose} backdrop="static" keyboard={false} size="xl">
            <Modal.Header closeButton>
                <Modal.Title><FaPlus className="me-2" /> Add New Product Variant (SKU)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
                    
                    <Row>
                        <Col md={6}>
                            <FormInput
                                name="product_id"
                                label="Parent Product"
                                type="select"
                                containerClass="mb-3"
                                register={createForm.register}
                                errors={createForm.formState.errors}
                                readOnly={isProductsLoading}
                            >
                                <option value="">Select a product</option>
                                {products.map((p) => (
                                    <option key={p.product_id} value={p.product_id}>
                                        {p.name} (ID: {p.product_id})
                                    </option>
                                ))}
                            </FormInput>
                        </Col>
                        <Col md={6}>
                            <FormInput
                                name="sku"
                                label="SKU (Stock Keeping Unit)"
                                type="text"
                                placeholder="e.g. TSHIRT-LG-RED"
                                containerClass="mb-3"
                                register={createForm.register}
                                errors={createForm.formState.errors}
                            />
                        </Col>
                    </Row>
                    
                    <FormInput
                        name="price_modifier"
                        label="Price Modifier (Added to Base Price)"
                        type="number"
                        placeholder="e.g. 5.00 (or 0 for no change)"
                        containerClass="mb-4"
                        register={createForm.register}
                        errors={createForm.formState.errors}
                    />

                    <Card className="mb-4">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">Variant Attributes (e.g., Size, Color)</h5>
                        </Card.Header>
                        <Card.Body>
                            {fields.map((field, index) => (
                                <Row key={field.id} className="mb-3 align-items-center">
                                    <Col md={4}>
                                        <FormInput
                                            name={`attributes.${index}.type`}
                                            label={`Attribute ${index + 1} Type`}
                                            type="text"
                                            placeholder="e.g., color"
                                            register={createForm.register}
                                            errors={createForm.formState.errors}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <FormInput
                                            name={`attributes.${index}.value`}
                                            label={`Attribute ${index + 1} Value`}
                                            type="text"
                                            placeholder="e.g., blue"
                                            register={createForm.register}
                                            errors={createForm.formState.errors}
                                        />
                                    </Col>
                                    <Col md={2} className="text-end">
                                        {index > 0 && (
                                            <Button variant="danger" size="sm" onClick={() => remove(index)}>
                                                <FaTimes />
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="outline-secondary" size="sm" onClick={() => append({ type: 'Size', value: '' })}>
                                <FaPlus className="me-1" /> Add Another Attribute
                            </Button>
                        </Card.Body>
                    </Card>

                    <div className="text-end">
                        <Button variant="light" className="me-2" onClick={handleCreateModalClose}>Cancel</Button>
                        <Button type="submit" variant="success" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Variant'}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );

    const EditVariationModal = () => (
        <Modal show={editModalShow} onHide={handleEditModalClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title><FaEdit className="me-2" /> Edit Attribute/Modifier (ID: {currentAttribute?.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="info" className="py-2">
                    <small>
                        **SKU:** {currentAttribute?.sku} | **Product:** {getProductNameById(currentAttribute?.product_id)}
                    </small>
                </Alert>
                <form onSubmit={editForm.handleSubmit(handleEditSubmit)}>
                    
                    <Row>
                        <Col md={6}>
                            <FormInput
                                name="variation_type"
                                label="Variation Type"
                                type="text"
                                placeholder="e.g., color"
                                containerClass="mb-3"
                                register={editForm.register}
                                errors={editForm.formState.errors}
                            />
                        </Col>
                        <Col md={6}>
                            <FormInput
                                name="variation_value"
                                label="Variation Value"
                                type="text"
                                placeholder="e.g., blue"
                                containerClass="mb-3"
                                register={editForm.register}
                                errors={editForm.formState.errors}
                            />
                        </Col>
                    </Row>
                    
                    {/* Display Price Modifier for editing if the current row holds the modifier value */}
                    {/* The backend logic typically stores the modifier on one primary row per SKU */}
                    {currentAttribute && (
                        <FormInput
                            name="price_modifier"
                            label="Price Modifier (SKU Base Modifier)"
                            type="number"
                            placeholder="e.g. 5.00"
                            containerClass="mb-4"
                            register={editForm.register}
                            errors={editForm.formState.errors}
                            // The backend handles the update logic, so we let the user edit it.
                        />
                    )}
                    <div className="text-end">
                        <Button variant="light" className="me-2" onClick={handleEditModalClose}>Cancel</Button>
                        <Button type="submit" variant="success" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Update Attribute'}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );


    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f9' }}>
            <CreateVariationModal />
            <EditVariationModal />
            
            <h4 className="mb-4 d-flex align-items-center"><FaTags className="me-2" /> Product Variation Management</h4>
            
            {submitStatus.message && (
                <Alert variant={submitStatus.variant} className="mb-3 text-center">
                    {submitStatus.message}
                </Alert>
            )}

            {/* Product Selection */}
            <Row className="mb-3">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Select Product to Manage Variations</Form.Label>
                                <Form.Select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    disabled={isProductsLoading || isLoading}
                                >
                                    <option value="">-- Select Parent Product --</option>
                                    {products.map((p) => (
                                        <option key={p.product_id} value={p.product_id}>
                                            {p.name} (ID: {p.product_id})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            {selectedProductId && (
                                <p className="text-muted mt-2 mb-0">
                                    Managing variations for: **{getProductNameById(selectedProductId)}**
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="d-flex align-items-center">
                    <Button variant="primary" onClick={openCreateModal} disabled={!selectedProductId || isProductsLoading} className="w-100">
                        <FaPlus className="me-1" /> 
                        {isProductsLoading ? 'Loading Products...' : 'Add New Variant (SKU)'}
                    </Button>
                </Col>
            </Row>
            
            {/* Variants Table */}
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">Variants for {selectedProductId ? getProductNameById(selectedProductId) : 'Selected Product'}</h5>
                        </Card.Header>
                        <Card.Body>
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <span className="ms-2">Loading Variants...</span>
                                </div>
                            ) : variants.length === 0 && selectedProductId ? (
                                <Alert variant="info" className="text-center">No variants found for this product. Click "Add New Variant (SKU)" to begin.</Alert>
                            ) : !selectedProductId ? (
                                <Alert variant="secondary" className="text-center">Please select a product above to view and manage its variations.</Alert>
                            ) : (
                                <div className="table-responsive">
                                    <Table striped bordered hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>SKU</th>
                                                <th>Price Modifier</th>
                                                <th>Attributes & Values</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variants.map((variant) => (
                                                <tr key={variant.sku}>
                                                    <td>
                                                        <strong>{variant.sku}</strong>
                                                        <small className="d-block text-muted">ID: {variant.product_id}</small>
                                                    </td>
                                                    <td>
                                                        {/* FIX: Ensure data is treated as a number before calling toFixed() */}
                                                        <Badge bg="secondary">
                                                            ₹{
                                                                // Use optional chaining for safety, then parseFloat, and finally toFixed(2)
                                                                // If variant.price_modifier is null/undefined, it defaults to 0.
                                                                parseFloat(variant.price_modifier || 0).toFixed(2)
                                                            }
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <ul className="list-unstyled mb-0">
                                                            {variant.attributes.map((attr, index) => (
                                                                <li key={attr.id} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                                                                    <span className="me-2">
                                                                        **{attr.variation_type}**: {attr.variation_value}
                                                                    </span>
                                                                    <Button 
                                                                        variant="outline-info" 
                                                                        size="sm" 
                                                                        // Pass both the attribute row and the parent SKU details
                                                                        onClick={() => openEditModal(attr, variant)}
                                                                    >
                                                                        <FaEdit />
                                                                    </Button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td style={{ minWidth: '100px' }}>
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm" 
                                                            onClick={() => handleDeleteVariant(variant.sku)}
                                                        >
                                                            <FaTrash className="me-1" /> Delete SKU
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
        </div>
    );
};

export default Variation;