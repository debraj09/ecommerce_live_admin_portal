import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Table, Modal, Collapse } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEdit, FaTrash, FaPlus, FaMinus, FaChevronDown, FaChevronRight } from 'react-icons/fa';

// ====================================================================
// FormInput Helper Component (Re-used for consistency)
// ====================================================================
const FormInput = ({ name, label, type, placeholder, containerClass, register, errors, rows, readOnly }) => {
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
                readOnly={readOnly}
            />
            <Form.Control.Feedback type="invalid">
                {errors[name]?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
};


// ====================================================================
// Category Management Component
// ====================================================================
const CategoryManagement = () => {
    // NOTE: This URL should point to your backend on port 3000 with the /api/category prefix
    const API_BASE_URL = "https://ecomm.braventra.in/api"; 
    
    const [hierarchy, setHierarchy] = useState([]); // Stores the full nested hierarchy
    const [isLoading, setIsLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });
    
    // State for Modals
    const [categoryModalShow, setCategoryModalShow] = useState(false);
    const [subcategoryModalShow, setSubcategoryModalShow] = useState(false);
    const [productGroupModalShow, setProductGroupModalShow] = useState(false);

    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const [currentParent, setCurrentParent] = useState(null); // Stores the L1/L2 parent for adding L2/L3
    const [currentSubcategory, setCurrentSubcategory] = useState(null); // Stores L2 item for editing/adding L3

    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Validation Schema ---
    // Schema for Level 1 Category (Only name is required for now)
    const categorySchema = yupResolver(yup.object().shape({
        category_name: yup.string().required("Category name is required"),
    }));

    // Schema for Subcategory (L2) and Product Group (L3)
    const subcategorySchema = yupResolver(yup.object().shape({
        item_name: yup.string().required("Name is required"),
        parent_name: yup.string().nullable(), // For display only
    }));

    // Form handlers for Category (L1)
    const { handleSubmit: handleCategorySubmit, register: registerCategory, formState: { errors: categoryErrors }, reset: resetCategory } = useForm({
        resolver: categorySchema,
    });

    // Form handlers for Subcategory/Product Group (L2/L3)
    const { handleSubmit: handleSubcategorySubmit, register: registerSubcategory, formState: { errors: subcategoryErrors }, reset: resetSubcategory } = useForm({
        resolver: subcategorySchema,
    });


    // ====================================================================
    // Data Fetching Functions
    // ====================================================================

    // Fetch the full nested hierarchy (L1 -> L2 -> L3)
    const fetchAllNestedCategories = async () => {
        setIsLoading(true);
        setSubmitStatus({ message: '', variant: '' });
        try {
            const response = await fetch(`${API_BASE_URL}/category/all-nested`); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.data && data.data.hierarchy) {
                setHierarchy(data.data.hierarchy);
            } else {
                setHierarchy([]);
                setSubmitStatus({ message: "No hierarchy data found.", variant: 'info' });
            }
        } catch (err) {
            setSubmitStatus({ message: `Failed to fetch hierarchy: ${err.message}`, variant: 'danger' });
            console.error("Error fetching hierarchy:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllNestedCategories();
    }, []); 

    // ====================================================================
    // Modal/Form Management
    // ====================================================================

    // --- Category (L1) Modal Handlers ---
    const openAddCategoryModal = () => {
        setIsEditingCategory(false);
        setCurrentCategory(null);
        resetCategory({ category_name: '' });
        setCategoryModalShow(true);
    };

    const openEditCategoryModal = (category) => {
        setIsEditingCategory(true);
        setCurrentCategory(category);
        resetCategory({ category_name: category.name });
        setCategoryModalShow(true);
    };

    const handleCategoryModalClose = () => {
        setCategoryModalShow(false);
        setSubmitStatus({ message: '', variant: '' });
    };

    // --- Subcategory (L2/L3) Modal Handlers ---
    // L2: Add L2 (Clinical/Technicin) under L1 Category
    const openAddSubcategoryModal = (parentCategory) => {
        setCurrentParent({
            id: parentCategory.id, 
            name: parentCategory.name, 
            level: 1, 
            is_top_level: 1 // Parent is L1 Category
        });
        setCurrentSubcategory(null);
        resetSubcategory({ item_name: '', parent_name: parentCategory.name });
        setSubcategoryModalShow(true);
    };
    
    // L2/L3: Edit Subcategory/Product Group
    const openEditSubcategoryModal = (item, parentName) => {
        // Here we reuse the L2 modal for editing L2/L3
        setCurrentSubcategory(item);
        setCurrentParent(null);
        
        resetSubcategory({ 
            item_name: item.name, 
            parent_name: parentName 
        });
        setSubcategoryModalShow(true);
    };

    const handleSubcategoryModalClose = () => {
        setSubcategoryModalShow(false);
        setSubmitStatus({ message: '', variant: '' });
    };

    // L3: Add Product Group under L2 Subcategory
    const openAddProductGroupModal = (parentSubcategory, grandParentName) => {
        // Parent is L2 Subcategory
        setCurrentParent({
            id: parentSubcategory.id,
            name: parentSubcategory.name,
            level: 2,
            is_top_level: 0 // Parent is L2 Subcategory
        });
        setCurrentSubcategory(null);
        resetSubcategory({ item_name: '', parent_name: `${grandParentName} > ${parentSubcategory.name}` });
        setProductGroupModalShow(true);
    };

    const handleProductGroupModalClose = () => {
        setProductGroupModalShow(false);
        setSubmitStatus({ message: '', variant: '' });
    };

    // ====================================================================
    // Handle Submissions
    // ====================================================================

    const onCategorySubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        let endpoint = `${API_BASE_URL}/category/add`;
        let method = 'POST';
        let payload = { category_name: data.category_name };

        if (isEditingCategory && currentCategory) {
            endpoint = `${API_BASE_URL}/category/edit/${currentCategory.id}`;
            method = 'PUT';
        } else {
             // NOTE: Your backend 'add' API handles a 'subcategories' array. 
             // To simplify the UI for the fixed L2 structure, we won't add them here.
             // You can update this if you need a quick way to add L2 items initially.
             // For now, L2 items must be added via the dedicated 'Add Subcategory' button.
             payload = { category_name: data.category_name, children: [] }; 
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(`Server status ${response.status}. Error: ${errorText.slice(0, 100)}...`);
             }
             const successMessage = isEditingCategory ? `Category '${data.category_name}' updated successfully!` : `Category '${data.category_name}' added successfully!`;
             setSubmitStatus({ message: successMessage, variant: 'success' });
             fetchAllNestedCategories();
             handleCategoryModalClose();

        } catch (error) {
            setSubmitStatus({ message: `Failed to ${isEditingCategory ? 'update' : 'add'} category: ${error.message}`, variant: 'danger' });
            console.error('Category submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubcategorySubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        let endpoint;
        let method;
        let payload;
        let action = '';

        // EDIT L2/L3 Item
        if (currentSubcategory) {
            // FIXED: Changed from /subcategory/edit/ to /category/sub/edit/
            endpoint = `${API_BASE_URL}/category/sub/edit/${currentSubcategory.id}`;
            method = 'PUT';
            payload = { subcategory_name: data.item_name };
            action = 'update';
            
        // ADD L2/L3 Item
        } else if (currentParent) {
            // FIXED: Changed from /subcategory/add to /category/sub/add
            endpoint = `${API_BASE_URL}/category/sub/add`;
            method = 'POST';
            payload = { 
                subcategory_name: data.item_name,
                parent_id: currentParent.id
                // Removed is_top_level as backend determines this automatically
            };
            action = 'add';
        } else {
            return setSubmitStatus({ message: 'Invalid state for submission.', variant: 'danger' });
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server status ${response.status}. Error: ${errorText.slice(0, 100)}...`);
            }
            
            const successMessage = `'${data.item_name}' ${action}ed successfully!`;
            setSubmitStatus({ message: successMessage, variant: 'success' });
            fetchAllNestedCategories();
            handleSubcategoryModalClose();
            handleProductGroupModalClose();

        } catch (error) {
            setSubmitStatus({ message: `Failed to ${action}: ${error.message}`, variant: 'danger' });
            console.error('Subcategory submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (itemId, itemName, endpointType) => {
        if (!window.confirm(`Are you sure you want to delete '${itemName}'? This action cannot be undone.`)) {
            return;
        }

        setSubmitStatus({ message: '', variant: '' });
        let endpoint = '';

        if (endpointType === 'category') {
            endpoint = `${API_BASE_URL}/category/delete/${itemId}`;
        } else { // subcategory or productgroup
            // FIXED: Changed from /subcategory/delete/ to /category/sub/delete/
            endpoint = `${API_BASE_URL}/category/sub/delete/${itemId}`;
        }

        try {
            const response = await fetch(endpoint, { method: 'DELETE' });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server status ${response.status}. Error: ${errorText.slice(0, 100)}...`);
            }
            
            setSubmitStatus({ message: `'${itemName}' deleted successfully.`, variant: 'success' });
            fetchAllNestedCategories(); // Refresh the list
            
        } catch (error) {
            setSubmitStatus({ message: `Failed to delete: ${error.message}`, variant: 'danger' });
            console.error('Deletion error:', error);
        }
    };
    
    // ====================================================================
    // Render Components (Modals and Hierarchy Rows)
    // ====================================================================

    const CategoryModal = () => (
        <Modal show={categoryModalShow} onHide={handleCategoryModalClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditingCategory ? 'Edit Category (Level 1)' : 'Add New Category (Level 1)'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleCategorySubmit(onCategorySubmit)}>
                    <FormInput
                        name="category_name"
                        label="Category Name"
                        placeholder="e.g. Equipments"
                        containerClass="mb-3"
                        register={registerCategory}
                        errors={categoryErrors}
                    />
                    <div className="text-end">
                        <Button variant="light" className="me-2" onClick={handleCategoryModalClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (isEditingCategory ? 'Update Category' : 'Save Category')}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );

    const SubcategoryModal = ({ isProductGroup = false }) => {
        // Decide which state/handler to use based on the context
        const show = isProductGroup ? productGroupModalShow : subcategoryModalShow;
        const handleClose = isProductGroup ? handleProductGroupModalClose : handleSubcategoryModalClose;
        
        const isEditing = !!currentSubcategory;
        const parentName = isEditing ? currentSubcategory.name : (currentParent?.name || 'Category');
        
        // Dynamic Title
        let modalTitle = 'Edit Item';
        if (!isEditing) {
            modalTitle = isProductGroup ? 'Add New Product Group (Level 3)' : 'Add New Subcategory (Level 2)';
        }

        return (
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubcategorySubmit(onSubcategorySubmit)}>
                        {/* Parent Display */}
                        {((currentParent && currentParent.id) || isEditing) && (
                            <FormInput
                                name="parent_name"
                                label={isEditing ? 'Editing Item' : `Parent: ${parentName}`}
                                placeholder=""
                                containerClass="mb-3"
                                register={registerSubcategory}
                                errors={subcategoryErrors}
                                readOnly={true}
                            />
                        )}
                        
                        <FormInput
                            name="item_name"
                            label={isEditing ? 'New Name' : 'New Item Name'}
                            placeholder={isProductGroup ? "e.g. Dentclic-Imian, New Brand" : "e.g. Clinical, Technician"}
                            containerClass="mb-3"
                            register={registerSubcategory}
                            errors={subcategoryErrors}
                        />
                        <div className="text-end">
                            <Button variant="light" className="me-2" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="success" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Item' : 'Save Item')}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    };


    const HierarchyRow = ({ item, level, parentName }) => {
        const [open, setOpen] = useState(true);
        const toggleOpen = (e) => {
            e.stopPropagation(); // Prevents row click events if any
            setOpen(!open);
        };
        
        const indentStyle = { paddingLeft: `${10 + (level * 30)}px` };
        const isL3 = level === 3;

        // Determine actions and styling based on level
        let actionButtons;
        if (level === 1) { // L1: Category
            actionButtons = (
                <>
                    <Button variant="info" size="sm" className="me-2" onClick={() => openEditCategoryModal(item)}>
                        <FaEdit /> Edit
                    </Button>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => openAddSubcategoryModal(item)}>
                        <FaPlus /> Add L2
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, item.name, 'category')}>
                        <FaTrash /> Delete
                    </Button>
                </>
            );
        } else if (level === 2) { // L2: Clinical/Technicin
            actionButtons = (
                <>
                    <Button variant="info" size="sm" className="me-2" onClick={() => openEditSubcategoryModal(item, parentName)}>
                        <FaEdit /> Edit
                    </Button>
                    <Button variant="success" size="sm" className="me-2" onClick={() => openAddProductGroupModal(item, parentName)}>
                        <FaPlus /> Add L3
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, item.name, 'subcategory')}>
                        <FaTrash /> Delete
                    </Button>
                </>
            );
        } else { // L3: Product Group
            actionButtons = (
                <>
                    <Button variant="info" size="sm" className="me-2" onClick={() => openEditSubcategoryModal(item, `${parentName} > ${item.name}`)}>
                        <FaEdit /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, item.name, 'subcategory')}>
                        <FaTrash /> Delete
                    </Button>
                </>
            );
        }
        
        // Recursive rendering function
        const renderChildren = (children) => {
            if (!children || children.length === 0) return null;
            
            return children.map(child => (
                <HierarchyRow 
                    key={child.id} 
                    item={child} 
                    level={level + 1} 
                    parentName={level === 1 ? item.name : parentName}
                />
            ));
        };


        return (
            <React.Fragment>
                <tr style={{ background: level === 1 ? '#e9ecef' : (level === 2 ? '#f8f9fa' : '#fff') }}>
                    <td style={indentStyle}>
                        {!isL3 && item.children && item.children.length > 0 ? (
                            <span onClick={toggleOpen} style={{ cursor: 'pointer', marginRight: '5px' }}>
                                {open ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                            </span>
                        ) : (
                            <span style={{ marginRight: '16px' }}>{level === 3 ? '•' : ''}</span>
                        )}
                        <strong>{item.name}</strong>
                    </td>
                    <td style={{ width: '40%' }}>
                        <small className="text-muted">
                            {level === 1 ? 'Top-Level Category' : (level === 2 ? `Level 2 (${parentName})` : `Level 3 Product Group (${parentName})`)}
                        </small>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                        {actionButtons}
                    </td>
                </tr>
                {/* Collapse row for children */}
                {item.children && item.children.length > 0 && (
                    <tr>
                        <td colSpan="3" style={{ padding: 0, border: 'none' }}>
                            <Collapse in={open}>
                                <div>
                                    <Table className="mb-0" style={{ margin: 0 }}>
                                        <tbody>
                                            {renderChildren(item.children)}
                                        </tbody>
                                    </Table>
                                </div>
                            </Collapse>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f9' }}>
            <CategoryModal />
            <SubcategoryModal />
            <SubcategoryModal isProductGroup={true} /> {/* Reusing the component for L3 add/edit */}

            <h4 className="mb-4">Category Hierarchy Management 🌳</h4>
            
            {submitStatus.message && (
                <Alert variant={submitStatus.variant} className="mb-3 text-center">
                    {submitStatus.message}
                </Alert>
            )}

            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                            <h5 className="mb-0">Full Category Hierarchy (L1 → L2 → L3)</h5>
                            <Button variant="primary" onClick={openAddCategoryModal}>
                                <FaPlus className="me-1" /> Add New Category (L1)
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <span className="ms-2">Loading Hierarchy...</span>
                                </div>
                            ) : hierarchy.length === 0 ? (
                                <Alert variant="info" className="text-center">No categories found. Click "Add New Category" to begin.</Alert>
                            ) : (
                                <div className="table-responsive">
                                    <Table striped bordered hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40%' }}>Name (Level)</th>
                                                <th style={{ width: '40%' }}>Details</th>
                                                <th style={{ width: '20%' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Render the top-level categories */}
                                            {hierarchy.map((cat) => (
                                                <HierarchyRow 
                                                    key={cat.id} 
                                                    item={cat} 
                                                    level={1} 
                                                    parentName="" // No parent for level 1
                                                />
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

export default CategoryManagement;