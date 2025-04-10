import {Link} from 'react-router-dom'
import {IoLocationSharp} from 'react-icons/io5'
import {IoMdStar} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobCard = props => {
  const {jobCardDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobCardDetails
  return (
    <Link to={`/jobs/${id}`} className="job-card-link">
      <li className="job-card">
        <div className="job-logo-container">
          <img src={companyLogoUrl} alt="company logo" className="job-logo" />
          <div className="title-rating-container">
            <h1 className="job-card-title">{title}</h1>
            <div className="rating-container">
              <IoMdStar className="job-card-rating-icon" />
              <p className="job-card-rating">{rating}</p>
            </div>
          </div>
        </div>

        <div className="location-package-employment-container">
          <div className="location-employment-container">
            <div className="job-card-location-container">
              <IoLocationSharp className="job-card-location-icon" />
              <p className="job-card-location">{location}</p>
            </div>
            <div className="job-card-employment-container">
              <BsBriefcaseFill className="job-card-employement-icon" />
              <p className="job-card-employment">{employmentType}</p>
            </div>
          </div>
          <p className="job-card-package">{packagePerAnnum}</p>
        </div>

        <hr className="horizontal-line" />

        <h1 className="job-card-description-heading">Description</h1>
        <p className="job-card-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
