import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Modal, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// Removed: import axios from 'axios'; // No longer needed

// --- Configuration ---
const API_BASE_URL = "https://ecomm.braventra.in/api";
const ROOT_URL = "https://ecomm.braventra.in"; // Used for image prefix

const bannerAdd = () => {
    // State for managing the list of banners
    const [banners, setBanners] = useState([]);
    // State to track if the form is in 'edit' mode and which banner is being edited
    const [isEditing, setIsEditing] = useState(false);
    const [currentBannerId, setCurrentBannerId] = useState(null);
    // State for form submission status messages
    const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });
    // State for loading indicator
    const [isSubmitting, setIsSubmitting] = useState(false);
    // State for the preview image URL
    const [previewImage, setPreviewImage] = useState(null);
    // State for the delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    // --- API Integration Functions using fetch ---

    /**
     * Fetches all banners from the backend API using fetch.
     */
    const fetchBanners = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/banners`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Assuming your response structure is { data: [...] }
            setBanners(data.data || []);
        } catch (error) {
            console.error("Error fetching banners:", error);
            setSubmitStatus({ message: 'Error fetching banners from API.', variant: 'danger' });
        }
    };

    /**
     * Submits new banner data to the API using fetch.
     * @param {FormData} formData - Form data including the image file.
     */
    const addBanner = async (formData) => {
        const response = await fetch(`${API_BASE_URL}/banners/upload`, {
            method: 'POST',
            body: formData, // fetch handles FormData without setting Content-Type header
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload banner');
        }
        return await response.json();
    };

    /**
     * Updates an existing banner's metadata on the API using fetch.
     * @param {string} id - The banner ID.
     * @param {object} data - Banner data (title, description).
     */
    const updateBanner = async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/banners/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update banner');
        }
        return await response.json();
    };


    /**
     * Deletes a banner from the API using fetch.
     * @param {string} id - The banner ID.
     */
    const deleteBannerApi = async (id) => {
        const response = await fetch(`${API_BASE_URL}/banners/delete/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete banner');
        }
        return await response.json();
    };

    // --- useEffect hook to load banners on component mount ---
    useEffect(() => {
        fetchBanners();
    }, []);

    // Form validation schema (Unchanged)
    const schemaResolver = yupResolver(yup.object().shape({
        title: yup.string().required("Please enter the banner title"),
        description: yup.string().required("Please enter a short description"),
        image: yup.mixed().test('required', 'Please upload a banner image', function(value) {
             if (isEditing && previewImage) {
                return true; 
             }
             return (value && value.length > 0);
        }),
    }));

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setValue,
        getValues,
    } = useForm({
        resolver: schemaResolver,
    });

    // Handle image file selection for preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            if (!isEditing || !getValues('imageUrl')) {
                setPreviewImage(null);
            }
        }
    };

    // Resets the form to a default state
    const resetForm = () => {
        reset({
            title: '',
            description: '',
            image: null,
        });
        setPreviewImage(null);
        setIsEditing(false);
        setCurrentBannerId(null);
        setSubmitStatus({ message: '', variant: '' });
    };

    // Handle form submission (add or edit)
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus({ message: '', variant: '' });

        try {
            if (isEditing) {
                const file = data.image && data.image.length > 0 ? data.image[0] : null;

                if (file) {
                    setSubmitStatus({ 
                        message: 'To update the image, please clear the form and add a new banner for a real-world scenario. Updating metadata now.', 
                        variant: 'warning' 
                    });
                }
                
                // Call fetch-based update function
                await updateBanner(currentBannerId, data);
                setSubmitStatus({ message: 'Banner updated successfully!', variant: 'success' });

            } else {
                // --- Handle New Banner Creation ---
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('description', data.description);
                formData.append('image', data.image[0]); 
                
                // Call fetch-based add function
                await addBanner(formData);
                setSubmitStatus({ message: 'Banner added successfully!', variant: 'success' });
            }
            
            await fetchBanners();
            resetForm(); 
            
        } catch (error) {
            console.error('API Error:', error.message);
            setSubmitStatus({ 
                message: `Failed to save banner: ${error.message}`, 
                variant: 'danger' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Sets the form to edit the selected banner
    const handleEdit = (banner) => {
        setValue('title', banner.title);
        setValue('description', banner.description);
        setValue('image', null); 
        setPreviewImage(banner.image_url); // Use image_url from API response
        setIsEditing(true);
        setCurrentBannerId(banner.id);
        setSubmitStatus({ message: 'Editing banner...', variant: 'info' });
    };

    // Opens the delete confirmation modal
    const handleShowDeleteModal = (banner) => {
        setBannerToDelete(banner);
        setShowDeleteModal(true);
    };

    // Deletes the selected banner after confirmation
    const handleDeleteConfirmed = async () => {
        if (bannerToDelete) {
            setIsSubmitting(true);
            setSubmitStatus({ message: '', variant: '' });
            try {
                // Call fetch-based delete function
                await deleteBannerApi(bannerToDelete.id);
                setSubmitStatus({ message: 'Banner deleted successfully!', variant: 'success' });
                await fetchBanners(); // Refresh the list
            } catch (error) {
                console.error('Error deleting banner:', error);
                setSubmitStatus({ 
                    message: `Failed to delete banner: ${error.message}`, 
                    variant: 'danger' 
                });
            } finally {
                setIsSubmitting(false);
                setBannerToDelete(null);
                setShowDeleteModal(false);
                resetForm();
            }
        }
    };

    const handleCloseDeleteModal = () => {
        setBannerToDelete(null);
        setShowDeleteModal(false);
    };
    
    // Form input component for reuse (Unchanged)
    const FormInput = ({ name, label, type, placeholder, containerClass }) => {
        return (
            <Form.Group className={containerClass}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    as={type === 'textarea' ? 'textarea' : 'input'}
                    type={type === 'textarea' ? undefined : type}
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
        <Container className="my-5" style={{ backgroundColor: '#f4f7f9' }}>
            <Row>
                <Col lg={12}>
                    {submitStatus.message && (
                        <Alert variant={submitStatus.variant} className="mb-3 text-center">
                            {submitStatus.message}
                        </Alert>
                    )}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                {isEditing ? 'Edit Banner' : 'Upload New Banner'}
                            </h5>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <FormInput
                                    name="title"
                                    label="Banner Title"
                                    placeholder="e.g. Summer Sale"
                                    containerClass="mb-3"
                                    type="text"
                                />
                                <FormInput
                                    name="description"
                                    label="Description"
                                    placeholder="Please enter a short summary"
                                    containerClass="mb-3"
                                    type="textarea"
                                />
                                <Form.Group className="mb-3">
                                    <Form.Label>Banner Image</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        name="image" 
                                        {...register('image')} 
                                        onChange={handleImageChange}
                                        isInvalid={!!errors.image}
                                        value={undefined} 
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.image?.message}
                                    </Form.Control.Feedback>
                                    {previewImage && (
                                        <div className="mt-3 text-center">
                                            <h6>Image Preview:</h6>
                                            <img 
                                                src={previewImage.startsWith('blob:') ? previewImage : ROOT_URL + previewImage} 
                                                alt="Banner Preview" 
                                                style={{ maxWidth: '400px', maxHeight: '300px' }} 
                                                className="img-fluid" 
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                                
                                <div className="text-center mt-4">
                                    <Button type="button" variant="light" className="me-2" onClick={resetForm} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="success" disabled={isSubmitting}>
                                        {isSubmitting ? 'Processing...' : (isEditing ? 'Update Banner' : 'Upload Banner')}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col lg={12}>
                    <Card>
                        <Card.Body>
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                                Existing Banners
                            </h5>
                            <Row>
                                {banners.length === 0 ? (
                                    <Col><p className="text-center text-muted">No banners found. Start by uploading one!</p></Col>
                                ) : (
                                    banners.map((banner) => (
                                        <Col md={6} lg={4} key={banner.id} className="mb-4">
                                            <Card className="h-100">
                                                <Card.Img 
                                                    variant="top" 
                                                    // Prepend base URL to relative image path
                                                    src={ROOT_URL + banner.image_url} 
                                                    alt={banner.title} 
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title>{banner.title}</Card.Title>
                                                    <Card.Text>{banner.description}</Card.Text>
                                                    <div className="mt-auto d-flex justify-content-center">
                                                        {/* <Button 
                                                            variant="primary" 
                                                            size="sm" 
                                                            className="me-2"
                                                            onClick={() => handleEdit(banner)}
                                                            disabled={isSubmitting}
                                                        >
                                                            Edit
                                                        </Button> */}
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm" 
                                                            onClick={() => handleShowDeleteModal(banner)}
                                                            disabled={isSubmitting}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Delete Confirmation Modal (Unchanged) */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the banner titled "<strong>{bannerToDelete?.title}</strong>"? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed} disabled={isSubmitting}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default bannerAdd;