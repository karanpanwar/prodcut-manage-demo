import React from "react";
import {connect} from "react-redux";
import "./product.css";
import {Button, Form, FormControl, InputGroup, OverlayTrigger, Popover} from "react-bootstrap";
import Dialog from "../../_component/dialog";
import GridView from "../../_component/grid-view";
import {
    addProduct,
    deleteAllProduct,
    updateProduct,
    setVisibilityFilter
} from "../../redux/action";
import {getProductsList, getVisibilityFilter} from "../../redux/selecter";

class Product extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            description: "",
            category: "Mobile",
            expiryDate: "",
            costPrice: "",
            sellPrice: "",
            discount: "   ",
            discountedSellPrice: "",
            gst: "",
            finalPrice: "",
            checked: false,
            modalShow: false,
            validated: false,
            showDeleteAll: false,
            isEditIdx: -1,
            search: ''
        };
        this.ref = React.createRef();
        this.categories = ['Mobile', 'TV', 'AC', 'Laptop', 'Computer'];

    }

    handleSubmit = () => {
        const form = this.ref.current;
        this.setState({validated: true});
        if (this.state.discountedSellPrice < this.state.costPrice) {
            alert(
                "Discounted sell price greater than cost price, please change your price inputs."
            );
            return;
        }
        if (form.checkValidity()) {
            const {
                modalShow,
                validated,
                showDeleteAll,
                isEditIdx,
                search,
                ...product
            } = this.state;
            this.state.isEditIdx === -1
                ? this.props.addProduct(product)
                : this.props.updateProduct({
                    idx: this.state.isEditIdx,
                    product: product,
                });
            this.closeModal();
        }
    };

    closeModal = () => {
        this.setState({
            name: "",
            description: "",
            category: "Mobile",
            expiryDate: "",
            costPrice: "",
            sellPrice: "",
            discount: "   ",
            discountedSellPrice: "",
            gst: "",
            finalPrice: "",
            modalShow: false,
            validated: false,
            isEditIdx: -1,
        });
    };

    handleInput = (e) => {
        this.setState({
            ...this.state,
            [e.target.id]: e.target.value,
        });
    };

    getNextDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    handlePriceValue = (e) => {
        this.setState({[e.target.id]: e.target.value}, () =>
            this.setDiscountedPrice()
        );
    };

    setDiscountedPrice = () => {
        const sellPrice = isNaN(parseFloat(this.state.sellPrice).toFixed(2))
            ? 0
            : parseFloat(this.state.sellPrice).toFixed(2);
        const discount = isNaN(parseFloat(this.state.discount).toFixed(2))
            ? 0
            : parseFloat(this.state.discount).toFixed(2);

        const discountPrice = (discount / 100) * sellPrice;
        const discountedSellPrice = this.state.sellPrice - discountPrice;
        this.setState({discountedSellPrice}, () => {
            if (this.state.gst) {
                this.setFinalPrice();
            }
        });
    };

    handleGst = (e) => {
        this.setState({[e.target.id]: e.target.value}, () =>
            this.setFinalPrice()
        );
    };

    setFinalPrice = () => {
        const discountedSellPrice = parseFloat(this.state.discountedSellPrice);
        const gst = parseFloat(this.state.gst);
        const gstPrice = discountedSellPrice * (gst / 100);
        const finalPrice = (discountedSellPrice + gstPrice).toFixed(2);
        this.setState({finalPrice}, () => this.state.finalPrice);
    };

    showDeleteAll = () => {
        this.setState({showDeleteAll: !this.state.showDeleteAll});
    };

    popover = () => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Category Filter</Popover.Title>
            <Popover.Content>
                <Form.Group controlId="formBasicCheckbox">
                    {
                        this.categories.map((category, i) => {
                            const checked = this.props.visibilityFilter.includes(category);
                            return (
                                <Form.Check key={i}
                                            type="checkbox" id={i}
                                            label={category}
                                            checked={checked}
                                            onChange={(e) => this.props.setVisibilityFilter({
                                                filter: category,
                                                checked: e.target.checked
                                            })}/>
                            );
                        })
                    }
                </Form.Group>
            </Popover.Content>
        </Popover>
    );

    render() {
        return (
            <>
                <div className={"container"}>
                    <div className="main-header">
                        <div className="title-heading">
                            <h5 className="report-title">Products List</h5>
                        </div>

                        <div className="filter-btn">
                            <InputGroup>
                                {this.state.showDeleteAll && (
                                    <Button className={'ml-2'} variant="danger" onClick={this.props.deleteAllProduct}>
                                        Delete All
                                    </Button>
                                )}
                                <FormControl
                                    className={'ml-2'}
                                    placeholder="Search"
                                    aria-label="Search"
                                    aria-describedby="search"
                                    onChange={(e) => this.setState({search: e.target.value.trim().toLowerCase()})}
                                />
                                <OverlayTrigger trigger="click" placement="bottom" overlay={this.popover()}>
                                    <Button className={'ml-2'}> Category Filter</Button>
                                </OverlayTrigger>
                                <Button className={'ml-2'} onClick={() => this.setState({modalShow: true})}>
                                    Add Product
                                </Button>
                            </InputGroup>

                        </div>
                    </div>
                </div>
                <Dialog
                    title={
                        this.state.isEditIdx === -1 ? "Add Product" : "Update Product info."
                    }
                    buttons={[
                        {onClick: this.closeModal, text: "Close"},
                        {
                            onClick: () => this.handleSubmit(),
                            text: this.state.isEditIdx === -1 ? "Add" : "Update",
                        },
                    ]}
                    modalProps={{
                        show: this.state.modalShow,
                        onHide: this.closeModal,
                        size: "lg",
                    }}
                >
                    <Form noValidate validated={this.state.validated} ref={this.ref}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                onChange={this.handleInput}
                                value={this.state.name}
                                required
                                size="sm"
                                type="text"
                                placeholder="Name"
                                maxLength={20}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Provide name, max character 20 allowed.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                onChange={this.handleInput}
                                value={this.state.description}
                                required
                                as={"textarea"}
                                size="sm"
                                type="text"
                                placeholder="Description"
                                maxLength={250}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Provide description, max 250 character allowed.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group required controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={this.handleInput}
                                value={this.state.category}
                            >
                                {
                                    this.categories.map(category => <option key={category}
                                                                            value={category}>{category}</option>)
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="expiryDate">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                                onChange={this.handleInput}
                                value={this.state.expiryDate}
                                min={this.getNextDate()}
                                required
                                size="sm"
                                type="date"
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Provide Expiry Date, today is not allowed.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="costPrice">
                            <Form.Label>Cost price ($)</Form.Label>
                            <Form.Control
                                onChange={this.handlePriceValue}
                                value={this.state.costPrice}
                                required
                                size="sm"
                                type="number"
                                min={"0.01"}
                                step={"0.01"}
                                placeholder="Cost price"
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Provide Cost price.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="sellPrice">
                            <Form.Label>Sell price ($)</Form.Label>
                            <Form.Control
                                onChange={this.handlePriceValue}
                                value={this.state.sellPrice}
                                required
                                size="sm"
                                type="number"
                                min={
                                    isNaN(parseInt(this.state.costPrice))
                                        ? 0
                                        : parseInt(this.state.costPrice) + 1
                                }
                                step={"0.01"}
                                placeholder="Sell price"
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Provide Sell price, greater than cost Price.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="discount">
                            <Form.Label>Discount(%)</Form.Label>
                            <Form.Control
                                onChange={this.handlePriceValue}
                                value={this.state.discount}
                                required
                                size="sm"
                                type="number"
                                min={"0.00"}
                                step={"0.01"}
                                max={"100"}
                                placeholder="Discount"
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Provide Discount percentage in between 0 to 100.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="discountedSellPrice">
                            <Form.Label>Discounted sell price ($)</Form.Label>
                            <Form.Control
                                size="sm"
                                readOnly
                                type="number"
                                value={this.state.discountedSellPrice}
                            />
                        </Form.Group>
                        <Form.Group controlId="gst">
                            <Form.Label>GST (%)</Form.Label>
                            <Form.Control
                                onChange={this.handleGst}
                                value={this.state.gst}
                                required
                                size="sm"
                                type="number"
                                min={"0.01"}
                                step={"0.01"}
                                max={"100"}
                                placeholder="GST"
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Provide GST percentage in between 0 to 100.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="final-price">
                            <Form.Label column={"lg"}>
                                Final Price: {this.state.finalPrice}
                            </Form.Label>
                        </Form.Group>
                    </Form>
                </Dialog>
                <GridView
                    columns={[
                        {label: "Product", key: "name"},
                        {label: "Description", key: "description"},
                        {label: "Category", key: "category"},
                        {label: "Expiry Date", key: "expiryDate"},
                        {label: "Cost Price", key: "costPrice", total: true},
                        {label: "Sell Price", key: "sellPrice", total: true},
                        {label: "Discount", key: "discount"},
                        {label: "Discounted Sell Price", key: "discountedSellPrice", total: true},
                        {label: "GST", key: "gst"},
                        {label: "Final Price", key: "finalPrice", total: true},
                    ]}
                    data={this.props.productsList.filter(row => row.name.toLowerCase().includes(this.state.search))}
                    showDeleteAll={this.showDeleteAll}
                    showDeleteBtn={this.state.showDeleteAll}
                    search={ this.state.search}
                    editModalShow={(idx) => {
                        const {
                            modalShow,
                            validated,
                            showDeleteAll,
                            search,
                            ...product
                        } = this.props.productsList[idx];
                        this.setState({modalShow: true, isEditIdx: idx, ...product});
                    }}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    const visibilityFilter = getVisibilityFilter(state);
    const list = getProductsList(state);
    let productsList;
    if(visibilityFilter.length > 0) {
        productsList = list.filter(row => visibilityFilter.includes(row.category));
    }else{
        productsList = list;
    }
    return {productsList, visibilityFilter};
};

export default connect(mapStateToProps, {
    addProduct,
    deleteAllProduct,
    updateProduct,
    setVisibilityFilter
})(Product);
