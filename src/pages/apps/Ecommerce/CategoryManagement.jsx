import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Table, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

// ====================================================================
// FormInput Helper Component (Re-used for consistency)
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
// Category Management Component
// ====================================================================
const CategoryManagement = () => {
    // NOTE: This URL should point to your backend on port 3000 with the /api/category prefix
    const API_BASE_URL = "https://ecomm.braventra.in/api"; 
    
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });
    const [modalShow, setModalShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subcategories, setSubcategories] = useState({}); // To hold fetched subcategories by ID

    // --- Validation Schema ---
    const schemaResolver = yupResolver(yup.object().shape({
        category_name: yup.string().required("Category name is required"),
        subcategories_input: yup.string().nullable(), // For comma-separated subcategories
    }));

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm({
        resolver: schemaResolver,
        defaultValues: {
            category_name: '',
            subcategories_input: '',
        },
    });

    // ====================================================================
    // Data Fetching Functions
    // ====================================================================

    // Fetch all categories
    const fetchCategories = async () => {
        setIsLoading(true);
        setSubmitStatus({ message: '', variant: '' });
        try {
            const response = await fetch(`${API_BASE_URL}/category`); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.data && data.data.categories) {
                setCategories(data.data.categories);
            } else {
                setCategories([]);
                setSubmitStatus({ message: "No categories found.", variant: 'info' });
            }
        } catch (err) {
            setSubmitStatus({ message: `Failed to fetch categories: ${err.message}`, variant: 'danger' });
            console.error("Error fetching categories:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch subcategories for a specific category
    const fetchSubcategories = async (categoryId) => {
        if (subcategories[categoryId]) return; // Avoid re-fetching if already present

        try {
            const response = await fetch(`${API_BASE_URL}/category/${categoryId}/subcategories`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.data && Array.isArray(data.data.subcategories)) {
                setSubcategories(prev => ({ 
                    ...prev, 
                    [categoryId]: data.data.subcategories.map(sub => sub.name) 
                }));
            } else {
                setSubcategories(prev => ({ ...prev, [categoryId]: [] }));
            }
        } catch (err) {
            console.error(`Error fetching subcategories for ID ${categoryId}:`, err);
            setSubcategories(prev => ({ ...prev, [categoryId]: ['(Error loading subcategories)'] }));
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []); 

    // ====================================================================
    // Modal/Form Management
    // ====================================================================

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentCategory(null);
        reset({ category_name: '', subcategories_input: '' });
        setModalShow(true);
    };

    const openEditModal = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        
        // Find existing subcategories for display in the form (Not ideal, but mimics existing structure)
        const subList = subcategories[category.id] ? subcategories[category.id].join(', ') : '';
        
        reset({ 
            category_name: category.name, 
            subcategories_input: subList 
        });
        setModalShow(true);
    };

    const handleModalClose = () => {
        setModalShow(false);
        setSubmitStatus({ message: '', variant: '' });
    };


    // ====================================================================
    // Handle Submissions
    // ====================================================================

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        // Parse comma-separated subcategories string into an array
        const subcategoriesArray = data.subcategories_input 
            ? data.subcategories_input.split(',').map(s => s.trim()).filter(s => s.length > 0) 
            : [];

        const payload = {
            category_name: data.category_name,
            subcategories: subcategoriesArray,
        };

        let endpoint = `${API_BASE_URL}/category/add`;
        let method = 'POST';

        if (isEditing && currentCategory) {
            endpoint = `${API_BASE_URL}/category/edit/${currentCategory.id}`;
            method = 'PUT';
            // NOTE: The PUT endpoint in your backend currently only updates category_name, 
            // and ignores subcategories. For a full solution, you'd need an API to update/manage subcategories separately.
            delete payload.subcategories; 
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
                const errorText = await response.text();
                throw new Error(`Server returned status ${response.status}. Error: ${errorText.slice(0, 100)}...`);
            }

            const result = await response.json();
            
            const successMessage = isEditing 
                ? `Category '${data.category_name}' updated successfully!` 
                : `Category '${data.category_name}' added successfully!`;
                
            setSubmitStatus({ message: successMessage, variant: 'success' });
            fetchCategories(); // Refresh the list
            handleModalClose(); // Close the modal on success

        } catch (error) {
            setSubmitStatus({ message: `Failed to ${isEditing ? 'update' : 'add'} category: ${error.message}`, variant: 'danger' });
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (categoryId, categoryName) => {
        if (!window.confirm(`Are you sure you want to delete the category: ${categoryName}? This action cannot be undone.`)) {
            return;
        }

        setSubmitStatus({ message: '', variant: '' });
        
        try {
            const response = await fetch(`${API_BASE_URL}/category/delete/${categoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server returned status ${response.status}. Error: ${errorText.slice(0, 100)}...`);
            }

            // const result = await response.json(); // You may not need to read the body for a simple 200 OK delete
            
            setSubmitStatus({ message: `Category '${categoryName}' deleted successfully.`, variant: 'success' });
            fetchCategories(); // Refresh the list
            
        } catch (error) {
            setSubmitStatus({ message: `Failed to delete category: ${error.message}`, variant: 'danger' });
            console.error('Deletion error:', error);
        }
    };
    
    // ====================================================================
    // Render Functions
    // ====================================================================

    const CategoryModal = () => (
        <Modal show={modalShow} onHide={handleModalClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Category' : 'Add New Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        name="category_name"
                        label="Category Name"
                        placeholder="e.g. Electronics, Clothing"
                        containerClass="mb-3"
                        register={register}
                        errors={errors}
                    />
                    {!isEditing && ( // Only show subcategories field for adding a new category
                        <FormInput
                            name="subcategories_input"
                            type="textarea"
                            rows="3"
                            label="Subcategories (Optional)"
                            placeholder="Enter subcategory names separated by commas (e.g., Phones, Laptops, Accessories)"
                            containerClass="mb-3"
                            register={register}
                            errors={errors}
                        />
                    )}
                    <div className="text-end">
                        <Button variant="light" className="me-2" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Save Category')}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f9' }}>
            <CategoryModal />
            <h4 className="mb-4">Category Management</h4>
            
            {submitStatus.message && (
                <Alert variant={submitStatus.variant} className="mb-3 text-center">
                    {submitStatus.message}
                </Alert>
            )}

            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                            <h5 className="mb-0">All Categories</h5>
                            <Button variant="primary" onClick={openAddModal}>
                                <FaPlus className="me-1" /> Add New Category
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <span className="ms-2">Loading Categories...</span>
                                </div>
                            ) : categories.length === 0 ? (
                                <Alert variant="info" className="text-center">No categories found. Click "Add New Category" to begin.</Alert>
                            ) : (
                                <div className="table-responsive">
                                    <Table striped bordered hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Category Name</th>
                                                <th>Subcategories</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((cat) => (
                                                <tr key={cat.id}>
                                                    <td>{cat.id}</td>
                                                    <td>{cat.name}</td>
                                                    <td 
                                                        onMouseEnter={() => fetchSubcategories(cat.id)}
                                                        className="text-muted"
                                                    >
                                                        {subcategories[cat.id] ? (
                                                            subcategories[cat.id].length > 0 ? (
                                                                subcategories[cat.id].join(', ')
                                                            ) : (
                                                                'None'
                                                            )
                                                        ) : (
                                                            // Placeholder while fetching on hover
                                                            'Hover to view...'
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Button 
                                                            variant="info" 
                                                            size="sm" 
                                                            className="me-2"
                                                            onClick={() => openEditModal(cat)}
                                                        >
                                                            <FaEdit /> Edit
                                                        </Button>
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm" 
                                                            onClick={() => handleDelete(cat.id, cat.name)}
                                                        >
                                                            <FaTrash /> Delete
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

export default CategoryManagement;