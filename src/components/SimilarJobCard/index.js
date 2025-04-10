import {IoLocationSharp} from 'react-icons/io5'
import {IoMdStar} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {eachSimilarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = eachSimilarJobDetails

  return (
    <li className="similar-job-list-item" key={id}>
      <div className="similar-job-logo-container">
        <img
          src={companyLogoUrl}
          className="similar-job-company-logo"
          alt="similar job company logo"
        />
        <div className="similar-job-title-rating-container">
          <h1 className="similar-job-details-title">{title}</h1>
          <div className="similar-job-details-rating-container">
            <IoMdStar className="similar-job-details-rating-icon" />
            <p className="similar-job-details-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-job-description-heading">Description</h1>
      <p className="similar-job-job-description">{jobDescription}</p>
      <div className="similar-job-location-employment-container">
        <div className="similar-job-location-employment-container">
          <IoLocationSharp className="similar-job-location-employment-icon" />
          <p className="similar-job-location-employment-text">{location}</p>
        </div>
        <div className="similar-job-location-employment-container">
          <BsBriefcaseFill className="similar-job-location-employment-icon" />
          <p className="similar-job-location-employment-text">
            {employmentType}
          </p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
