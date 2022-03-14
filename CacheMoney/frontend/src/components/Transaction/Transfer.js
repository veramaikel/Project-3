/**
 * @author Cody Gonsowski & Jeffrey Lor
 */
import axios from "axios";
import { useState } from "react";
import config from "../../config";
import store from "../../store/Store";
import TransferSelection from "./TransferSelection";

//TODO finish this
function Transfer(props) {
    // local formData state
    const [formData, setFormData] = useState({
        sourceAccountId: store.getState().transferReducer.sourceAccountId,
        destinationAccountId: store.getState().transferReducer.destinationAccountId,
        transaction: {
            description: "",
            transactionAmount: ""
        }
    });
    const [sourceAccount, setSourceAccount] = useState(null);
    const [destinationAccount, setDestinationAccount] = useState(null);
    const [description, setDescription] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(0);

    // retrieve the url from the config
    const url = config.url;

    // callback function for source account
    function updateSourceAccount(account) {
        setSourceAccount(account);
        console.log("source", sourceAccount);
        console.log("inc", account);
    }

    // callback function for destination account
    function updateDestinationAccount(account) {
        setDestinationAccount(account);
        console.log("source", destinationAccount);
        console.log("inc", account);
    }

    // post transfer transaction
    const postTransfer = () => {
        axios.post(`${url}accounts/transfer`,
            {
                sourceAccountId: store.getState().transferReducer.sourceAccountId,
                destinationAccountId: store.getState().transferReducer.destinationAccountId,
                transaction: {
                    description: description,
                    transactionAmount: transactionAmount
                }
            },
            {
                headers: {
                    token: store.getState().userReducer.token,
                    userId: store.getState().userReducer.userId
                }
            })
            .catch(error => console.error(`Error: ${error}`));
    }

    // updates form data when form changes
    const handleChange = (event) => {
        event.preventDefault();
        if (event.target.name === "transactionAmount") {
            setFormData({ ...formData, transaction: { transactionAmount: event.target.value } });
        }
        else if (event.target.name === "description") {
            setFormData({ ...formData, transaction: { description: event.target.value } });
        }
        else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    }

    // what the submit button should do
    const handleSubmit = (event) => {
        event.preventDefault();

        setDescription(event.target.description.value);
        setTransactionAmount(event.target.transactionAmount.value);

        console.log("desc: ", description);
        console.log("amt: ", transactionAmount);

        console.log(formData);
        postTransfer(formData);
    }

    return (
        <div className="transfer-outer-container">
            <div className="transfer-inner-container">
                <div className="transfer-form">
                    <p className="transfer-form-header">Transfer</p>

                    <form onSubmit={handleSubmit}>
                        <div className="transfer-from-account">
                            <label>FROM</label>
                            <TransferSelection updateAccounts={updateSourceAccount} whichAccount="SOURCE"></TransferSelection>
                        </div>

                        <div className="transfer-to-account">
                            <label>TO</label>
                            <TransferSelection updateAccounts={updateDestinationAccount} whichAccount="DESTINATION"></TransferSelection>
                        </div>

                        <div className="transfer-amount">
                            <label>Amount</label>
                            <input type="number" min="0.00" step="0.01" id="transfer-input" name="transactionAmount" onChange={handleChange} />
                        </div>

                        <div className="transfer-description">
                            <label>Description</label>
                            <input type="text" id="transfer-description" name="description" onChange={handleChange} />
                        </div>

                        <button type="submit">Submit</button>
                    </form>

                    {/* <button className="transfer-submit-button" type="button" name="submit" onClick={handleSubmit}>Submit</button> */}
                </div>
            </div>
        </div>
    );
}

export default Transfer;