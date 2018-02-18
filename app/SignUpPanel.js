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
    width: '50%',
    padding: 16,
    margin: theme.spacing.unit * 3 + 'px auto',
  }),
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 16,
    'flex-direction': 'column',
  },
  input: {
    margin: theme.spacing.unit,
  },
  disclaimer: {
    margin: theme.spacing.unit * 2,
  },
  error: {
    margin: theme.spacing.unit * 2,
  },
});

class SignUpPanel extends React.Component {
  state = {
    error: null,
    error_name: false,
    error_email: false,
    error_passwd: false,
    
  };
  
  
  render() {
    const { classes } = this.props;
    
    return (
        <Paper className={classes.panel} elevation={4}>
          <Typography variant="headline">
            Créer un compte
          </Typography>
          
          <div className={classes.container}>
            
              <Typography className={classes.disclaimer} >
                go-climbing n'utilisera votre adresse e-mail que pour les besoins du site, et ne la partagera ou vendra pas à d'autres entités.
              </Typography>
           
            <Button variant="raised" color="primary" href="/auth/google">
              Connexion avec Google
            </Button>
          </div>
        </Paper>
    );
  }
}

export default withStyles(styles)(SignUpPanel);
