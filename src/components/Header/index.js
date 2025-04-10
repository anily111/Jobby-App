import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import {IoBag} from 'react-icons/io5'
import {IoIosLogOut} from 'react-icons/io'
import './index.css'

const Header = props => {
  const logoutClicked = () => {
    const jwtToken = Cookies.get('jwt_token')
    Cookies.remove(jwtToken)
    const {history} = props
    history.replace('/login')
  }



  return (
    <>
      <div className="header-small">
        <Link to="/" className="logo-button">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo-small"
            alt="website logo"
          />
        </Link>
        <ul className="small-contents-container">
          <Link to="/">
            <li>
              <IoMdHome className="home-icon" />
            </li>
          </Link>
          <Link to="/jobs">
            <li>
              <IoBag className="job-icon" />
            </li>
          </Link>
          <li>
            <button className="logout-icon-button" onClick={logoutClicked}>
              <IoIosLogOut className="logout-icon" />
            </button>
          </li>
        </ul>
      </div>

      <div className="header-large">
       <Link to="/" className="logo-button">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo-large"
          alt="website logo"
        />
      </Link>
        <ul className="large-contents">
          <Link to="/" className="header-link">
            <li className="large-home-logo">Home</li>
          </Link>
          <Link to="/jobs" className="header-link">
            <li className="large-jobs-logo">Jobs</li>
          </Link>
          <li>
            <button className="home-logout-button" onClick={logoutClicked}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default withRouter(Header)
