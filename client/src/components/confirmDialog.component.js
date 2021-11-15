import React from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css



export default class ConfirmDialog extends React.Component {

  submit = () => {    
    confirmAlert({

      title: this.props.title,
      message: this.props.message,
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.props.onClickYes()
        },
        {
          label: 'No',
          onClick: () => this.setState({ open: false })
        }
      ]

    });
  };

  render() {
    return (
      <button type="submit" className={this.props.className} onClick={this.submit}>{this.props.title}</button>      
    );
  }
}