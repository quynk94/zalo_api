import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const TOKEN = "Vh5IIDi-mHzyiL98t3_47tkxLatOARTR2Drq2_4hbbvUkc5fZbMAHLk_V6gCJF5DBfWBQO4KapDdu6bWXXk5R7NCJ4sF6A9lLP5JRuvfgcP-XMqpaapr4Yc-8ZZOJiHj6RS2NCa-cWSNqGaBr5_B016y2XB4T9j96xjSRU9WgLb4aL1SwqMsL2s1P7xaJQ9-AuH0MkTYXN41cc9D_M28SGElOaQWFg4MVjXpC94sjnv6_YuJumFdHIVATXx01E0vO-qD4xe9d48Tsmzk_GIUMfQye6FR8yOQ"
const SEND_MESSAGE_URL = `https://openapi.zalo.me/v2.0/oa/message?access_token=${TOKEN}`
const GET_UID_URL = `https://openapi.zalo.me/v2.0/oa/getprofile?access_token=${TOKEN}`

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: '',
      sdt: '',
      isSending: false
    }

  }
  render() {
    return (
      <div className="App">
        <div className="app-container">
          <div className="field">
            <label>Message:</label>
            <input onChange={this._onMessageChange}></input>
          </div>
          <div className="field">
            <label>SDT:</label>
            <input onChange={this._onSDTChange}></input>
          </div>
          <button onClick={this._onSendClick}>Send Message</button>
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
    this._parseAllPhoneNumber()

  }

  _parseAllPhoneNumber() {
    let sdts = this.state['sdt'].split(';')
    sdts.forEach((sdt) => {
      this._sendToAPhone(sdt);
    })
  }

  _sendToAPhone(phone) {
    let url = `${GET_UID_URL}&data={"user_id":"${phone}"}`
    fetch(url).then((response) => {
      return response.json()
    })
    .then((response) => {
      if (response['message'] == 'Success') {
        this._sendToAUserID(response['data']['user_id']);
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
    });
  }
}

export default App;
