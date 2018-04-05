import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';

import FaceIcon from 'material-ui-icons/Face';


const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.background.canvasColor,
    cursor: 'pointer'
  },
});

class AvatarMenu extends React.Component {
  state = {
    open_avatar_menu: false,
    avatar_menu_anchorEl: null,
  };
  
  
  handleClickAvatar = (event) => {
    this.setState({ open_avatar_menu: true, avatar_menu_anchorEl: event.currentTarget });
  };
  
  handleCloseAvatarMenu = (event) => {
    this.setState({ open_avatar_menu: false });
  }
  
  
  render() {
    const { classes, user_info } = this.props;
    
    return (
      <div>
        <Avatar className={classes.avatar} src={user_info.picture} alt={user_info.displayName} onClick={this.handleClickAvatar}>
          {user_info.picture ? '' : <FaceIcon /> }
        </Avatar>
        
        <Router>
          <Menu
            id="avatar-menu"
            anchorEl={this.state.avatar_menu_anchorEl}
            open={this.state.open_avatar_menu}
            onClose={this.handleCloseAvatarMenu}
          > 
            <MenuItem
              onClick={this.handleCloseAvatarMenu}
              component={Link}
              to="/profile"
            >Profile
            </MenuItem>
          </Menu>
        </Router>
      </div>
    );
  }
}

export default withStyles(styles)(AvatarMenu);
