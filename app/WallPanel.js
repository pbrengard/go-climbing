import React from 'react';
import { withStyles } from 'material-ui/styles';

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
  
});

class WallPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: remoteData.init() };
  }
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
  render() {
    const { data } = this.state;
    return (
      <div>
        <h3>User List</h3>
        {data.fold({
          NOT_LOADED: () => <div>Not Loaded</div>,
          LOADING: () => <div>Loading...</div>,
          FAILURE: error => <div>An error has happened</div>,
          SUCCESS: data => (
            <ul>
              {data.map(user => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          ),
        })}
      </div>
    );
  }
}

export default withStyles(styles)(WallPanel);