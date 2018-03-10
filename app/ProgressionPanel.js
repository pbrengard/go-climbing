import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Plot from 'react-plotly.js'

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
          <Plot 
            data={[
              {
                type: 'scatter',
                mode: 'lines+points',
                x: [1, 2, 3],
                y: [2, 6, 3],
                marker: {color: 'red'}
              },
              {
                type: 'bar',
                x: [1, 2, 3],
                y: [2, 5, 3]
              }
            ]}
      
            layout={{
              width: 320,
              height: 240,
              title: 'A Fancy Plot'
            }}
          />
        </Paper>
    );
  }
}

export default withStyles(styles)(ProgressionPanel);
