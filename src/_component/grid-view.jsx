import React, {useState, useEffect} from "react";
import {Table, Alert, Form, Button} from "react-bootstrap";
import {connect} from "react-redux";
import {deleteProduct, checkProduct, checkAllProduct} from "../redux/action";
import {getCheckedProductsLength} from "../redux/selecter";
import Dialog from "../_component/dialog";

function GridView(props) {
    const [{showDeleteDialog, idx}, setDeleteDialog] = useState({showDeleteDialog: false, idx: -1});

    useEffect(() => {
        if (props.checkedLength > 1 && !props.showDeleteBtn) {
            props.showDeleteAll();
        } else {
            (props.showDeleteBtn && props.checkedLength === 1) && props.showDeleteAll();
        }
    });

    const getSum = arr => arr.reduce((acc, item) => acc + item, 0);

    return (
        <div className="container">
            {Array.isArray(props.data) && props.data.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>
                            <Form.Check
                                custom
                                type={"checkbox"}
                                id={"checkedAll"}
                                label={""}
                                onChange={(e) => {
                                    props.checkAllProduct(e.target.checked);
                                    props.showDeleteAll();
                                }}
                                checked={props.data.length === props.checkedLength}
                            />
                        </th>
                        {props.columns.map((o) => (
                            <th key={o.key}>{o.label}</th>
                        ))}
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.data &&
                    props.data.map((row, i) => {
                        return (
                            <tr key={i}>
                                <td>
                                    <Form>
                                        <Form.Check
                                            custom
                                            type={"checkbox"}
                                            id={`check-${i}`}
                                            label={""}
                                            checked={row.checked}
                                            onChange={() => {
                                                props.checkProduct(i);
                                            }}
                                        />
                                    </Form>
                                </td>
                                {props.columns.map((o, j) => (
                                    <td key={j}>{row[o.key]}</td>
                                ))}
                                <td>
                                    <Button variant="primary" onClick={() => props.editModalShow(i)}>Edit</Button>{" "}
                                    <Button
                                        variant="danger"
                                        onClick={() => setDeleteDialog({showDeleteDialog: true, idx: i})}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    {
                        (props.search.length === 0 && props.data && props.data.length > 0) &&
                        <tr>
                            <td>
                                Total
                            </td>
                            {
                                props.columns.map((o, i) => (
                                    o.total ? <td key={i}>
                                        {
                                            getSum(props.data.map(item => parseInt(item[o.key])))
                                        }
                                    </td> : <td key={i}></td>
                                ))
                            }
                            <td>
                                {''}
                            </td>
                        </tr>
                    }
                    </tbody>
                </Table>
            ) : (
                <Alert variant={"primary"}>No Product added yet.</Alert>
            )}
            <Dialog
                title={"Delete Product"}
                buttons={[
                    {
                        onClick: () => setDeleteDialog({showDeleteDialog: false, idx: -1}),
                        variant: "secondary",
                        text: "Close",
                    },
                    {
                        onClick: () => {
                            props.deleteProduct(idx);
                            setDeleteDialog({showDeleteDialog: false, idx: -1});
                        },
                        text: "Delete",
                    },
                ]}
                modalProps={{
                    show: showDeleteDialog,
                    onHide: () => setDeleteDialog({showDeleteDialog: false, idx: -1}),
                    size: "sm",
                }}
            >
                Are you sure you want to delete the product ?
            </Dialog>
        </div>
    );
}

const mapStateToProps = (state) => {
    const checkedLength = getCheckedProductsLength(state);
    return {checkedLength};
};
export default connect(mapStateToProps, {
    deleteProduct,
    checkProduct,
    checkAllProduct,
})(GridView);
