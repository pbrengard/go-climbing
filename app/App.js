/* global Plotly:true */

import React from 'react';
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import { Switch } from 'react-router';
import { HashRouter as Router, Route, Link } from 'react-router-dom';


import ShowChartIcon from 'material-ui-icons/ShowChart';
import ViewListIcon from 'material-ui-icons/ViewList';
import PeopleIcon from 'material-ui-icons/People';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';

import SignInDialog from './SignInDialog';
import SignUpPanel from './SignUpPanel';
import ProgressionPanel from './ProgressionPanel';
import ChallengePanel from './ChallengePanel';
import BuddiesPanel from './BuddiesPanel';
import ProfilePanel from './ProfilePanel';
import AvatarMenu from './AvatarMenu';


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
  
  handleChangeNav = (event, value) => {
    this.setState({ bottom_nav_value: value });
  };
  
  render() {
    const { classes } = this.props;
    
    const signinButton = !this.state.user_info ?
      <Button color="inherit" onClick={this.handleClickSignIn}>
        Connexion
      </Button> :
      <AvatarMenu user_info={this.state.user_info} />
      ;
    
    const progressionPanel = !this.state.user_info ?
      <SignUpPanel /> :
      <ProgressionPanel user_id={this.state.user_info.id} />
      ;
    const challengePanel = !this.state.user_info ?
      <SignUpPanel /> :
      <ChallengePanel user={this.state.user_info} />
      ;
    const buddiesPanel = <BuddiesPanel />;
    
    const ShowUser = (props) => {
      this.state.bottom_nav_value = 0;
      return <div>
          <Button variant="flat" color="primary" onClick={props.history.goBack}>
            <KeyboardArrowLeftIcon />
            Retour
          </Button>
          <ProgressionPanel user_id={props.match.params.id}/>
        </div>
        ;
    };
    
    const ShowProfile = (props) => {
      this.state.open_avatar_menu = false;
      if (this.state.user_info) {
        return <ProfilePanel user_id={this.state.user_info.id} />
        ;
      } else {
        return <div/>
      }
    };
    
    const bottomNav = 
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
      ;
    
    const MainComponent = () => {
      switch(this.state.bottom_nav_value) {
        case  0: return <div>{progressionPanel} {bottomNav}</div>;
        case  2: return <div>{buddiesPanel} {bottomNav}</div>;
        default: return <div>{challengePanel} {bottomNav}</div>;
      }
    };
    
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
        
        <Router>
          <Switch>
            <Route path='/profile' component={ShowProfile} />
            <Route path='/user/:id' component={ShowUser} />
            <Route component={MainComponent} />
          </Switch>
        </Router>
        
        <SignInDialog innerRef={instance => {this.sign_in_dialog = instance}}/>
      
      </div>
    );
  }
}

export default withStyles(styles)(App);
