import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Alert, Badge } from "react-bootstrap";
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

  // The correct API endpoint for our backend
  const API_BASE_URL = "https://ecomm.braventra.in/api/products";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from:", API_BASE_URL);
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Corrected: Access the nested 'products' array
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

    fetchProducts();
  }, []);

  // API call for deleting a product
  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/delete/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error("Failed to delete product.");
        }

        // Remove the product from the local state
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

  // Search product by name
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

  // The sorting logic now works with our database schema
  const handleSortChange = (value) => {
    // Note: The backend doesn't support these sorts, this is client-side logic
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
        // By default, show all
        setProducts(allProducts);
        return;
    }

    // Apply search filter if it exists
    if (searchTerm) {
      sortedProducts = sortedProducts.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setProducts(sortedProducts);
  };

  // New helper function to get stock status
  const getStockStatus = (product) => {
    if (product.stock_quantity === 0) return "out-of-stock";
    if (product.stock_quantity < 10) return "low-stock";
    return "in-stock";
  };

  // New helper function to get stock status badge
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
      {/* ... (rest of the component's UI, including search and sort) ... */}
      <Row className="mt-3">
        {products.length > 0 ? (
          products.map((product) => {
            const stockStatus = getStockStatus(product);

            return (
              <Col key={product.product_id} md={6} xl={3} className="mb-4">
                <Card className="product-box h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="product-action">
                      <Button variant="success" size="xs" className="waves-effect waves-light me-1"
                        onClick={() => navigate(`/apps/ecommerce/edit-product/${product.product_id}`)}
                      >
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
                        style={{ objectFit: 'contain', width: '100%' }} // This is the key change
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

                      {/* The price and stock display logic is simplified to match our database */}
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
    </React.Fragment>
  );
};

export default Products;
