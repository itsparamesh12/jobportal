import React, { Component } from 'react';
import MenuBar from './MenuBar';
import './Dashboard.css';
import { BASEURL, callApi, getSession, setSession } from './api';
import JobPostings from './JobPosting';
import JobSearch from './JobSearch';
import Profile from './Profile';

class Dashboard extends Component {
  constructor(props) 
  {
    super(props);
    this.state = {fullname:'',activeComponent:''};
    this.showFullname = this.showFullname.bind(this);
    this.logout = this.logout.bind(this);
    this.loadComponent = this.loadComponent.bind(this);
  }

  componentDidMount() 
  {
      let csr = getSession("csrid");
      if (csr === "") 
        this.logout();
      let data = JSON.stringify({csrid: csr});
      callApi("POST", BASEURL + "users/getfullname", data, this.showFullname);
  }

  showFullname(response) 
  {
    // assuming response is a plain string (fullname)
    this.setState({fullname: response});
  }

  logout() {
  // clear session storage (your existing line)
  setSession("csrid", "", -1);

  // clear csr cookie (important!)
  document.cookie = "csrid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // redirect to welcome/login page
  window.location.replace("/");
}
  loadComponent(mid)
  {
    let components = {
      "1":<JobPostings/>,
      "2":<JobSearch/>,
      "3":<Profile/>

    };
    this.setState({activeComponent:components[mid]});
  }


  render() {
      const {fullname,activeComponent} = this.state;
      return (
          <div className = 'dashboard'>
              <div className='header'>
                <img className='logo' src='/logo.png' alt='logo'/>
                <div className='logoText'>Job<span> Portal</span></div>
                <img className='logout' onClick={() => this.logout()} src='/logout.jpg' alt='logout'/>

                <label>{fullname}</label>
              </div>
              <div className='menu'>
                <MenuBar onMenuClick={this.loadComponent}/>
              </div>
              <div className='outlet'>{activeComponent}</div>
          </div>
      );
  }
}

export default Dashboard;
