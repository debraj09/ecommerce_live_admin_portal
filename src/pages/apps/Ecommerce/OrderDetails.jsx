import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Badge, Alert, Modal, Form } from "react-bootstrap";

// components
import PageTitle from "../../../components/PageTitle";

// Track order component
const TrackOrder = ({ status, updatedAt }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: 'mdi-cart-plus' },
    { key: 'processing', label: 'Processing', icon: 'mdi-cog' },
    { key: 'shipped', label: 'Shipped', icon: 'mdi-truck-delivery' },
    { key: 'completed', label: 'Delivered', icon: 'mdi-check-circle' }
  ];

  const statusOrder = {
    'Pending': 0,
    'Processing': 1,
    'Shipped': 2,
    'Completed': 3,
    'Delivered': 3,
    'Cancelled': -1
  };

  const currentStep = statusOrder[status] || 0;

  return (
    <div className="track-order-list">
      <ul className="list-unstyled">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isActive = index === currentStep;
          const isCancelled = status === 'Cancelled';

          return (
            <li key={step.key} className={isCompleted ? 'completed' : ''}>
              <div className="d-flex align-items-center">
                <div className={`step-icon me-3 ${isCompleted ? 'bg-primary' : 'bg-light'}`}>
                  <i className={`mdi ${step.icon} ${isCompleted ? 'text-white' : 'text-muted'}`}></i>
                </div>
                <div>
                  <h5 className="mt-0 mb-1">{step.label}</h5>
                  {isActive && !isCancelled && (
                    <p className="text-muted mb-0">
                      {new Date(updatedAt).toLocaleString('en-IN')}
                    </p>
                  )}
                  {isCancelled && index === 0 && (
                    <p className="text-muted mb-0">
                      Order cancelled on {new Date(updatedAt).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {status === 'Cancelled' && (
        <Alert variant="danger" className="mt-3">
          <i className="mdi mdi-alert-circle me-2"></i>
          This order has been cancelled.
        </Alert>
      )}
    </div>
  );
};

// Items table component
const Items = ({ items, totalAmount }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-centered mb-0">
        <thead className="table-light">
          <tr>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.product_name || 'Product'}</td>
                <td>
                  <Badge bg="light" className="text-dark">
                    {item.sku || 'N/A'}
                  </Badge>
                </td>
                <td>{item.quantity}</td>
                <td>₹{parseFloat(item.unit_price || 0).toFixed(2)}</td>
                <td>₹{parseFloat(item.subtotal || 0).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No items found for this order
              </td>
            </tr>
          )}
          <tr>
            <th colSpan={4} className="text-end">
              Total Amount:
            </th>
            <td>
              <div className="fw-bold">₹{parseFloat(totalAmount || 0).toFixed(2)}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Shipping info component
const ShippingInfo = ({ order }) => {
  return (
    <Card>
      <Card.Body>
        <h5 className="font-family-primary fw-semibold mb-3">
          <i className="mdi mdi-truck me-2"></i>
          Shipping Information
        </h5>
        <div className="mb-2">
          <small className="text-muted">Customer:</small>
          <div className="fw-semibold">{order.customer_email || order.user_email || 'N/A'}</div>
        </div>
        <div className="mb-2">
          <small className="text-muted">User ID:</small>
          <div className="fw-semibold">{order.user_id || 'N/A'}</div>
        </div>
        <div className="mb-2">
          <small className="text-muted">Order Source:</small>
          <div className="fw-semibold">{order.order_source || 'N/A'}</div>
        </div>
        <div className="mb-0">
          <small className="text-muted">Order Date:</small>
          <div className="fw-semibold">
            {order.order_date ? new Date(order.order_date).toLocaleString('en-IN') : 'N/A'}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Billing info component
const BillingInfo = ({ order }) => {
  const getPaymentMethod = (source) => {
    switch (source?.toLowerCase()) {
      case 'website': return 'Online Payment';
      case 'mobile': return 'Mobile Payment';
      case 'admin': return 'Manual Entry';
      default: return 'Online Payment';
    }
  };

  const getPaymentStatus = (status) => {
    if (status === 'Completed' || status === 'Delivered') {
      return 'Paid';
    } else if (status === 'Cancelled') {
      return 'Refunded';
    } else {
      return 'Pending';
    }
  };

  const paymentStatus = getPaymentStatus(order.status);

  return (
    <Card>
      <Card.Body>
        <h5 className="font-family-primary fw-semibold mb-3">
          <i className="mdi mdi-credit-card me-2"></i>
          Billing Information
        </h5>
        <div className="mb-2">
          <small className="text-muted">Payment Method:</small>
          <div className="fw-semibold">{getPaymentMethod(order.order_source)}</div>
        </div>
        <div className="mb-2">
          <small className="text-muted">Payment Status:</small>
          <div>
            <Badge bg={paymentStatus === 'Paid' ? 'success' : paymentStatus === 'Refunded' ? 'danger' : 'warning'}>
              {paymentStatus}
            </Badge>
          </div>
        </div>
        <div className="mb-2">
          <small className="text-muted">Total Amount:</small>
          <div className="fw-semibold">₹{parseFloat(order.total_amount || 0).toFixed(2)}</div>
        </div>
        <div className="mb-0">
          <small className="text-muted">Last Updated:</small>
          <div className="fw-semibold">
            {order.updated_at ? new Date(order.updated_at).toLocaleString('en-IN') : 'N/A'}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Delivery info component
const DeliveryInfo = ({ order }) => {
  const getDeliveryStatus = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return { icon: 'mdi-check-circle', color: 'success', text: 'Delivered' };
      case 'Shipped':
        return { icon: 'mdi-truck-check', color: 'info', text: 'Shipped' };
      case 'Processing':
        return { icon: 'mdi-cog', color: 'warning', text: 'Processing' };
      case 'Cancelled':
        return { icon: 'mdi-cancel', color: 'danger', text: 'Cancelled' };
      default:
        return { icon: 'mdi-clock-outline', color: 'secondary', text: 'Pending' };
    }
  };

  const deliveryStatus = getDeliveryStatus(order.status);

  return (
    <Card>
      <Card.Body>
        <h5 className="font-family-primary fw-semibold mb-3">
          <i className="mdi mdi-package-variant me-2"></i>
          Delivery Information
        </h5>
        <div className="text-center py-3">
          <i className={`mdi ${deliveryStatus.icon} display-4 text-${deliveryStatus.color} mb-3`}></i>
          <h4 className="mb-2">{deliveryStatus.text}</h4>
          <p className="mb-1">
            <span className="fw-semibold">Order ID:</span> #{order.order_id}
          </p>
          <p className="mb-0">
            <span className="fw-semibold">Order Source:</span> {order.order_source}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

// Main OrderDetails component
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching order details for ID:', id);
      
      const response = await fetch(`https://ecomm.braventra.in/api/orders/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('Order details response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        
        if (response.status === 404) {
          throw new Error('Order not found');
        } else if (response.status === 500) {
          throw new Error(`Server error: ${errorData.error || errorData.message || 'Internal server error'}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Order details result:', result);
      
      if (result.status === 200 && result.data) {
        setOrder(result.data);
        setUpdateStatus(result.data.status);
        console.log('Order data loaded successfully');
      } else {
        throw new Error(result.message || result.error || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to fetch order details. Please check the server logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
    
    // Suppress React key warnings temporarily
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('A props object containing a "key" prop')) {
        return;
      }
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, [id]);

  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank');
    
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice - Order #${order?.order_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .company-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #333;
            }
            .invoice-title { 
              font-size: 20px; 
              margin: 10px 0; 
              color: #666;
            }
            .invoice-details { 
              margin: 20px 0; 
              display: flex; 
              justify-content: space-between;
            }
            .detail-section { flex: 1; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 10px; 
              text-align: left;
            }
            th { 
              background-color: #f8f9fa; 
              font-weight: bold;
            }
            .text-end { text-align: right; }
            .total-row { 
              font-weight: bold; 
              font-size: 1.1em;
              background-color: #f8f9fa;
            }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="company-name">Ecomm Store</div>
            <div class="invoice-title">INVOICE</div>
            <div>Order #${order?.order_id}</div>
          </div>
          
          <div class="invoice-details">
            <div class="detail-section">
              <strong>Customer Information:</strong><br/>
              Email: ${order?.customer_email || order?.user_email || 'N/A'}<br/>
              User ID: ${order?.user_id || 'N/A'}<br/>
              Order Source: ${order?.order_source || 'N/A'}
            </div>
            <div class="detail-section">
              <strong>Order Information:</strong><br/>
              Order Date: ${order?.order_date ? new Date(order.order_date).toLocaleString('en-IN') : 'N/A'}<br/>
              Status: ${order?.status || 'N/A'}<br/>
              Last Updated: ${order?.updated_at ? new Date(order.updated_at).toLocaleString('en-IN') : 'N/A'}
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order?.items ? order.items.map(item => `
                <tr>
                  <td>${item.product_name || 'Product'}</td>
                  <td>${item.sku || 'N/A'}</td>
                  <td>${item.quantity}</td>
                  <td>₹${parseFloat(item.unit_price || 0).toFixed(2)}</td>
                  <td>₹${parseFloat(item.subtotal || 0).toFixed(2)}</td>
                </tr>
              `).join('') : '<tr><td colspan="5">No items found</td></tr>'}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="4" class="text-end"><strong>Total Amount:</strong></td>
                <td><strong>₹${parseFloat(order?.total_amount || 0).toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="footer">
            Thank you for your business!<br/>
            Invoice generated on ${new Date().toLocaleString('en-IN')}
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleUpdateStatus = async () => {
    if (!order || !updateStatus) return;

    setUpdating(true);
    console.log('Updating order status:', order.order_id, 'to', updateStatus);
    
    try {
      const response = await fetch(`https://ecomm.braventra.in/api/orders/${order.order_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ status: updateStatus })
      });

      const result = await response.json();
      console.log('Update status response:', result);

      if (response.ok) {
        setActionSuccess('Order status updated successfully!');
        setShowUpdateModal(false);
        fetchOrderDetails(); // Refresh order details
      } else {
        throw new Error(result.error || result.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm(`Are you sure you want to cancel order #${order.order_id}?`)) {
      setUpdating(true);
      console.log('Cancelling order:', order.order_id);
      
      try {
        const response = await fetch(`https://ecomm.braventra.in/api/orders/${order.order_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({ status: 'Cancelled' })
        });

        const result = await response.json();
        console.log('Cancel order response:', result);

        if (response.ok) {
          setActionSuccess('Order cancelled successfully!');
          fetchOrderDetails(); // Refresh order details
        } else {
          throw new Error(result.error || result.message || 'Failed to cancel order');
        }
      } catch (err) {
        console.error('Error cancelling order:', err);
        setError('Failed to cancel order. Please try again.');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleMarkCompleted = async () => {
    if (!order) return;
    
    if (window.confirm(`Mark order #${order.order_id} as completed?`)) {
      setUpdating(true);
      console.log('Marking order as completed:', order.order_id);
      
      try {
        const response = await fetch(`https://ecomm.braventra.in/api/orders/${order.order_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({ status: 'Completed' })
        });

        const result = await response.json();
        console.log('Mark completed response:', result);

        if (response.ok) {
          setActionSuccess('Order marked as completed!');
          fetchOrderDetails();
        } else {
          throw new Error(result.error || result.message || 'Failed to update order');
        }
      } catch (err) {
        console.error('Error marking order as completed:', err);
        setError('Failed to update order. Please try again.');
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert variant="danger">
          <i className="mdi mdi-alert-circle me-2"></i>
          {error}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/apps/ecommerce/orders')}>
          <i className="mdi mdi-arrow-left me-1"></i> Back to Orders
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <Alert variant="warning">
          <i className="mdi mdi-alert me-2"></i>
          Order not found
        </Alert>
        <Button variant="primary" onClick={() => navigate('/apps/ecommerce/orders')}>
          <i className="mdi mdi-arrow-left me-1"></i> Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Ecommerce", path: "/apps/ecommerce/orders" },
          { label: "Orders", path: "/apps/ecommerce/orders" },
          { label: "Order Details", path: `/apps/ecommerce/order/details/${order.order_id}`, active: true }
        ]}
        title={`Order Details #${order.order_id}`}
      />

      {actionSuccess && (
        <Alert variant="success" onClose={() => setActionSuccess(null)} dismissible className="mb-3">
          <i className="mdi mdi-check-circle me-2"></i>
          {actionSuccess}
        </Alert>
      )}

      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="header-title mb-0">
                    <i className="mdi mdi-cart-outline me-2"></i>
                    Order #{order.order_id}
                  </h4>
                  <p className="text-muted mb-0">
                    <i className="mdi mdi-email-outline me-1"></i>
                    Customer: {order.customer_email || order.user_email || 'N/A'}
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <Badge 
                    bg={
                      order.status === 'Completed' ? 'success' :
                      order.status === 'Processing' ? 'warning' :
                      order.status === 'Shipped' ? 'info' :
                      order.status === 'Cancelled' ? 'danger' : 'secondary'
                    }
                    className="me-3 fs-6"
                  >
                    {order.status}
                  </Badge>
                  <Button 
                    variant="outline-primary" 
                    className="me-2"
                    onClick={handlePrintInvoice}
                  >
                    <i className="mdi mdi-printer me-1"></i> Print
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowUpdateModal(true)}
                  >
                    <i className="mdi mdi-pencil me-1"></i> Edit
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-3">
                <i className="mdi mdi-map-marker-path me-2"></i>
                Track Order
              </h4>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <h5 className="mt-0">Order ID:</h5>
                    <p className="fw-semibold">#{order.order_id}</p>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <h5 className="mt-0">Order Date:</h5>
                    <p className="fw-semibold">
                      {order.order_date ? new Date(order.order_date).toLocaleString('en-IN') : 'N/A'}
                    </p>
                  </div>
                </Col>
              </Row>
              <TrackOrder status={order.status} updatedAt={order.updated_at} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-3">
                <i className="mdi mdi-package-variant me-2"></i>
                Order Items
              </h4>
              <Items items={order.items} totalAmount={order.total_amount} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col lg={4}>
          <ShippingInfo order={order} />
        </Col>

        <Col lg={4}>
          <BillingInfo order={order} />
        </Col>

        <Col lg={4}>
          <DeliveryInfo order={order} />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Body className="text-center">
              <Button 
                variant="light" 
                className="me-2" 
                onClick={() => navigate('/apps/ecommerce/orders')}
              >
                <i className="mdi mdi-arrow-left me-1"></i> Back to Orders
              </Button>
              
              {order.status !== 'Cancelled' && order.status !== 'Completed' && (
                <Button 
                  variant="success" 
                  className="me-2" 
                  onClick={handleMarkCompleted}
                  disabled={updating}
                >
                  {updating ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : (
                    <i className="mdi mdi-check me-1"></i>
                  )}
                  Mark as Completed
                </Button>
              )}
              
              {order.status !== 'Cancelled' && (
                <Button 
                  variant="danger" 
                  onClick={handleCancelOrder}
                  disabled={updating}
                >
                  {updating ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : (
                    <i className="mdi mdi-cancel me-1"></i>
                  )}
                  Cancel Order
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="mdi mdi-pencil me-2"></i>
            Update Order Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3">
              <Form.Label>Order #{order.order_id}</Form.Label>
              <Form.Control
                type="text"
                value={order.customer_email || order.user_email || 'N/A'}
                readOnly
                disabled
              />
            </div>
            <div className="mb-3">
              <Form.Label>Current Status</Form.Label>
              <Form.Control
                type="text"
                value={order.status}
                readOnly
                disabled
              />
            </div>
            <div className="mb-3">
              <Form.Label>Update Status *</Form.Label>
              <Form.Select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                disabled={updating}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowUpdateModal(false)} disabled={updating}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateStatus}
            disabled={updating || updateStatus === order.status}
          >
            {updating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </>
            ) : (
              <>
                <i className="mdi mdi-content-save me-1"></i>
                Update Status
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetails;