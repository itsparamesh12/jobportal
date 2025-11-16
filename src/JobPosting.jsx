import React, { Component } from 'react';
import './JobPosting.css';
import { BASEURL, callApi } from './api';

class JobPosting extends Component {
  constructor() {
    super();
    this.state = {
      id: '', title: '', company: '', location: '', salary: '', description: '',
      jobList: [], showJobPopup: false, showDeleteDialog: false, jobToDelete: null
    };
  }

  componentDidMount() {
    this.loadJobs();
  }

  loadJobs = () => {
    callApi("GET", BASEURL + "jobs/read", "", this.readResponse);
  }

  readResponse = (response) => {
    if (response.includes("404::")) {
      alert(response.split("::")[1]);
      return;
    }
    let jobList = JSON.parse(response);
    this.setState({ jobList });
  }

  loadInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  saveJob = () => {
    const { id, title, company, location, salary, description } = this.state;
    
    if (!title || !company || !location || !salary) {
      alert("Please fill all required fields");
      return;
    }

    const jobData = {
      id: id || null,
      title: title,
      company: company,
      location: location,
      salary: salary,
      description: description
    };

    const data = JSON.stringify(jobData);
    
    if (id) {
      callApi("PUT", BASEURL + "jobs/update", data, this.saveResponse);
    } else {
      callApi("POST", BASEURL + "jobs/create", data, this.saveResponse);
    }
  }

  saveResponse = (response) => {
    const data = response.split("::");
    if (data[0] === "200") {
      alert("Success: " + data[1]);
      this.closeJobPopup();
      this.loadJobs();
    } else {
      alert("Error: " + data[1]);
    }
  }

  updateData = (id) => {
    callApi("GET", BASEURL + "jobs/getdata/" + id, "", this.loadJobForEdit);
  }

  loadJobForEdit = (response) => {
    if (response.includes("404::")) {
      alert("Error loading job: " + response.split("::")[1]);
      return;
    }
    
    let jobData = JSON.parse(response);
    this.setState({
      id: jobData.id || '',
      title: jobData.title || '',
      company: jobData.company || '',
      location: jobData.location || '',
      salary: jobData.salary || '',
      description: jobData.description || ''
    });
    
    this.showJobPopup();
  }

  showDeleteDialog = (id) => {
    const job = this.state.jobList.find(job => job.id === id);
    this.setState({ showDeleteDialog: true, jobToDelete: job });
  }

  closeDeleteDialog = () => {
    this.setState({ showDeleteDialog: false, jobToDelete: null });
  }

  confirmDelete = () => {
    if (this.state.jobToDelete) {
      callApi("DELETE", BASEURL + "jobs/delete/" + this.state.jobToDelete.id, "", this.deleteResponse);
    }
  }

  deleteResponse = (response) => {
    const data = response.split("::");
    alert(data[1]);
    if (data[0] === "200") {
      this.closeDeleteDialog();
      this.loadJobs();
    }
  }

  showJobPopup = () => {
    this.setState({ showJobPopup: true });
  }

  closeJobPopup = () => {
    this.setState({ 
      showJobPopup: false,
      id: '', title: '', company: '', location: '', salary: '', description: ''
    });
  }

  render() {
    const { jobList, showJobPopup, showDeleteDialog, jobToDelete } = this.state;

    return (
      <div className='jpcontainer'>
        {/* Job Form Popup */}
        {showJobPopup && (
          <div className='popup'>
            <div className='popupwindow'>
              <div className='popupheader'>
                <label>{this.state.id ? 'Update Job' : 'Post a Job'}</label>
                <span onClick={this.closeJobPopup}>&times;</span>
              </div>

              <div className='popupcontent'>
                <label>Job Title*</label>
                <input 
                  type='text' 
                  name='title' 
                  value={this.state.title} 
                  onChange={this.loadInputChange} 
                  placeholder="e.g., Frontend Developer" 
                />

                <label>Company Name*</label>
                <input 
                  type='text' 
                  name='company' 
                  value={this.state.company} 
                  onChange={this.loadInputChange} 
                  placeholder="e.g., Wipro" 
                />

                <label>Location*</label>
                <input 
                  type='text' 
                  name='location' 
                  value={this.state.location} 
                  onChange={this.loadInputChange} 
                  placeholder="e.g., Chennai" 
                />

                <label>Salary*</label>
                <input 
                  type='text' 
                  name='salary' 
                  value={this.state.salary} 
                  onChange={this.loadInputChange} 
                  placeholder="e.g., 10 LPA" 
                />

                <label>Job Description</label>
                <textarea 
                  rows='4' 
                  name='description' 
                  value={this.state.description} 
                  onChange={this.loadInputChange} 
                  placeholder="Enter job requirements and description" 
                />

                <button onClick={this.saveJob}>
                  {this.state.id ? 'Update Job' : 'Save Job'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && jobToDelete && (
          <div className='popup'>
            <div className='popupwindow delete-dialog'>
              <div className='popupheader'>
                <label>Confirm Delete</label>
                <span onClick={this.closeDeleteDialog}>&times;</span>
              </div>
              <div className='popupcontent'>
                <h3>Delete this job?</h3>
                <p><strong>{jobToDelete.title}</strong> at {jobToDelete.company}</p>
                <div className='dialog-buttons'>
                  <button className='delete-btn' onClick={this.confirmDelete}>Delete</button>
                  <button className='cancel-btn' onClick={this.closeDeleteDialog}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className='header'>
          <label>All Jobs ({jobList.length})</label>
        </div>

        {/* Job List */}
        <div className='content compact-jobs'>
          {jobList.length === 0 ? (
            <div className='no-jobs'>No jobs found. Click "Add New" to create a job posting.</div>
          ) : (
            jobList.map((data) => (
              <div key={data.id} className='result compact-result'>
                <div className='job-header-compact'>
                  <div className='job-main-info'>
                    <div className='job-title-compact'>{data.title}</div>
                    <div className='company-location-compact'>
                      {data.company} • {data.location}
                    </div>
                  </div>
                  <div className='job-side-info'>
                    <span className='salary-compact'>{data.salary}</span>
                    <div className='job-actions-compact'>
                      <img src='/edit.png' alt='Edit' onClick={() => this.updateData(data.id)} />
                      <img src='/delete.png' alt='Delete' onClick={() => this.showDeleteDialog(data.id)} />
                    </div>
                  </div>
                </div>
                {data.description && (
                  <div className='job-description-compact'>
                    {data.description.length > 100 
                      ? `${data.description.substring(0, 100)}...` 
                      : data.description
                    }
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className='footer'>
          <button onClick={this.showJobPopup}>Add New</button>
        </div>
      </div>
    );
  }
}

export default JobPosting;