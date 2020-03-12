import React, { Component } from 'react';
import './App.css';
import { withAlert } from 'react-alert'

const TOKEN = "Vh5IIDi-mHzyiL98t3_47tkxLatOARTR2Drq2_4hbbvUkc5fZbMAHLk_V6gCJF5DBfWBQO4KapDdu6bWXXk5R7NCJ4sF6A9lLP5JRuvfgcP-XMqpaapr4Yc-8ZZOJiHj6RS2NCa-cWSNqGaBr5_B016y2XB4T9j96xjSRU9WgLb4aL1SwqMsL2s1P7xaJQ9-AuH0MkTYXN41cc9D_M28SGElOaQWFg4MVjXpC94sjnv6_YuJumFdHIVATXx01E0vO-qD4xe9d48Tsmzk_GIUMfQye6FR8yOQ"
const SEND_MESSAGE_URL = `https://openapi.zalo.me/v2.0/oa/message?access_token=${TOKEN}`
const GET_UID_URL = `https://openapi.zalo.me/v2.0/oa/getprofile?access_token=${TOKEN}`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      sdt: '',
      isSending: false
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <div className="app-container">
          <div className="title">
            Send message to Zalo user
          </div>
          <div className="field">
            <label>Message:</label>
            <textarea onChange={this._onMessageChange}></textarea>
          </div>
          <div className="field">
            <label>SDT:</label>
            <textarea onChange={this._onSDTChange} placeholder="EX: 0123456789;012345689"></textarea>
          </div>
          <div className="button-container">
            <button onClick={this._onSendClick}>Send Message</button>
          </div>
        </div>
      </div>
    )
  }

  _onMessageChange = (e) => {
    this.setState({ message: e.currentTarget.value })
  }

  _onSDTChange = (e) => {
    this.setState({ sdt: e.currentTarget.value })
  }

  _onSendClick = () => {
    this.setState({ isSending: true })
    const sdts = this._parseAllPhoneNumber()
    sdts.forEach((sdt) => {
      if (this._isValidPhone(sdt)) {
        this._sendToAPhone(sdt);
      } else {
        this.props.alert.error(`SDT: ${sdt} không hợp lệ`)
      }
    })
  }

  _isValidPhone(sdt) {
    if (/^\d{10,11}$/.test(sdt)) {
      return true;
    } else {
      return false;
    }

  }

  _parseAllPhoneNumber() {
    let sdts = this.state['sdt'].split(';').map((sdt) => {
      if (!sdt.startsWith('0')) {
        sdt = '0' + sdt;
      }
      sdt = sdt.replace(/\s+/, '')
      return sdt;
    })
    return sdts;
  }

  _sendToAPhone(phone) {
    let url = `${GET_UID_URL}&data={"user_id":"${phone}"}`
    fetch(url).then((response) => {
      return response.json()
    })
      .then((response) => {
        if (response['message'] == 'Success') {
          this._sendToAUserID(response['data']['user_id']).then((response) => {
            if (response.message == "Success") {
              this.props.alert.show(`Message sended to: ${phone}`)
            }
          });
        }
      })

  }

  _sendToAUserID = async (uid) => {
    const data = {
      "recipient": {
        "user_id": uid
      },
      "message": {
        "text": this.state['message']
      }
    }
    let response = await fetch(SEND_MESSAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    }).then((response) => (response.json()))

    return response;
  }
}

export default withAlert()(App);
