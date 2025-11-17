import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Alert, Badge, Modal, Form } from "react-bootstrap"; 
import { useNavigate } from 'react-router-dom';

// components
import PageTitle from "../../../components/PageTitle";

// main component
const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();

    // 🔥 UPDATED STATES FOR BULK UPLOAD
    const [showModal, setShowModal] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    // The correct API endpoint for our backend
    const API_BASE_URL = "https://ecomm.braventra.in/api";

    // --------------------------------------------------
    // API FETCH FUNCTION
    // --------------------------------------------------
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching products from:", `${API_BASE_URL}/products`);
            const response = await fetch(`${API_BASE_URL}/products`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            if (data && data.data && data.data.products) {
                setProducts(data.data.products);
                setAllProducts(data.data.products);
            } else {
                throw new Error("Invalid data format received from API.");
            }
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --------------------------------------------------
    // BULK UPLOAD LOGIC - CORRECTED ENDPOINTS
    // --------------------------------------------------
    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
        setUploadResult(null); // Clear previous results
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!csvFile) {
            alert("Please select a CSV file to upload.");
            return;
        }

        const formData = new FormData();
        // The field name 'csvFile' MUST match the name in your Node.js code (upload.single('csvFile'))
        formData.append('csvFile', csvFile);

        setUploading(true);
        setUploadResult(null);

        try {
            // 🔥 CORRECT ENDPOINT: /api/bulk-upload/products
            const uploadUrl = `${API_BASE_URL}/bulk-upload/products`;
            console.log("Uploading CSV to:", uploadUrl);
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData, // FormData automatically sets the correct 'Content-Type: multipart/form-data'
                // No need to set headers like 'Content-Type: application/json'
            });

            const data = await response.json();
            console.log("Upload API Response:", data);
            
            setUploading(false);
            setUploadResult(data);
            
            // Re-fetch product list on successful completion (even if some rows had errors)
            if (response.ok) {
                fetchProducts();
                // Auto-close modal after successful upload
                setTimeout(() => setShowModal(false), 2000);
            }

        } catch (err) {
            console.error("Bulk Upload error:", err);
            setUploading(false);
            setUploadResult({ 
                status: 500,
                error: 'A network or critical server error occurred.', 
                details: err.message 
            });
        }
    };

    // 🔥 NEW: Download Template Function
    const downloadTemplate = async () => {
        try {
            // 🔥 CORRECT ENDPOINT: /api/bulk-upload/download-template
            const response = await fetch(`${API_BASE_URL}/bulk-upload/download-template`);
            
            if (!response.ok) {
                throw new Error('Failed to download template');
            }

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'product_bulk_upload_template.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (err) {
            console.error('Download template error:', err);
            alert('Error downloading template: ' + err.message);
        }
    };

    // 🔥 NEW: Get Template Info Function
    const getTemplateInfo = async () => {
        try {
            // 🔥 CORRECT ENDPOINT: /api/bulk-upload/template
            const response = await fetch(`${API_BASE_URL}/bulk-upload/template`);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Template info error:', err);
            return null;
        }
    };

    // --------------------------------------------------
    // OTHER LOGIC (Delete, Search, Sort) - UNCHANGED
    // --------------------------------------------------
    const deleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/products/delete/${productId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error("Failed to delete product.");
                }

                const updatedProducts = products.filter(p => p.product_id !== productId);
                setProducts(updatedProducts);
                setAllProducts(updatedProducts);
                console.log(`Product with ID ${productId} deleted successfully.`);
                alert("Product deleted successfully!");

            } catch (err) {
                console.error("Delete error:", err);
                alert(`Error: ${err.message}`);
            }
        }
    };

    const searchProduct = (value) => {
        setSearchTerm(value);

        if (value === "") {
            setProducts(allProducts);
        } else {
            const filteredProducts = allProducts.filter(product =>
                product.name && product.name.toLowerCase().includes(value.toLowerCase())
            );
            setProducts(filteredProducts);
        }
    };

    const handleSortChange = (value) => {
        let sortedProducts = [...allProducts];

        switch (value) {
            case "pricelow":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "pricehigh":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case "lowstock":
                sortedProducts = sortedProducts.filter(product => product.stock_quantity < 10);
                break;
            default:
                setProducts(allProducts);
                return;
        }

        if (searchTerm) {
            sortedProducts = sortedProducts.filter(product =>
                product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setProducts(sortedProducts);
    };

    const getStockStatus = (product) => {
        if (product.stock_quantity === 0) return "out-of-stock";
        if (product.stock_quantity < 10) return "low-stock";
        return "in-stock";
    };

    const getStockBadge = (product) => {
        const status = getStockStatus(product);

        switch (status) {
            case "out-of-stock":
                return <Badge bg="danger" className="ms-2">Out of Stock</Badge>;
            case "low-stock":
                return <Badge bg="warning" className="ms-2" text="dark">Low Stock</Badge>;
            case "in-stock":
                return <Badge bg="success" className="ms-2">In Stock</Badge>;
            default:
                return null;
        }
    };

    // --------------------------------------------------
    // RENDER LOGIC
    // --------------------------------------------------
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading products...</span>
                </div>
                <span className="ms-2">Loading products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Products</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <div className="mb-3">
                        <h6>Troubleshooting steps:</h6>
                        <ol>
                            <li>Make sure your backend server is running.</li>
                            <li>Check if <a href={`${API_BASE_URL}/products`} target="_blank" rel="noopener noreferrer">
                                {`${API_BASE_URL}/products`}
                            </a> works in your browser.</li>
                            <li>Check your browser console for detailed error messages.</li>
                        </ol>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <React.Fragment>
            <PageTitle
                breadCrumbItems={[{ label: "Products", path: "/apps/ecommerce/products", active: true }]}
                title={"Products"}
            />
            
            {/* 🔥 UPDATED: Bulk Upload Section */}
            <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        <Button 
                            variant="success" 
                            onClick={() => setShowModal(true)}
                            className="me-2"
                        >
                            <i className="mdi mdi-upload me-1"></i> Bulk Upload (CSV)
                        </Button>
                        {/* <Button 
                            variant="outline-primary" 
                            onClick={downloadTemplate}
                        >
                            <i className="mdi mdi-download me-1"></i> Download Template
                        </Button> */}
                    </div>

                    {/* Search Input */}
                    <div className="d-flex align-items-center">
                        <Form.Control
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => searchProduct(e.target.value)}
                            style={{ width: '250px' }}
                        />
                    </div>
                </Col>
            </Row>

            {/* Sort Dropdown */}
            <Row className="mb-3">
                <Col>
                    <Form.Select 
                        onChange={(e) => handleSortChange(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">Sort by...</option>
                        <option value="pricelow">Price: Low to High</option>
                        <option value="pricehigh">Price: High to Low</option>
                        <option value="lowstock">Low Stock</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Products Grid */}
            <Row className="mt-3">
                {products.length > 0 ? (
                    products.map((product) => {
                        return (
                            <Col key={product.product_id} md={6} xl={3} className="mb-4">
                                <Card className="product-box h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <div className="product-action">
                                            <Button variant="success" size="xs" className="waves-effect waves-light me-1"
                                                onClick={() => navigate(`/apps/ecommerce/edit-product/${product.product_id}`)} >
                                                <i className="mdi mdi-pencil"></i>
                                            </Button>
                                            <Button variant="danger" size="xs" className="waves-effect waves-light"
                                                onClick={() => deleteProduct(product.product_id)}
                                            >
                                                <i className="mdi mdi-close"></i>
                                            </Button>
                                        </div>

                                        {/* Product image */}
                                        <div className="bg-light flex-grow-0 text-center" style={{ height: '200px', overflow: 'hidden' }}>
                                            <img
                                                src={`https://ecomm.braventra.in${product.image_url}`}
                                                alt={product.name}
                                                className="img-fluid h-100"
                                                style={{ objectFit: 'contain', width: '100%' }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                    e.target.style.objectFit = 'cover';
                                                }}
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="product-info mt-3">
                                            <h5 className="font-16 mt-0 mb-2" title={product.name}>
                                                <Link to={`/apps/ecommerce/product-details/${product.product_id}`} className="text-dark text-decoration-none">
                                                    {product.name}
                                                </Link>
                                            </h5>

                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                <div>
                                                    <span className="fw-bold fs-5">${product.price}</span>
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            Stock: {product.stock_quantity}
                                                        </small>
                                                        {getStockBadge(product)}
                                                    </div>
                                                </div>

                                                <div className="text-end">
                                                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/apps/ecommerce/product-details/${product.product_id}`)}>
                                                        <i className="mdi mdi-eye me-1"></i> View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <Col className="text-center py-5">
                        <div className="py-5">
                            <i className="mdi mdi-emoticon-sad-outline display-4 text-muted"></i>
                            <h4 className="mt-3">No products found</h4>
                            <p className="text-muted">Try adjusting your search or filter criteria</p>
                            {searchTerm && (
                                <Button
                                    variant="outline-primary"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setProducts(allProducts);
                                    }}
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </Col>
                )}
            </Row>

            {/* 🔥 UPDATED: Bulk Upload Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Product Upload via CSV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info" className="mb-3">
                        <h6>CSV Format Requirements:</h6>
                        <small>
                            <strong>Required fields:</strong> name, price<br/>
                            <strong>Optional fields:</strong> description, long_description, image_url, stock_quantity,<br/>
                            brand_id, brand_name, category_id, category_name, subcategory_id, subcategory_name<br/>
                            <strong>Download the template for all available columns and examples.</strong>
                        </small>
                    </Alert>
                    
                    <Form onSubmit={handleBulkUpload}>
                        <Form.Group controlId="csvFile" className="mb-3">
                            <Form.Label>Select CSV File</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept=".csv" 
                                onChange={handleFileChange} 
                                required
                            />
                            <Form.Text className="text-muted">
                                Maximum file size: 10MB. Only CSV files are allowed.
                            </Form.Text>
                        </Form.Group>
                        
                        <div className="d-grid gap-2">
                            <Button 
                                variant="success" 
                                type="submit" 
                                disabled={uploading || !csvFile}
                            >
                                {uploading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload and Process CSV'
                                )}
                            </Button>
                            
                            <Button 
                                variant="outline-primary" 
                                onClick={downloadTemplate}
                                type="button"
                            >
                                <i className="mdi mdi-download me-1"></i> Download CSV Template
                            </Button>
                        </div>
                    </Form>
                    
                    {/* Upload Result Display */}
                    {uploadResult && (
                        <div className="mt-3 p-3 border rounded">
                            <h6>Upload Results:</h6>
                            <Alert variant={
                                uploadResult.status === 200 ? 'success' : 
                                uploadResult.status === 400 ? 'warning' : 'danger'
                            } className="mb-2">
                                {uploadResult.message || uploadResult.error}
                            </Alert>
                            
                            {uploadResult.summary && (
                                <div className="row text-center">
                                    <div className="col">
                                        <strong>Total Processed</strong><br/>
                                        <Badge bg="secondary">{uploadResult.summary.total_processed}</Badge>
                                    </div>
                                    <div className="col">
                                        <strong>Successful</strong><br/>
                                        <Badge bg="success">{uploadResult.summary.successful}</Badge>
                                    </div>
                                    <div className="col">
                                        <strong>Failed</strong><br/>
                                        <Badge bg="danger">{uploadResult.summary.failed}</Badge>
                                    </div>
                                </div>
                            )}
                            
                            {uploadResult.errors && uploadResult.errors.length > 0 && (
                                <div className="mt-2">
                                    <small className="text-muted">
                                        Check browser console for detailed error information per row.
                                    </small>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false);
                        setUploadResult(null);
                        setCsvFile(null);
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Products;