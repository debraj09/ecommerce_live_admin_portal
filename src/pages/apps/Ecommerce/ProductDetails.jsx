import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Card, ProgressBar, Tab, Badge, Button, Alert } from "react-bootstrap";

// Stock Table Component
const Stocks = ({ product }) => {
  if (!product || !product.variations || product.variations.length === 0) {
    return (
      <Alert variant="info" className="mt-4">
        This product has no variations.
      </Alert>
    );
  }

  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered table-centered mb-0">
        <thead className="table-light">
          <tr>
            <th>Variation</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {product.variations.map((variation, index) => {
            // Use variation.stock_quantity if available, otherwise fallback to base_stock
            const stockQty =
              variation.stock_quantity !== undefined
                ? variation.stock_quantity
                : product.base_stock ?? 0;

            return (
              <tr key={index}>
                <td>
                  {variation.name}
                  {variation.color && ` - ${variation.color}`}
                  {variation.size && ` - ${variation.size}`}
                </td>
                <td>{variation.sku}</td>
                <td>${product.base_price}</td>
                <td>
                  <div className="row align-items-center g-0">
                    <div className="col-auto">
                      <span className="me-2">{stockQty} units</span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        now={stockQty}
                        className="progress-sm"
                        variant={
                          stockQty > 50
                            ? "success"
                            : stockQty > 10
                            ? "warning"
                            : "danger"
                        }
                      />
                    </div>
                  </div>
                </td>
                <td>
                  {stockQty > 50 ? (
                    <Badge bg="success">In Stock</Badge>
                  ) : stockQty > 10 ? (
                    <Badge bg="warning" text="dark">
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge bg="danger">Out of Stock</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Image Component with Error Handling
const ProductImage = ({ src, alt, className, style }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div
        className={className}
        style={{
          ...style,
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6c757d",
        }}
      >
        <div className="text-center">
          <i className="mdi mdi-image-off" style={{ fontSize: "2rem" }}></i>
          <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            No Image
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setImageError(true)}
    />
  );
};

// Main ProductDetails Component
const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://ecomm.braventra.in/api/products";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${productId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data && data.data) {
          setProduct(data.data); // ✅ use "data.data" (your API wraps product inside "data")
        } else {
          throw new Error("Product not found or invalid data format.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
        <span className="ms-2">Loading product details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Product</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="me-2"
          >
            Try Again
          </Button>
          <Link to="/apps/ecommerce/products" className="btn btn-outline-secondary">
            Back to Products
          </Link>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          <Alert.Heading>Product Not Found</Alert.Heading>
          <p>The requested product could not be found.</p>
          <Link to="/apps/ecommerce/products" className="btn btn-primary">
            Back to Products
          </Link>
        </Alert>
      </div>
    );
  }

  // ✅ fallback for stock badge (base_stock if no variations stock)
  const hasStock =
    (product.variations &&
      product.variations.some(
        (v) => (v.stock_quantity ?? product.base_stock ?? 0) > 0
      )) ||
    product.base_stock > 0;

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col lg={5}>
                  <Tab.Container id="product-images" defaultActiveKey="main-image">
                    <Tab.Content className="p-0">
                      <Tab.Pane eventKey="main-image">
                        <ProductImage
                          // ✅ Remove "/public", Express already serves "public"
                          src={
                            product.image_url
                              ? `https://ecomm.braventra.in${product.image_url.replace(
                                  "/public",
                                  ""
                                )}`
                              : null
                          }
                          alt={product.name}
                          className="img-fluid mx-auto d-block rounded"
                          style={{
                            maxHeight: "400px",
                            objectFit: "contain",
                            width: "100%",
                          }}
                        />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </Col>

                <Col lg={7}>
                  <div className="ps-xl-3 mt-3 mt-xl-0">
                    {product.brand_name && (
                      <Link to="#" className="text-primary">
                        {product.brand_name}
                      </Link>
                    )}
                    <h4 className="mb-3">{product.name}</h4>

                    <h4 className="mb-4">
                      <span
                        className={`badge ${
                          hasStock ? "bg-success" : "bg-danger"
                        } mb-4`}
                      >
                        {hasStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </h4>

                    {product.description && (
                      <p className="text-muted mb-4">{product.description}</p>
                    )}

                    {product.long_description && (
                      <p className="text-muted mb-4">
                        {product.long_description}
                      </p>
                    )}
                  </div>
                </Col>
              </Row>

              {product.variations && product.variations.length > 0 && (
                <Stocks product={product} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductDetails;
