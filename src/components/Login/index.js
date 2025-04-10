import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    isShowErrorMsg: false,
    errorMsg: '',
    userName: '',
    passWord: '',
  }

  submitForm = async event => {
    event.preventDefault()
    const {userName, passWord} = this.state
    event.preventDefault()
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username: userName, password: passWord}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const {history} = this.props
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    }
    if (response.status_code === 404) {
      this.setState({isShowErrorMsg: true, errorMsg: response.error_msg})
    }
  }

  onChangeUsername = event => {
    this.setState({userName: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passWord: event.target.value})
  }

  renderPasswordField = () => {
    const {passWord} = this.state
    return (
      <>
        <label htmlFor="loginPassword" className="login-password-label">
          PASSWORD
        </label>
        <input
          type="password"
          value={passWord}
          id="loginPassword"
          className="login-password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {userName} = this.state
    return (
      <>
        <label htmlFor="loginInput" className="login-input-label">
          USERNAME
        </label>
        <input
          type="text"
          id="loginInput"
          className="login-input"
          value={userName}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {isShowErrorMsg, errorMsg} = this.state
    const jwttoken = Cookies.get('jwt_token')
    if (jwttoken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo-login"
            alt="website logo"
          />
          <form className="form-container" onSubmit={this.submitForm}>
            <div className="login-input-container">
              {this.renderUsernameField()}
            </div>
            <div className="password-container">
              {this.renderPasswordField()}
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {isShowErrorMsg && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
