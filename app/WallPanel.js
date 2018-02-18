import React from 'react';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import { LinearProgress, CircularProgress } from 'material-ui/Progress';

import AddIcon from 'material-ui-icons/Add';

const create = (type, ...data) => {
  return {
    type,
    data,
    fold: definitions => {
      return definitions[type](data.length>0 ? data[0] : undefined);
    },
  };
};

const remoteData = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  FAILURE: 'FAILURE',
  SUCCESS: 'SUCCESS',
  init: () => create(remoteData.NOT_LOADED),
  loading: () => create(remoteData.LOADING),
  failure: error => create(remoteData.FAILURE, error),
  success: data => create(remoteData.SUCCESS, data),
};

const fakeFetch = () => {
  return new Promise(res => {
    setTimeout(() => res({ data: [{ id: 1, name: 'foo' }] }), 2000);
  });
};

const styles = theme => ({
  button_add: {
    //position: 'absolute',
    //top: theme.spacing.unit * 2,
    //right: theme.spacing.unit * 4,
  },
});

class WallPanel extends React.Component {
  state = { 
    data: remoteData.init()
  };
  
  componentDidMount() {
    this.fetch();
  }

  fetch = async () => {
    try {
      this.setState({ data: remoteData.loading() });
      const result = await fakeFetch();
      this.setState({ data: remoteData.success(result.data) });
    } catch (e) {
      this.setState({ data: remoteData.failure(e) });
    }
  };
  
  handleAdd = (user) => () => {
    console.log(user);
  }
  
  render() {
    const { classes, user } = this.props;
    const { data } = this.state;
    
    let add_button = user.is_admin ?
      <Button variant="fab" mini aria-label="add" className={classes.button_add} color="primary" onClick={this.handleAdd(user)}>
        <AddIcon />
      </Button> :
      '';
    return (
      
        data.fold({
          NOT_LOADED: () => <div>Not Loaded</div>,
          LOADING: () => <CircularProgress />,
          FAILURE: error => <div>An error has happened</div>,
          SUCCESS: data => {
            return (
            <div>
            {add_button}
            <ul>
              {data.map(dat => (
                <li key={dat.id}>{dat.name}</li>
              ))}
            </ul>
            </div>
          )},
        })
      
    );
  }
}

/*
<h3>User List</h3>
        {data.fold({
          NOT_LOADED: () => <div>Not Loaded</div>,
          LOADING: () => <div>Loading...</div>,
          FAILURE: error => <div>An error has happened</div>,
          SUCCESS: data => (
            <ul>
              {data.map(dat => (
                <li key={dat.id}>{dat.name}</li>
              ))}
            </ul>
          ),
        })}
*/

export default withStyles(styles)(WallPanel);