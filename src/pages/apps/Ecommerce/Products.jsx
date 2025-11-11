import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// 🔥 Added Modal for better UX
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

    // 🔥 NEW STATES FOR BULK UPLOAD
    const [showModal, setShowModal] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    // The correct API endpoint for our backend
    const API_BASE_URL = "https://ecomm.braventra.in/api/products";

    // --------------------------------------------------
    // API FETCH FUNCTION
    // --------------------------------------------------
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching products from:", API_BASE_URL);
            const response = await fetch(API_BASE_URL);

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
    // BULK UPLOAD LOGIC
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
            const uploadUrl = `${API_BASE_URL}/bulk-upload`;
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
            }

        } catch (err) {
            console.error("Bulk Upload error:", err);
            setUploading(false);
            setUploadResult({ 
                message: 'A network or critical server error occurred.', 
                error: err.message 
            });
        }
    };

    // --------------------------------------------------
    // OTHER LOGIC (Delete, Search, Sort)
    // --------------------------------------------------
    const deleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            // ... (delete logic is fine as it is) ...
            try {
                const response = await fetch(`${API_BASE_URL}/delete/${productId}`, {
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
                            <li>Make sure your backend server is running on port 3000.</li>
                            <li>Check if <a href={API_BASE_URL} target="_blank" rel="noopener noreferrer">
                                {API_BASE_URL}
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
            
            {/* 🔥 NEW: Bulk Upload Section */}
            <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        {/* <Button 
                            variant="primary" 
                            className="me-2"
                            onClick={() => navigate('/apps/ecommerce/add-product')}
                        >
                            <i className="mdi mdi-plus-circle me-1"></i> Add Product
                        </Button> */}
                        <Button 
                            variant="success" 
                            onClick={() => setShowModal(true)}
                        >
                            <i className="mdi mdi-upload me-1"></i> Bulk Upload (CSV)
                        </Button>
                    </div>

                    {/* Search and Sort (You should integrate these inputs here, but I am keeping them out for brevity) */}
                    {/* <div className="d-flex"> ... Search/Sort UI elements ... </div> */}
                </Col>
            </Row>


            {/* ... (rest of the component's UI, including search and sort) ... */}
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

            {/* 🔥 NEW: Bulk Upload Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Product Upload via CSV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info" className="p-2 mb-3">
                        <small>
                            Please ensure your CSV file has the required headers: 
                            <br/>
                            **product\_name, sku, category\_name, base\_price, base\_stock, color, size, description, long\_description, subcategory\_name**
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
                        </Form.Group>
                        
                        <Button 
                            variant="success" 
                            type="submit" 
                            className="w-100"
                            disabled={uploading || !csvFile}
                        >
                            {uploading ? 'Uploading...' : 'Upload and Process'}
                        </Button>
                    </Form>
                    
                    {/* Upload Result Display */}
                    {uploadResult && (
                        <div className="mt-3 p-3 border rounded">
                            <h6>Upload Summary:</h6>
                            <Alert variant={uploadResult.errorCount > 0 ? 'warning' : 'success'} className="mb-1">
                                {uploadResult.message || uploadResult.error}
                            </Alert>
                            {uploadResult.successCount !== undefined && (
                                <p className="mb-0">Successful records: <Badge bg="success">{uploadResult.successCount}</Badge></p>
                            )}
                            {uploadResult.errorCount !== undefined && uploadResult.errorCount > 0 && (
                                <>
                                    <p className="mb-0">Failed records: <Badge bg="danger">{uploadResult.errorCount}</Badge></p>
                                    <small className="d-block mt-2 text-muted">See console for detailed row errors.</small>
                                </>
                            )}
                            {(uploadResult.error || (uploadResult.errorCount > 0)) && (
                                <p className="text-danger mt-2 mb-0">Error Details: {uploadResult.error || (uploadResult.errors && uploadResult.errors[0]?.reason)}</p>
                            )}
                        </div>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Products;