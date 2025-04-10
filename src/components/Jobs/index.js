import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import Cookies from 'js-cookie'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const locationsList = [
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const activeProfileConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const activeJobConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileActiveStatus: activeProfileConstants.initial,
    jobsActiveStatus: activeJobConstants.initial,
    searchInput: '',
    typeOfEmployment: [],
    salaryRange: '',
    profileDetails: {},
    allJobs: [],
    locationsList: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getAllJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileActiveStatus: activeProfileConstants.inProgress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {profile_details} = data
      const updatedProfileDetails = {
        name: profile_details.name,
        profileImageUrl: profile_details.profile_image_url,
        shortBio: profile_details.short_bio,
      }
      this.setState({
        profileActiveStatus: activeProfileConstants.success,
        profileDetails: updatedProfileDetails,
      })
    } else {
      this.setState({profileActiveStatus: activeProfileConstants.failure})
    }
  }

  getAllJobs = async () => {
    const {typeOfEmployment, salaryRange, locationsList} = this.state
    const employmentString = typeOfEmployment.join(',')
    const {searchInput} = this.state
    this.setState({jobsActiveStatus: activeJobConstants.inProgress})
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentString}&minimum_package=${salaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {jobs} = data
      const updatedJobsData = jobs.map(eachJobDetail => ({
        companyLogoUrl: eachJobDetail.company_logo_url,
        employmentType: eachJobDetail.employment_type,
        id: eachJobDetail.id,
        jobDescription: eachJobDetail.job_description,
        location: eachJobDetail.location,
        packagePerAnnum: eachJobDetail.package_per_annum,
        rating: eachJobDetail.rating,
        title: eachJobDetail.title,
      }))
      console.log(updatedJobsData)
      if (locationsList.length !== 0) {
        const updatedJobsOnLocation = updatedJobsData.filter(eachJob =>
          locationsList.includes(eachJob.location.toUpperCase()),
        )
        this.setState({
          jobsActiveStatus: activeJobConstants.success,
          allJobs: updatedJobsOnLocation,
        })
      } else {
        this.setState({
          jobsActiveStatus: activeJobConstants.success,
          allJobs: updatedJobsData,
        })
      }
    } else {
      this.setState({jobsActiveStatus: activeJobConstants.failure})
    }
  }

  profileLoadingView = () => (
    <div className="loader-container loader-display" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="user-profile-card">
        <img
          src={profileImageUrl}
          alt="profile"
          className="user-profile-image"
        />
        <h1 className="user-profile-name">{name}</h1>
        <p className="user-profile-bio">{shortBio}</p>
      </div>
    )
  }

  retryButtonClicked = () => {
    this.getProfileDetails()
  }

  profileFailureView = () => {
    return (
      <div className="user-profile-failure">
        <button
          type="button"
          className="user-profile-retry-button"
          onClick={this.retryButtonClicked}
        >
          Retry
        </button>
      </div>
    )
  }

  renderProfileView = () => {
    const {profileActiveStatus} = this.state
    switch (profileActiveStatus) {
      case activeProfileConstants.success:
        return this.profileSuccessView()
      case activeProfileConstants.inProgress:
        return this.profileLoadingView()
      case activeProfileConstants.failure:
        return this.profileFailureView()
      default:
        return null
    }
  }

  getJobsFilteredBySearch = () => {
    const {allJobs, searchInput} = this.state
    const filteredJobsData = allJobs.filter(eachJob =>
      eachJob.title.toLowerCase().includes(searchInput.toLowerCase()),
    )
    return filteredJobsData
  }

  renderNoJobsView = () => {
    return (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-message">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  jobsRetryButtonClicked = () => {
    this.getAllJobs()
  }

  jobsFailureView = () => {
    return (
      <div className="jobs-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="jobs-failure-image"
        />
        <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
        <p className="jobs-failure-description">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          className="user-profile-retry-button"
          onClick={this.jobsRetryButtonClicked}
        >
          Retry
        </button>
      </div>
    )
  }

  jobsSuccessView = () => {
    const filteredJobsData = this.getJobsFilteredBySearch()
    if (filteredJobsData.length === undefined) {
      return this.renderNoJobsView()
    }
    return (
      <ul className="all-jobs-list">
        {filteredJobsData.map(eachJob => (
          <JobCard jobCardDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  renderJobsView = () => {
    const {jobsActiveStatus} = this.state
    switch (jobsActiveStatus) {
      case activeJobConstants.success:
        return this.jobsSuccessView()
      case activeJobConstants.inProgress:
        return this.profileLoadingView()
      case activeJobConstants.failure:
        return this.jobsFailureView()
    }
  }

  employmentTypeSelected = event => {
    const {typeOfEmployment} = this.state
    if (typeOfEmployment.includes(event.target.id)) {
      const updatedEmploymentList = typeOfEmployment.filter(
        eachEmployment => eachEmployment !== event.target.id,
      )
      this.setState({typeOfEmployment: updatedEmploymentList}, this.getAllJobs)
    } else {
      const updatedEmploymentList = [...typeOfEmployment, event.target.id]
      this.setState({typeOfEmployment: updatedEmploymentList}, this.getAllJobs)
    }
  }

  renderEmploymentTypesView = () => {
    return (
      <>
        <h1 className="employment-heading">Type of Employment</h1>
        <ul className="employment-types-list">
          {employmentTypesList.map(eachEmployment => {
            return (
              <li
                className="employment-item"
                key={eachEmployment.employmentTypeId}
              >
                <input
                  type="checkbox"
                  className="employment-checkbox"
                  id={eachEmployment.employmentTypeId}
                  onChange={this.employmentTypeSelected}
                />
                <label
                  className="employment-label"
                  htmlFor={eachEmployment.employmentTypeId}
                >
                  {eachEmployment.label}
                </label>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  salaryRangeSelected = event => {
    this.setState({salaryRange: event.target.id}, this.getAllJobs)
  }

  renderSalaryRangesView = () => {
    return (
      <>
        <h1 className="employment-heading">Salary Range</h1>
        <ul className="employment-types-list">
          {salaryRangesList.map(eachSalaryRange => (
            <li className="employment-item" key={eachSalaryRange.salaryRangeId}>
              <input
                type="radio"
                className="employement-checkbox"
                name="salary"
                id={eachSalaryRange.salaryRangeId}
                onChange={this.salaryRangeSelected}
              />
              <label
                htmlFor={eachSalaryRange.salaryRangeId}
                className="employment-label"
              >
                {eachSalaryRange.label}
              </label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchButton = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  locationSelected = event => {
    const {locationsList} = this.state
    if (locationsList.includes(event.target.id)) {
      const updatedLocationsList = locationsList.filter(
        eachLocation => eachLocation !== event.target.id,
      )
      this.setState({locationsList: updatedLocationsList}, this.getAllJobs)
    } else {
      const updatedLocationsList = [
        ...locationsList,
        event.target.id.toUpperCase(),
      ]
      this.setState({locationsList: updatedLocationsList}, this.getAllJobs)
    }
  }

  renderLocationFiltersView = () => {
    return (
      <>
        <h1 className="employment-heading">Locations</h1>
        <ul className="employment-types-list">
          {locationsList.map(eachLocation => {
            return (
              <li className="employment-item" key={eachLocation.locationId}>
                <input
                  type="checkbox"
                  className="employment-checkbox"
                  id={eachLocation.locationId}
                  onChange={this.locationSelected}
                />
                <label
                  className="employment-label"
                  htmlFor={eachLocation.locationId}
                >
                  {eachLocation.label}
                </label>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-page-container">
          <div className="profile-filters-container">
            {this.renderProfileView()}
            <hr className="horizontal-line" />
            {this.renderEmploymentTypesView()}
            <hr className="horizontal-line" />
            {this.renderSalaryRangesView()}
            <hr className="horizontal-line" />
            {this.renderLocationFiltersView()}
          </div>

          <div className="jobs-container">
            <div className="input-container">
              <input
                type="search"
                placeholder="Search"
                className="input-search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchButton}
              />
              <button
                className="search-button"
                type="button"
                data-testid="searchButton"
                onClick={this.getAllJobs}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
