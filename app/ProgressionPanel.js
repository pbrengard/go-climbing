import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';


const styles = theme => ({
  panel: theme.mixins.gutters({
    padding: 16,
    margin: theme.spacing.unit * 3 + 'px auto',
  }),
});

class ProgressionPanel extends React.Component {
  state = {
    
  };

  render() {
    const { classes } = this.props;
    
    return (
        <Paper className={classes.panel} elevation={4}>
          <Typography type="headline" component="h3">
            This is a sheet of paper.
          </Typography>
          <Typography component="p">
            Paper can be used to build surface or other elements for your application.
          </Typography>
        </Paper>
    );
  }
}

export default withStyles(styles)(ProgressionPanel);
