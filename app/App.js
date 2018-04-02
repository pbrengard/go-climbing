/* global Plotly:true */

import React from 'react';
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';

import SettingsIcon from 'material-ui-icons/Settings';
import FaceIcon from 'material-ui-icons/Face';
import ShowChartIcon from 'material-ui-icons/ShowChart';
import ViewListIcon from 'material-ui-icons/ViewList';
import PeopleIcon from 'material-ui-icons/People';


import SignInDialog from './SignInDialog';
import SignUpPanel from './SignUpPanel';
import ProgressionPanel from './ProgressionPanel';
import ChallengePanel from './ChallengePanel';
import BuddiesPanel from './BuddiesPanel';


const styles = theme => ({
  app: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  button: {
    margin: theme.spacing.unit,
  },
  avatar: {
    backgroundColor: theme.palette.background.canvasColor,
    cursor: 'pointer'
  },
  bottom: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});

class App extends React.Component {
  state = {
    user_info: null,
    open_avatar_menu: false,
    anchorEl: null,
    bottom_nav_value: 1,
  };
  
  componentWillMount() {
    this.getUserInfo();
  }
  
  getUserInfo = () => {
    fetch('/auth/userinfo', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.log(responseJson.error);
      } else {
        this.setState({user_info: responseJson.data});
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  handleClickSignIn = (event) => {
    this.sign_in_dialog.show();
  }
  
  handleClickAvatar = (event) => {
    this.setState({ openAvatarMenu: true, anchorEl: event.currentTarget });
  };
  
  handleChangeNav = (event, value) => {
    this.setState({ bottom_nav_value: value });
  };
  
  render() {
    const { classes } = this.props;
    
    const signinButton = !this.state.user_info ?
      <Button color="inherit" onClick={this.handleClickSignIn}>
        {'Connexion'}
      </Button> :
      <Avatar className={classes.avatar} src={this.state.user_info.picture} alt={this.state.user_info.displayName} onClick={this.handleClickAvatar}>
        {this.state.user_info.picture ? '' : <FaceIcon /> }
      </Avatar>
      ;
    
    const progressionPanel = !this.state.user_info ?
      <SignUpPanel /> :
      <ProgressionPanel />
      ;
    const challengePanel = !this.state.user_info ?
      <SignUpPanel /> :
      <ChallengePanel user={this.state.user_info} />
      ;
    const buddiesPanel = <BuddiesPanel />;
      
    return (
      <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="display1" color="inherit" className={classes.flex}>
            go-climbing
          </Typography>
          {signinButton}
        </Toolbar>
      </AppBar>
      
      {this.state.bottom_nav_value === 0 && progressionPanel}
      {this.state.bottom_nav_value === 1 && challengePanel}
      {this.state.bottom_nav_value === 2 && buddiesPanel}
      
      <SignInDialog innerRef={instance => { this.sign_in_dialog = instance; }}/>
      
      <BottomNavigation
        value={this.state.bottom_nav_value}
        onChange={this.handleChangeNav}
        showLabels
        className={classes.stickToBottom}
      >
        <BottomNavigationAction label="Progression" icon={<ShowChartIcon />} />
        <BottomNavigationAction label="Challenge" icon={<ViewListIcon />} />
        <BottomNavigationAction label="Buddies" icon={<PeopleIcon />} />
      </BottomNavigation>

      </div>
    )
  }
}

export default withStyles(styles)(App);
