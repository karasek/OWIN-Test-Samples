/** @jsx React.DOM */

// Simple pure-React component so we don't have to remember
// Bootstrap's classes
var BootstrapButton = React.createClass({
  render: function() {
    // transferPropsTo() is smart enough to merge classes provided
    // to this component.
    return this.transferPropsTo(
      <a href="javascript:;" role="button" className="btn">
        {this.props.children}
      </a>
    );
  }
});

var BootstrapModal = React.createClass({
  // The following two methods are the only places we need to
  // integrate with Bootstrap or jQuery!
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(this.getDOMNode())
      .modal({backdrop: 'static', keyboard: false, show: false})
  },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off('hidden', this.handleHidden);
  },
  close: function() {
    $(this.getDOMNode()).modal('hide');
  },
  open: function() {
    $(this.getDOMNode()).modal('show');
  },
  render: function() {
    var confirmButton = null;

    if (this.props.confirm) {
      confirmButton = (
        <BootstrapButton
          onClick={this.handleConfirm}
          className="btn-primary">
          {this.props.confirm}
        </BootstrapButton>
      );
    }
    
    return (
      <div className="modal hide fade">
        <div className="modal-header">
          <button
            type="button"
            className="close"
            onClick={this.handleCancel}
            dangerouslySetInnerHTML={{__html: '&times'}}
          />
          <h3>{this.props.title}</h3>
        </div>
        <div className="modal-body">
          {this.props.children}
        </div>
        <div className="modal-footer">
          {confirmButton}
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }
});

var Job = React.createClass({
  render: function(){
    
    return (
      <tr>
        <td>{this.props.data.Title}</td>
        <td>
          <button className="btn btn-info" onClick={this.openModal}>Info</button>
          <a className="btn btn-success" href="/crash">Apply</a>
          <button className="btn btn-danger" onClick={this.deleteJob}>Delete</button>
        </td>
      </tr>
    );
  },
  openModal: function() {
    this.props.onOpenModal(this.props.data);
  },
  closeModal: function() {
    this.refs.modal.close();
  },
  deleteJob: function() {
   this.props.onDeleteJob(this.props.data.Id);
  }
});

var NewJobForm = React.createClass({
  submit: function() {
    var title = this.refs.title.getDOMNode().value.trim();
    var description = this.refs.description.getDOMNode().value.trim();
    if (!title) {
      return false;
    }
    
    var newJob = {Title: title, Description: description};
    $.post('/jobs/add', newJob, function(data){this.props.onAdded(data);}).bind(this);
    this.refs.title.getDOMNode().value = '';
    this.refs.description.getDOMNode().value = '';
    
    return false;
  },
  render: function() {
    return (
      <div>
        <h3>Add new position</h3>
        <form className="newJobForm" onSubmit={this.submit}>
            Title: <input type="text" ref="title" />
            Description: <input type="text" ref="description" /><br/>
            <input type="submit" className="btn" value="Add" />
        </form>
      </div>
    );
  }
});

var JobDetail = React.createClass({
  render: function(){
    return (
        <BootstrapModal
        confirm="OK"
        ref="modal"
        onConfirm={this.closeModalInfo}
        title={this.props.job.Title}>
          <p className="descr">{this.props.job.Description}</p>
          <h5>{this.props.job.Requirements}</h5>
          <ul>
            {(this.props.job.Required) 
              ? this.props.job.Required.map( function(item, i) {
                      return (<li key={i}>{item}</li>);}) 
              : ''
             }
          </ul>
          <p>Language: {this.props.job.Language}</p>
      </BootstrapModal>
      );
  },
  open: function() {
    this.refs.modal.open();
  },
  closeModalInfo: function() {
    this.refs.modal.close();
  }
});

var JobList = React.createClass({
  getInitialState: function() {
    return { 
            jobs: [],
            jobDetail: { Title: '',
                         Description: '',
                         Requirements: '',
                         Required: [],
                         Language: '' }
           };
  },

  componentDidMount: function() {
    $.get("jobs", function(result) {
        this.setState({ jobs: result });
    }.bind(this));
  },
 
  render: function(){
    var modal = null;
    modal = (
      <JobDetail ref="detail" onConfirm={this.closeModalInfo} job={this.state.jobDetail}/>
    );

    var items = [];
    for (var i = 0; i < this.state.jobs.length; i++) {
      items.push(<Job key={i} data={this.state.jobs[i]} 
                      onDeleteJob={this.deleteJob}
                      onOpenModal={this.openModalInfo}/>);
    }
    return ( 
      <div>
        {modal}
        
        <h3>GMC Software open positions</h3>
        <table className="table table-hover">
          <tr>
            <th>Title</th>
            <th>Action</th>
          </tr>
          {items}
        </table>

        <NewJobForm onAdded={this.onAdded}/>
      </div>
      );
  },

  deleteJob: function(id) {
    var jobList = this;
    $.ajax({
      url:  "jobs/" + id,
      type: 'DELETE',
      success: function() { 
        $.get("jobs", function(result) {
          jobList.setState({ jobs: result });
        }); 
      }
    });
  },

  openModalInfo: function(job) {
    this.setState( { jobDetail: job });
    this.refs.detail.open();
  },

  onAdded: function(job) {
    var state = this.state;
    state.jobs.push(job);
    this.setState(state);
  }
});

React.renderComponent(<JobList />, document.getElementById('openPositions'));