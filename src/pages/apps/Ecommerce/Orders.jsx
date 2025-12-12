import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Badge, Modal, Form, Alert, Table } from "react-bootstrap";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";

// components
import PageTitle from "../../../components/PageTitle";
import TableComponent from "../../../components/Table";

/* order column render */
const OrderColumn = ({ row }) => {
  return (
    <Link to={`/apps/ecommerce/order/details/${row.original.order_id}`} className="text-body fw-bold">
      #ORD{row.original.order_id}
    </Link>
  );
};

/* status column render */
const StatusColumn = ({ row }) => {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return "bg-success";
      case 'cancelled':
        return "bg-danger";
      case 'shipped':
        return "bg-info";
      case 'processing':
        return "bg-warning";
      case 'pending':
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <h5>
      <span className={classNames("badge", getStatusClass(row.original.status))}>
        {row.original.status}
      </span>
    </h5>
  );
};

/* action column render */
const ActionColumn = ({ row, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleView = () => {
    console.log('Viewing order:', row.original.order_id);
    navigate(`/apps/ecommerce/order/details/${row.original.order_id}`);
  };

  const handleEdit = () => {
    console.log('Editing order:', row.original.order_id);
    if (onEdit) {
      onEdit(row.original);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete order #ORD${row.original.order_id}?`)) {
      setIsDeleting(true);
      try {
        const response = await fetch(`https://ecomm.braventra.in/api/orders/delete/${row.original.order_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert('Order deleted successfully');
          window.location.reload();
        } else {
          alert(`Failed to delete order: ${result.error || result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete order');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="d-flex">
      <Button
        variant="outline-primary"
        size="sm"
        className="me-1 action-icon"
        onClick={handleView}
        title="View Order"
        disabled={isDeleting}
      >
        <i className="mdi mdi-eye"></i>
      </Button>
      <Button
        variant="outline-success"
        size="sm"
        className="me-1 action-icon"
        onClick={handleEdit}
        title="Edit Order"
        disabled={isDeleting}
      >
        <i className="mdi mdi-square-edit-outline"></i>
      </Button>
      {/* <Button
        variant="outline-danger"
        size="sm"
        className="action-icon"
        onClick={handleDelete}
        title="Delete Order"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <span className="spinner-border spinner-border-sm" role="status"></span>
        ) : (
          <i className="mdi mdi-delete"></i>
        )}
      </Button> */}
    </div>
  );
};

const columns = [
  {
    Header: "Order ID",
    accessor: "order_id",
    Cell: OrderColumn
  },
  {
    Header: "Customer Email",
    accessor: "user_email"
  },
  {
    Header: "Date",
    accessor: "order_date",
    Cell: ({ row }) => {
      const date = new Date(row.original.order_date);
      return (
        <>
          {date.toLocaleDateString('en-IN')}{" "}
          <small className="text-muted">{date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
        </>
      );
    }
  },
  {
    Header: "Source",
    accessor: "order_source",
    Cell: ({ row }) => {
      const getSourceIcon = (source) => {
        switch (source?.toLowerCase()) {
          case 'website': return <i className="mdi mdi-web me-1"></i>;
          case 'mobile': return <i className="mdi mdi-cellphone me-1"></i>;
          case 'admin': return <i className="mdi mdi-account-cog me-1"></i>;
          default: return <i className="mdi mdi-cart me-1"></i>;
        }
      };
      
      return (
        <span>
          {getSourceIcon(row.original.order_source)}
          {row.original.order_source}
        </span>
      );
    }
  },
  {
    Header: "Amount",
    accessor: "total_amount",
    Cell: ({ row }) => `₹${parseFloat(row.original.total_amount || 0).toFixed(2)}`
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: StatusColumn
  },
  {
    Header: "Actions",
    accessor: "actions",
    Cell: ActionColumn
  }
];

// main component
const Orders = () => {
  const [orderList, setOrderList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    status: '',
    total_amount: 0
  });

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching orders...');
      
      const response = await fetch('https://ecomm.braventra.in/api/orders', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('Orders response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Orders result:', result);
      
      if (result.status === 200 && result.data) {
        setOrderList(result.data);
        setFilteredOrders(result.data);
        console.log(`Loaded ${result.data.length} orders`);
      } else {
        throw new Error(result.error || result.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
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
  }, []);

  // Filter orders based on selected status
  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredOrders(orderList);
    } else {
      const filtered = orderList.filter(order => 
        order.status === statusFilter
      );
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orderList]);

  const changeOrderStatusGroup = (status) => {
    console.log('Changing status filter to:', status);
    setStatusFilter(status);
  };

  const handleExport = async () => {
    try {
      // Create CSV content
      const csvRows = [];
      
      // Add headers
      const headers = ['Order ID', 'Customer Email', 'Order Date', 'Source', 'Amount', 'Status'];
      csvRows.push(headers.join(','));
      
      // Add data rows
      filteredOrders.forEach(order => {
        const row = [
          `ORD${order.order_id}`,
          `"${order.user_email}"`,
          new Date(order.order_date).toLocaleDateString('en-IN'),
          order.order_source,
          `₹${parseFloat(order.total_amount || 0).toFixed(2)}`,
          order.status
        ];
        csvRows.push(row.join(','));
      });
      
      // Create blob and download
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Orders exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export orders');
    }
  };

  // Edit Order Functions
  const handleEditOrder = (order) => {
    console.log('Opening edit modal for order:', order.order_id);
    setSelectedOrder(order);
    setEditFormData({
      status: order.status,
      total_amount: order.total_amount
    });
    setShowEditModal(true);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleCloseEditModal = () => {
    console.log('Closing edit modal');
    setShowEditModal(false);
    setSelectedOrder(null);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    setEditingOrder(true);
    setEditError(null);
    
    console.log('Updating order:', selectedOrder.order_id, 'with data:', editFormData);

    try {
      const updateData = {
        status: editFormData.status
      };

      const response = await fetch(`https://ecomm.braventra.in/api/orders/${selectedOrder.order_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (response.ok) {
        setEditSuccess('Order updated successfully!');
        
        // Update local state immediately
        setOrderList(prev => prev.map(order => 
          order.order_id === selectedOrder.order_id 
            ? { ...order, status: editFormData.status } 
            : order
        ));
        
        // Close modal after 1 second
        setTimeout(() => {
          handleCloseEditModal();
        }, 1000);
      } else {
        setEditError(result.error || result.message || 'Failed to update order');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      setEditError('Failed to update order. Please try again.');
    } finally {
      setEditingOrder(false);
    }
  };

  return (
    <>
      <PageTitle 
        breadCrumbItems={[
          { label: "Ecommerce", path: "/apps/ecommerce/orders" },
          { label: "Orders", path: "/apps/ecommerce/orders", active: true }
        ]} 
        title={"Orders Management"}
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={8}>
                  <form className="row gy-2 gx-2 align-items-center justify-content-lg-start justify-content-between">
                    <div className="col-auto">
                      <div className="d-flex align-items-center w-auto">
                        <label htmlFor="status-select" className="me-2">
                          Status
                        </label>
                        <select 
                          className="form-select" 
                          id="status-select" 
                          value={statusFilter}
                          onChange={e => changeOrderStatusGroup(e.target.value)}
                        >
                          <option value="All">All</option>
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-auto">
                      <div className="d-flex align-items-center">
                        <span className="me-2">Showing:</span>
                        <Badge bg="primary" className="me-2">
                          {filteredOrders.length} orders
                        </Badge>
                        <Button 
                          variant="link" 
                          className="p-0"
                          onClick={fetchOrders}
                          disabled={loading}
                          title="Refresh"
                        >
                          <i className="mdi mdi-refresh"></i>
                        </Button>
                      </div>
                    </div>
                  </form>
                </Col>

                <Col lg={4}>
                  <div className="text-lg-end mt-xl-0 mt-2">
                    <Button 
                      className="btn btn-light mb-2" 
                      onClick={handleExport}
                      disabled={loading || filteredOrders.length === 0}
                    >
                      <i className="mdi mdi-download me-1"></i>
                      {loading ? 'Loading...' : 'Export'}
                    </Button>
                  </div>
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  <i className="mdi mdi-alert-circle me-2"></i>
                  {error}
                  <Button 
                    variant="link" 
                    className="p-0 ms-2"
                    onClick={fetchOrders}
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="mdi mdi-cart-off display-4 text-muted"></i>
                  <h4 className="mt-3">No orders found</h4>
                  <p className="text-muted">
                    {statusFilter !== "All" 
                      ? `No orders with status "${statusFilter}"`
                      : "No orders available"}
                  </p>
                </div>
              ) : (
                <TableComponent 
                  columns={columns.map(col => 
                    col.accessor === 'actions' 
                      ? { 
                          ...col, 
                          id: 'actions',
                          Cell: (props) => <ActionColumn {...props} onEdit={handleEditOrder} /> 
                        }
                      : { ...col, id: col.accessor }
                  )} 
                  data={filteredOrders.map(order => ({ ...order, id: order.order_id }))}
                  isSearchable={true} 
                  pageSize={10} 
                  sizePerPageList={[
                    { text: "10", value: 10 },
                    { text: "20", value: 20 },
                    { text: "50", value: 50 }
                  ]} 
                  isSortable={true} 
                  pagination={true} 
                  isSelectable={true} 
                  theadClass="table-light" 
                  searchBoxClass="mb-2" 
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Order Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="mdi mdi-pencil me-2"></i>
            Edit Order #{selectedOrder?.order_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && (
            <Alert variant="danger" onClose={() => setEditError(null)} dismissible className="mb-3">
              <i className="mdi mdi-alert-circle me-2"></i>
              {editError}
            </Alert>
          )}
          
          {editSuccess && (
            <Alert variant="success" className="mb-3">
              <i className="mdi mdi-check-circle me-2"></i>
              {editSuccess}
            </Alert>
          )}

          {selectedOrder && (
            <Form>
              <div className="mb-3">
                <Form.Label>Customer Email</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedOrder.user_email}
                  readOnly
                  disabled
                />
              </div>

              <div className="mb-3">
                <Form.Label>Order Date</Form.Label>
                <Form.Control
                  type="text"
                  value={new Date(selectedOrder.order_date).toLocaleString('en-IN')}
                  readOnly
                  disabled
                />
              </div>

              <div className="mb-3">
                <Form.Label>Order Source</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedOrder.order_source}
                  readOnly
                  disabled
                />
              </div>

              <div className="mb-3">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  type="text"
                  value={`₹${parseFloat(selectedOrder.total_amount || 0).toFixed(2)}`}
                  readOnly
                  disabled
                />
              </div>

              <div className="mb-3">
                <Form.Label>Update Status *</Form.Label>
                <Form.Select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  disabled={editingOrder}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Current status: <Badge bg={
                    selectedOrder.status === 'Completed' ? 'success' :
                    selectedOrder.status === 'Processing' ? 'warning' :
                    selectedOrder.status === 'Shipped' ? 'info' :
                    selectedOrder.status === 'Cancelled' ? 'danger' : 'secondary'
                  }>{selectedOrder.status}</Badge>
                </Form.Text>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleCloseEditModal} disabled={editingOrder}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateOrder}
            disabled={editingOrder || !editFormData.status}
          >
            {editingOrder ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </>
            ) : (
              <>
                <i className="mdi mdi-content-save me-1"></i>
                Update Order
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Orders;