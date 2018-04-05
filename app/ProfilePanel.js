import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Grid from 'material-ui/Grid';


const styles = theme => ({
  grid: {
    width: '100%',
    margin: 0,
  },
});

class ProfilePanel extends React.Component {
  state = {
    user_info: {},
  };
  
  componentWillMount() {
    console.log(this.props.user_id);
    //this.getDetailedUserInfo();
  }

  render() {
    const { classes } = this.props;
    
    return (
      <Grid
          container
          className={classes.grid}
          spacing={16}
          alignItems='center'
          direction='column'
          justify='center'
        >
      </Grid>
    );
  }
}

export default withStyles(styles)(ProfilePanel);
