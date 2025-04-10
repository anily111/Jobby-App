import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="content-container-home">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Miilions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and politics
          </p>
          <Link to="/jobs">
            <button type="button" className="home-jobs-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
