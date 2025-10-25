import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Table, Modal, Badge, Pagination } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaWarehouse, FaExclamationTriangle } from 'react-icons/fa';

// ====================================================================
// FormInput Helper Component (Re-used for consistency)
// ====================================================================
const FormInput = ({ name, label, type, placeholder, containerClass, register, errors, rows, readOnly, children }) => {
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
// Inventory Management Component
// ====================================================================
const InventoryManagement = () => {
    const API_BASE_URL = "https://ecomm.braventra.in/api"; 
    
    const [inventory, setInventory] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });
    const [modalShow, setModalShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentInventory, setCurrentInventory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // --- Validation Schema ---
    const schemaResolver = yupResolver(yup.object().shape({
        product_id: yup.number().typeError("Please select a product").required("Product is required").positive("Must be positive"),
        quantity_in_stock: yup.number().typeError("Quantity must be a number").required("Quantity is required").min(0, "Cannot be negative"),
        warehouse_location: yup.string().max(255, "Location cannot exceed 255 characters").nullable(),
        reorder_point: yup.number().typeError("ROP must be a number").required("Reorder Point is required").min(0, "Cannot be negative"),
    }));

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm({
        resolver: schemaResolver,
        defaultValues: {
            product_id: '',
            quantity_in_stock: '',
            warehouse_location: '',
            reorder_point: 10,
        },
    });

    // Watch product_id to get selected product name
    const selectedProductId = watch('product_id');

    // ====================================================================
    // Data Fetching Functions
    // ====================================================================

    // Fetch all products for dropdown and name mapping
    const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.data && data.data.products) {
                setProducts(data.data.products);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setSubmitStatus({ message: `Failed to fetch products: ${err.message}`, variant: 'danger' });
            setProducts([]);
        } finally {
            setIsProductsLoading(false);
        }
    };

    // Fetch all inventory records and low stock alerts
    const fetchInventoryData = async () => {
        setIsLoading(true);
        setSubmitStatus({ message: '', variant: '' });
        try {
            // Fetch All Inventory
            const invResponse = await fetch(`${API_BASE_URL}/inventory`); 
            
            let invData;
            if (!invResponse.ok) {
                const errorData = await invResponse.json().catch(() => ({})); 
                const errorMessage = errorData.error || `HTTP error! status: ${invResponse.status}`;
                throw new Error(errorMessage);
            }
            invData = await invResponse.json();
            
            if (invData.data && invData.data.inventory) {
                setInventory(invData.data.inventory);
                // Calculate total pages for pagination
                setTotalPages(Math.ceil(invData.data.inventory.length / itemsPerPage));
            } else {
                setInventory([]);
                setTotalPages(1);
            }

            // Fetch Low Stock Items
            const lowStockResponse = await fetch(`${API_BASE_URL}/inventory/low-stock`);
            
            if (!lowStockResponse.ok) {
                const errorData = await lowStockResponse.json().catch(() => ({}));
                console.error("Failed to fetch low stock:", errorData.error || `Status ${lowStockResponse.status}`);
                setLowStockItems([]);
            } else {
                const lowStockData = await lowStockResponse.json();
                if (lowStockData.data && lowStockData.data.lowStock) {
                    setLowStockItems(lowStockData.data.lowStock);
                } else {
                    setLowStockItems([]);
                }
            }
            
        } catch (err) {
            setSubmitStatus({ message: `Failed to fetch data: ${err.message}`, variant: 'danger' });
            console.error("Error fetching inventory data:", err);
            setInventory([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventoryData();
        fetchProducts();
    }, []);

    // ====================================================================
    // Helper Functions
    // ====================================================================

    // Get product name by product_id
    const getProductNameById = (productId) => {
        const product = products.find(p => p.product_id === productId);
        return product ? product.name : `Product ${productId}`;
    };

    // Get product details by product_id
    const getProductById = (productId) => {
        return products.find(p => p.product_id === productId) || null;
    };

    // ====================================================================
    // Pagination Functions
    // ====================================================================

    // Get current items for pagination
    const getCurrentInventory = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return inventory.slice(startIndex, endIndex);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate pagination items
    const renderPaginationItems = () => {
        let items = [];
        
        // Previous button
        items.push(
            <Pagination.Prev 
                key="prev" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            />
        );

        // Page numbers
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        // Next button
        items.push(
            <Pagination.Next 
                key="next" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    // ====================================================================
    // Modal/Form Management
    // ====================================================================

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentInventory(null);
        reset({ 
            product_id: '', 
            quantity_in_stock: '', 
            warehouse_location: '', 
            reorder_point: 10 
        });
        setModalShow(true);
    };

    const openEditModal = (item) => {
        setIsEditing(true);
        setCurrentInventory(item);
        
        reset(); 
        setValue('product_id', item.product_id);
        setValue('quantity_in_stock', item.quantity_in_stock);
        setValue('warehouse_location', item.warehouse_location || '');
        setValue('reorder_point', item.reorder_point);

        setModalShow(true);
    };

    const handleModalClose = () => {
        setModalShow(false);
        setSubmitStatus({ message: '', variant: '' });
    };

    // Get selected product name for display
    const getSelectedProductName = () => {
        if (!selectedProductId) return '';
        return getProductNameById(parseInt(selectedProductId));
    };

    // ====================================================================
    // Handle Submissions
    // ====================================================================

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        const payload = {
            product_id: parseInt(data.product_id),
            quantity_in_stock: parseInt(data.quantity_in_stock),
            warehouse_location: data.warehouse_location || null,
            reorder_point: parseInt(data.reorder_point),
        };

        let endpoint = `${API_BASE_URL}/inventory/add`;
        let method = 'POST';

        if (isEditing && currentInventory) {
            endpoint = `${API_BASE_URL}/inventory/edit/${currentInventory.id}`;
            method = 'PUT';
            delete payload.product_id; 
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error || `Server returned status ${response.status}`;
                throw new Error(errorMsg);
            }

            const productName = getProductNameById(parseInt(data.product_id));
            
            const successMessage = isEditing 
                ? `Inventory for ${productName} updated successfully!` 
                : `New inventory record for ${productName} added successfully!`;
                
            setSubmitStatus({ message: successMessage, variant: 'success' });
            fetchInventoryData();
            handleModalClose();

        } catch (error) {
            setSubmitStatus({ message: `Failed to ${isEditing ? 'update' : 'add'} inventory: ${error.message}`, variant: 'danger' });
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (inventoryId, productName) => {
        if (!window.confirm(`Are you sure you want to delete the inventory record for ${productName}?`)) {
            return;
        }

        setSubmitStatus({ message: '', variant: '' });
        
        try {
            const response = await fetch(`${API_BASE_URL}/inventory/delete/${inventoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error || `Server returned status ${response.status}`;
                throw new Error(errorMsg);
            }
            
            setSubmitStatus({ message: `Inventory for ${productName} deleted successfully.`, variant: 'success' });
            fetchInventoryData();
            
        } catch (error) {
            setSubmitStatus({ message: `Failed to delete inventory: ${error.message}`, variant: 'danger' });
            console.error('Deletion error:', error);
        }
    };
    
    // ====================================================================
    // Render Functions
    // ====================================================================

    const InventoryModal = () => (
        <Modal show={modalShow} onHide={handleModalClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Stock Record' : 'Add New Stock Record'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        name="product_id"
                        label="Product"
                        type="select"
                        containerClass="mb-3"
                        register={register}
                        errors={errors}
                        readOnly={isEditing}
                    >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product.product_id} value={product.product_id}>
                                {product.name} (ID: {product.product_id})
                            </option>
                        ))}
                    </FormInput>

                    {selectedProductId && (
                        <Alert variant="info" className="py-2">
                            <small>
                                <strong>Selected Product:</strong> {getSelectedProductName()}
                                {isEditing && ` (Current Stock: ${currentInventory?.quantity_in_stock})`}
                            </small>
                        </Alert>
                    )}

                    <FormInput
                        name="quantity_in_stock"
                        label="Quantity in Stock"
                        type="number"
                        placeholder="e.g. 150"
                        containerClass="mb-3"
                        register={register}
                        errors={errors}
                    />
                    <FormInput
                        name="reorder_point"
                        label="Reorder Point (ROP)"
                        type="number"
                        placeholder="e.g. 20"
                        containerClass="mb-3"
                        register={register}
                        errors={errors}
                    />
                    <FormInput
                        name="warehouse_location"
                        label="Warehouse Location (Optional)"
                        type="text"
                        placeholder="e.g. Aisle B-4"
                        containerClass="mb-4"
                        register={register}
                        errors={errors}
                    />
                    <div className="text-end">
                        <Button variant="light" className="me-2" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" disabled={isSubmitting || isProductsLoading}>
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Stock' : 'Save Stock')}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f9' }}>
            <InventoryModal />
            <h4 className="mb-4 d-flex align-items-center"><FaWarehouse className="me-2" /> Inventory Management</h4>
            
            {submitStatus.message && (
                <Alert variant={submitStatus.variant} className="mb-3 text-center">
                    {submitStatus.message}
                </Alert>
            )}

            {/* Low Stock Alert Section */}
            {lowStockItems.length > 0 && (
                <Alert variant="warning" className="mb-4">
                    <h5 className="mb-2"><FaExclamationTriangle className="me-2" /> Low Stock Alert!</h5>
                    <p className="mb-1">
                        {lowStockItems.length} product(s) are currently below their Reorder Point (ROP). Please initiate a restock immediately.
                    </p>
                    <ul className="mb-0">
                        {lowStockItems.slice(0, 5).map(item => {
                            const productName = getProductNameById(item.product_id);
                            return (
                                <li key={item.id}>
                                    {productName} (ID: {item.product_id}) - Stock: {item.quantity_in_stock}, ROP: {item.reorder_point}
                                </li>
                            );
                        })}
                        {lowStockItems.length > 5 && (
                             <li>...and {lowStockItems.length - 5} more items.</li>
                        )}
                    </ul>
                </Alert>
            )}

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                            <h5 className="mb-0">Current Stock Levels</h5>
                            <Button variant="primary" onClick={openAddModal} disabled={isProductsLoading}>
                                <FaPlus className="me-1" /> 
                                {isProductsLoading ? 'Loading Products...' : 'Add New Record'}
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <span className="ms-2">Loading Inventory...</span>
                                </div>
                            ) : inventory.length === 0 ? (
                                <Alert variant="info" className="text-center">No inventory records found. Click "Add New Record" to begin.</Alert>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <Table striped bordered hover className="mb-3">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Product Name</th>
                                                    <th>Stock</th>
                                                    <th>Location</th>
                                                    <th>ROP</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getCurrentInventory().map((item) => {
                                                    const isLowStock = item.quantity_in_stock < item.reorder_point;
                                                    const productName = getProductNameById(item.product_id);
                                                    const product = getProductById(item.product_id);
                                                    
                                                    return (
                                                        <tr key={item.id} className={isLowStock ? 'table-warning' : ''}>
                                                            <td>{item.id}</td>
                                                            <td>
                                                                <div>
                                                                    <strong>{productName}</strong>
                                                                    {product && (
                                                                        <div>
                                                                            <small className="text-muted">
                                                                                Category: {product.category_id} | 
                                                                                Price: ₹{product.price}
                                                                            </small>
                                                                        </div>
                                                                    )}
                                                                    <small className="text-muted d-block">Product ID: {item.product_id}</small>
                                                                </div>
                                                            </td>
                                                            <td>{item.quantity_in_stock}</td>
                                                            <td>{item.warehouse_location || 'N/A'}</td>
                                                            <td>{item.reorder_point}</td>
                                                            <td>
                                                                <Badge bg={isLowStock ? 'danger' : 'success'}>
                                                                    {isLowStock ? 'LOW' : 'OK'}
                                                                </Badge>
                                                            </td>
                                                            <td style={{ minWidth: '150px' }}>
                                                                <Button 
                                                                    variant="info" 
                                                                    size="sm" 
                                                                    className="me-2 mb-1"
                                                                    onClick={() => openEditModal(item)}
                                                                >
                                                                    <FaEdit /> Edit
                                                                </Button>
                                                                <Button 
                                                                    variant="danger" 
                                                                    size="sm" 
                                                                    className="mb-1"
                                                                    onClick={() => handleDelete(item.id, productName)}
                                                                >
                                                                    <FaTrash /> Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                    
                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center">
                                            <Pagination>
                                                {renderPaginationItems()}
                                            </Pagination>
                                        </div>
                                    )}
                                    
                                    {/* Pagination Info */}
                                    <div className="text-muted text-center mt-2">
                                        Showing {getCurrentInventory().length} of {inventory.length} records
                                        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default InventoryManagement;