import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Modal, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// Using a CDN to resolve the stylesheet import issue
const App = () => {
  // State for managing the list of banners
  const [banners, setBanners] = useState([]);
  // State to track if the form is in 'edit' mode and which banner is being edited
  const [isEditing, setIsEditing] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  // State for form submission status messages
  const [submitStatus, setSubmitStatus] = useState({ message: '', variant: '' });
  // State for loading indicator
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for the preview image
  const [previewImage, setPreviewImage] = useState(null);
  // State for the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  // A simple placeholder for a unique ID generator
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // --- API Simulation Functions (using localStorage) ---
  // In a real application, these would be API calls to a backend.
  
  // Fetches all banners from 'local storage'
  const fetchBanners = () => {
    try {
      const storedBanners = JSON.parse(localStorage.getItem('banners') || '[]');
      setBanners(storedBanners);
    } catch (error) {
      setSubmitStatus({ message: 'Error fetching banners.', variant: 'danger' });
    }
  };

  // Adds a new banner to 'local storage'
  const addBanner = (newBanner) => {
    const updatedBanners = [...banners, { ...newBanner, id: generateId() }];
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    setBanners(updatedBanners);
  };

  // Updates an existing banner in 'local storage'
  const updateBanner = (updatedBanner) => {
    const updatedBanners = banners.map(b => 
      b.id === updatedBanner.id ? { ...b, ...updatedBanner } : b
    );
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    setBanners(updatedBanners);
  };

  // Deletes a banner from 'local storage'
  const deleteBanner = (id) => {
    const updatedBanners = banners.filter(b => b.id !== id);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    setBanners(updatedBanners);
  };

  // --- useEffect hook to load banners on component mount ---
  useEffect(() => {
    fetchBanners();
  }, []);

  // Form validation schema
  const schemaResolver = yupResolver(yup.object().shape({
    title: yup.string().required("Please enter the banner title"),
    description: yup.string().required("Please enter a short description"),
    image: yup.mixed().test('required', 'Please upload a banner image', (value) => 
      isEditing ? true : (value && value.length > 0)
    ),
  }));

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: schemaResolver,
  });

  // Handle image file selection for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
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
  };

  // Handle form submission (add or edit)
  const onSubmit = (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ message: '', variant: '' });

    try {
      if (isEditing) {
        // Handle update
        updateBanner({
          id: currentBannerId,
          title: data.title,
          description: data.description,
          imageUrl: previewImage,
        });
        setSubmitStatus({ message: 'Banner updated successfully!', variant: 'success' });
      } else {
        // Handle new banner creation
        addBanner({
          title: data.title,
          description: data.description,
          imageUrl: previewImage,
        });
        setSubmitStatus({ message: 'Banner added successfully!', variant: 'success' });
      }
      resetForm();
    } catch (error) {
      setSubmitStatus({ message: `Failed to save banner: ${error.message}`, variant: 'danger' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sets the form to edit the selected banner
  const handleEdit = (banner) => {
    setValue('title', banner.title);
    setValue('description', banner.description);
    setPreviewImage(banner.imageUrl);
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
  const handleDeleteConfirmed = () => {
    if (bannerToDelete) {
      deleteBanner(bannerToDelete.id);
      setSubmitStatus({ message: 'Banner deleted successfully!', variant: 'success' });
      setBannerToDelete(null);
      setShowDeleteModal(false);
      resetForm();
    }
  };

  const handleCloseDeleteModal = () => {
    setBannerToDelete(null);
    setShowDeleteModal(false);
  };
  
  // Form input component for reuse
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
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image?.message}
                  </Form.Control.Feedback>
                  {previewImage && (
                    <div className="mt-3 text-center">
                      <h6>Image Preview:</h6>
                      <img src={previewImage} alt="Banner Preview" style={{ maxWidth: '400px', maxHeight: '300px' }} className="img-fluid" />
                    </div>
                  )}
                </Form.Group>
                
                <div className="text-center mt-4">
                  <Button type="button" variant="light" className="me-2" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="success" disabled={isSubmitting}>
                    {isSubmitting ? 'Uploading...' : (isEditing ? 'Update Banner' : 'Upload Banner')}
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
                          src={banner.imageUrl || 'https://via.placeholder.com/600x400.png?text=No+Image'} 
                          alt={banner.title} 
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Card.Body className="d-flex flex-column">
                          <Card.Title>{banner.title}</Card.Title>
                          <Card.Text>{banner.description}</Card.Text>
                          <div className="mt-auto d-flex justify-content-end">
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleEdit(banner)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleShowDeleteModal(banner)}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the banner titled "<strong>{bannerToDelete?.title}</strong>"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default App;
