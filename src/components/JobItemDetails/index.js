import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import {IoLocationSharp} from 'react-icons/io5'
import {IoMdStar} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import SimilarJobCard from '../SimilarJobCard'

import './index.css'

const jobItemDetailsConstants = {
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    activeJobStatus: jobItemDetailsConstants.initial,
    jobItemDetails: {},
    similarJobDetails: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  jobDetailsRetryClicked = () => {
    this.getJobItemDetails()
  }

  jobItemDetailsFailureView = () => {
    return (
      <div className="job-item-details-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="job-details-failure-image"
          alt="failure view"
        />
        <h1 className="job-details-failure-heading">
          Oops! Something Went Wrong
        </h1>
        <p className="job-details-failure-description">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          className="job-details-retry-button"
          type="button"
          onClick={this.jobDetailsRetryClicked}
        >
          Retry
        </button>
      </div>
    )
  }

  jobItemDetailsLoadingView = () => {
    return (
      <div className="loader-container loader-display" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  jobItemDetailsSuccessView = () => {
    const {jobItemDetails, similarJobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
    } = jobItemDetails
    const {title} = similarJobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-item-details-container">
        <div className="job-item-details-top-card">
          <div className="job-details-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-logo"
            />
            <div className="job-details-title-rating-container">
              <h1 className="job-details-title">{title}</h1>
              <div className="job-details-rating-container">
                <IoMdStar className="job-details-rating-icon" />
                <p className="job-details-rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-details-location-package-employment-container">
            <div className="job-details-location-employment-container">
              <div className="job-details-location-container">
                <IoLocationSharp className="job-details-location-icon" />
                <p className="job-details-location">{location}</p>
              </div>
              <div className="job-details-employment-container">
                <BsBriefcaseFill className="job-details-employment-icon" />
                <p className="job-details-employment">{employmentType}</p>
              </div>
            </div>
            <p className="job-details-package">{packagePerAnnum}</p>
          </div>

          <hr className="horizontal-line" />

          <div className="job-details-description-container">
            <h1 className="job-details-description-heading">Description</h1>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit
            </a>
          </div>
          <p className="job-details-job-description">{jobDescription}</p>
          <h1 className="job-details-skills">Skills</h1>

          <ul className="skills-list">
            {skills.map(eachSkillItem => {
              const {imageUrl, name} = eachSkillItem
              return (
                <li className="skill-item" key={name}>
                  <img
                    src={imageUrl}
                    className="skill-image"
                    alt={eachSkillItem.name}
                  />
                  <p className="skill-name">{name}</p>
                </li>
              )
            })}
          </ul>

          <div className="life-at-company-container">
            <div className="life-at-company-text-container">
              <h1 className="life-at-company-heading">Life at Company</h1>
              <p className="life-at-company-description">{description}</p>
            </div>
            <img
              src={imageUrl}
              className="life-at-company-image"
              alt="life at company"
            />
          </div>
        </div>

        <h1 className="similar-jobs-heading">Similar Jobs</h1>

        <div className="similar-jobs-list">
          {similarJobDetails.map(eachSimilarJob => (
            <SimilarJobCard
              eachSimilarJobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </div>
      </div>
    )
  }

  getJobItemDetails = async () => {
    this.setState({activeJobStatus: jobItemDetailsConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jobItemUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobItemUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {job_details, similar_jobs} = data
      const updatedJobItemDetails = {
        companyLogoUrl: job_details.company_logo_url,
        companyWebsiteUrl: job_details.company_website_url,
        employmentType: job_details.employment_type,
        id: job_details.id,
        jobDescription: job_details.job_description,
        skills: job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: job_details.life_at_company.description,
          imageUrl: job_details.life_at_company.image_url,
        },
        location: job_details.location,
        packagePerAnnum: job_details.package_per_annum,
        rating: job_details.rating,
      }
      const updatedSimilarJobs = similar_jobs.map(eachSimilarJob => ({
        companyLogoUrl: eachSimilarJob.company_logo_url,
        employmentType: eachSimilarJob.employment_type,
        id: eachSimilarJob.id,
        jobDescription: eachSimilarJob.job_description,
        location: eachSimilarJob.location,
        title: eachSimilarJob.title,
        rating: eachSimilarJob.rating,
      }))
      this.setState({
        jobItemDetails: updatedJobItemDetails,
        similarJobDetails: updatedSimilarJobs,
        activeJobStatus: jobItemDetailsConstants.success,
      })
    } else {
      this.setState({activeJobStatus: jobItemDetailsConstants.failure})
    }
  }

  renderJobItemDetailsView = () => {
    const {activeJobStatus} = this.state
    switch (activeJobStatus) {
      case jobItemDetailsConstants.success:
        return this.jobItemDetailsSuccessView()
      case jobItemDetailsConstants.failure:
        return this.jobItemDetailsFailureView()
      case jobItemDetailsConstants.inProgress:
        return this.jobItemDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobItemDetailsView()}
      </>
    )
  }
}

export default JobItemDetails
